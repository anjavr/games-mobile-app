import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppCard from "../../../components/AppCard";
import GameEndModal from "../../../components/GameEndModal";
import GameModal from "../../../components/GameModal";
import Layout from "../../../components/Layout";
import SettingsModal from "../../../components/SettingsModal";
import SudokuGrid from "../../../components/SudokuGrid";
import Timer from "../../../components/Timer";

import { saveSudokuResult } from "../../../database/repository/result";
import { useAuth } from "../../../providers/AuthProvider";
import { ThemeContext } from "../../../providers/ThemeProvider";

/* generate random sudoku board */
const generateFullBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  const isSafe = (row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }
    const sr = row - (row % 3);
    const sc = col - (col % 3);
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        if (board[sr + r][sc + c] === num) return false;

    return true;
  };

  const fill = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let n of nums) {
            if (isSafe(r, c, n)) {
              board[r][c] = n;
              if (fill()) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fill();
  return board;
};

const generateSudoku = (level) => {
  const solution = generateFullBoard();
  const board = solution.map((r) => [...r]);

  let clues = 32;
  if (level === "easy") clues = 40;
  if (level === "hard") clues = 24;

  let remove = 81 - clues;
  while (remove > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      remove--;
    }
  }

  return { board, solution };
};

/* score*/
const getMultiplier = (level) => {
  if (level === "easy") return 1;
  if (level === "medium") return 1.5;
  if (level === "hard") return 2;
  return 1;
};

const calculateSudokuScore = ({ level, time, mistakes }) => {
  let score = 1000 * getMultiplier(level) - time * 1 - mistakes * 50;
  if (mistakes === 0) score += 300;
  if (time < 300) score += 200;
  return Math.max(Math.floor(score), 0);
};

const getWrongCells = (board) => {
  const wrongs = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      if (value === 0) continue;

      // row
      for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === value) {
          wrongs.push({ row: r, col: c });
          break;
        }
      }

      // column
      for (let i = 0; i < 9; i++) {
        if (i !== r && board[i][c] === value) {
          wrongs.push({ row: r, col: c });
          break;
        }
      }

      // 3x3 box
      const sr = r - (r % 3);
      const sc = c - (c % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const rr = sr + i;
          const cc = sc + j;
          if ((rr !== r || cc !== c) && board[rr][cc] === value) {
            wrongs.push({ row: r, col: c });
            break;
          }
        }
      }
    }
  }

  // remove duplicates
  const unique = [];
  const map = {};
  wrongs.forEach(({ row, col }) => {
    const key = `${row}-${col}`;
    if (!map[key]) {
      unique.push({ row, col });
      map[key] = true;
    }
  });

  return unique;
};

/* checking if solution is valid */
const isValidSudoku = (board) => {
  for (let r = 0; r < 9; r++) {
    const seen = new Set();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) return false; 
      if (seen.has(val)) return false;
      seen.add(val);
    }
  }

  for (let c = 0; c < 9; c++) {
    const seen = new Set();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (seen.has(val)) return false;
      seen.add(val);
    }
  }

  for (let sr = 0; sr < 9; sr += 3) {
    for (let sc = 0; sc < 9; sc += 3) {
      const seen = new Set();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const val = board[sr + r][sc + c];
          if (seen.has(val)) return false;
          seen.add(val);
        }
      }
    }
  }

  return true;
};

const SudokuScreen = ({ route, navigation }) => {
  const { level } = route.params;
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const db = useSQLiteContext();
  const { t } = useTranslation();

  const [board, setBoard] = useState(Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [fixed, setFixed] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [selected, setSelected] = useState({});
  const [time, setTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [giveUpVisible, setGiveUpVisible] = useState(false);

  const [winVisible, setWinVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const [wrongCells, setWrongCells] = useState([]);
  const CELL = Math.floor((Dimensions.get("window").width - 60) / 9);

  /* board */
  useEffect(() => {
    const { board, solution } = generateSudoku(level);
    setBoard(board);
    setSolution(solution);
    setFixed(board.map((r) => r.map((c) => c !== 0)));
    setSelected({});
    setMistakes(0);
    setTime(0);
    setGameOver(false);
    setIsPaused(false);
  }, [level]);

  /* timer */
  useEffect(() => {
    if (isPaused || gameOver) return;
    const interval = setInterval(() => setTime((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused, gameOver]);

  /* player input */
  const handleNumberPress = async (num) => {
    if (!selected || isPaused || gameOver) return;
    const { row, col } = selected;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    if (solution[row][col] !== num) setMistakes((m) => m + 1);
    setWrongCells(getWrongCells(newBoard));

    if (isValidSudoku(newBoard)) {
  setGameOver(true);

  const score = calculateSudokuScore({ level, time, mistakes });
  setFinalScore(score);
  setWinVisible(true);

  try {
    await saveSudokuResult(db, {
      userId: user.id,
      gameId: 3,
      score,
      datePlayed: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Save error:", err);
  }
}
  };

  return (
    <Layout
      navigation={navigation}
      showSettings
      showProfile={false}
      showBack={false}
      onSettingsPress={() => setSettingsVisible(true)}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.level, { color: theme.text }]}>
          {t("difficulty")}: {t(level)}
        </Text>

        <Timer time={time} />

        <AppCard style={styles.board}>
          <SudokuGrid
            board={board}
            fixedCells={fixed}
            wrongCells={wrongCells}
            selectedCell={selected}
            onCellPress={(r, c) => !fixed[r][c] && setSelected({ row: r, col: c })}
            cellSize={CELL}
            theme={theme}
          />
        </AppCard>

        <View style={styles.row}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.btn, { backgroundColor: theme.card }]}
              onPress={() => handleNumberPress(n)}
            >
              <Text style={{ color: theme.text, fontSize: 18 }}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* modals */}
      <GameEndModal
        visible={winVisible}
        result="win"
        time={time}
        score={finalScore}
        onClose={() => navigation.goBack()}
      />

      <SettingsModal
        visible={settingsVisible}
        onPause={() => {
          setIsPaused(true);
          setSettingsVisible(false);
          setPauseVisible(true);
        }}
        onGiveUp={() => {
          setSettingsVisible(false);
          setGiveUpVisible(true);
        }}
        onClose={() => setSettingsVisible(false)}
      />

      <GameModal
        visible={pauseVisible}
        title={<Text>{t("pausedTitle")}</Text>}     
        message={<Text>{t("pausedMessage")}</Text>} 
        buttons={[
          {
            label: "continueButton",     
            onPress: () => {
              setIsPaused(false);
              setPauseVisible(false);
            },
          },
        ]}
        onClose={() => {
          setIsPaused(false);
          setPauseVisible(false);
        }}
      />

      <GameModal
        visible={giveUpVisible}
        title={<Text>{t("giveUpTitle")}</Text>}
        message={<Text>{t("giveUpMessage")}</Text>}  
        buttons={[
          { label: "yes", onPress: () => navigation.goBack() },   
          { label: "no", onPress: () => setGiveUpVisible(false) }, 
        ]}
        onClose={() => setGiveUpVisible(false)}
      />

    </Layout>
  );
};

export default SudokuScreen;

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 20 },
  level: { fontSize: 16, marginBottom: 8, marginTop: 20 },
  board: { padding: 6, marginVertical: 10, alignItems: "center" },
  row: { flexDirection: "row", width: "90%", marginTop: 10 },
  btn: {
    flex: 1,
    height: 42,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
