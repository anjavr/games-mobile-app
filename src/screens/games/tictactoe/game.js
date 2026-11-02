import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import AppCard from "../../../components/AppCard";
import GameEndModal from "../../../components/GameEndModal";
import GameModal from "../../../components/GameModal";
import Layout from "../../../components/Layout";
import SettingsModal from "../../../components/SettingsModal";
import TicTacToeGrid from "../../../components/TicTacToeGrid";
import Timer from "../../../components/Timer";

import { saveTicTacToeResult } from "../../../database/repository/result";
import { useAuth } from "../../../providers/AuthProvider";
import { ThemeContext } from "../../../providers/ThemeProvider";

const TicTacToeScreen = ({ route, navigation }) => {
  const db = useSQLiteContext();
  const { playerSymbol } = route.params;
  const computerSymbol = playerSymbol === "X" ? "O" : "X";

  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const difficulty = "medium"; // easy | medium | hard

  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [giveUpVisible, setGiveUpVisible] = useState(false);

  const [endVisible, setEndVisible] = useState(false);
  const [winnerState, setWinnerState] = useState(null);

  /* timer */
  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver, isPaused]);

  /* check winner */
  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], //diagonals
    ];

    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }

    if (!b.includes(null)) return "Draw";
    return null;
  };

  /* game end */
  const handleGameOver = async (winner) => {
    setGameOver(true);
    setWinnerState(winner);

    if (winner === playerSymbol || winner === "Draw") {
      try {
        await saveTicTacToeResult(db, {
          userId: user.id,
          gameId: 1,
          winner,
          playerSymbol,
          moves: board.filter(c => c !== null).length,
          difficulty,
        });
      } catch (err) {
        console.error("Save error:", err);
      }
    }

    setTimeout(() => setEndVisible(true), 300);
  };

  /* player moves */
  const makeMove = (index, symbol) => {
    if (board[index] || gameOver || isPaused) return;

    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameOver(winner);
      return;
    }

    setCurrentPlayer(p => (p === "X" ? "O" : "X"));
  };

  /* ai moves */
  const getRandomMove = (b) => {
    const empty = b.map((v, i) => (v === null ? i : null)).filter(i => i !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const getSmartMove = (b, ai, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    // win
    for (let line of lines) {
      const vals = line.map(i => b[i]);
      if (vals.filter(v => v === ai).length === 2 && vals.includes(null))
        return line[vals.indexOf(null)];
    }

    // block
    for (let line of lines) {
      const vals = line.map(i => b[i]);
      if (vals.filter(v => v === player).length === 2 && vals.includes(null))
        return line[vals.indexOf(null)];
    }

    if (!b[4]) return 4;
    const corners = [0, 2, 6, 8].filter(i => !b[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    return getRandomMove(b);
  };

  const getBestMove = (b) => {
    if (difficulty === "easy") return Math.random() < 0.8 ? getRandomMove(b) : getSmartMove(b, computerSymbol, playerSymbol);
    if (difficulty === "medium") return Math.random() < 0.5 ? getRandomMove(b) : getSmartMove(b, computerSymbol, playerSymbol);
    return getSmartMove(b, computerSymbol, playerSymbol);
  };

  const computerMove = () => {
    const index = getBestMove(board);
    makeMove(index, computerSymbol);
  };

  useEffect(() => {
    if (!gameOver && currentPlayer === computerSymbol && !isPaused) {
      const aiTimer = setTimeout(computerMove, 600);
      return () => clearTimeout(aiTimer);
    }
  }, [currentPlayer, board, isPaused]);

  /* pause modal*/
  const handlePause = () => {
    setIsPaused(true);
    setSettingsVisible(false);
    setPauseVisible(true);
  };

  return (
    <Layout
      navigation={navigation}
      showSettings
      showLogo={false}
      showProfile={false}
      showBack={false}
      onSettingsPress={() => setSettingsVisible(true)}
    >
      <View style={{ alignItems: "center", marginTop: 80 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", color: theme.text }}>
          {gameOver ? "Game Over" : `${currentPlayer}'s turn`} |{" "}
          <Timer time={timer} isPaused={isPaused} gameOver={gameOver} />
        </Text>
      </View>

      <AppCard style={styles.boardCard}>
        <TicTacToeGrid
          board={board}
          onCellPress={(i) => {
            if (currentPlayer === playerSymbol) makeMove(i, playerSymbol);
          }}
          cellBorderColor={theme.text}
        />
      </AppCard>

    {/* modals*/}
      <SettingsModal
        visible={settingsVisible}
        onPause={handlePause}
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


      <GameEndModal
        visible={endVisible}
        result={
          winnerState === "Draw" ? "draw" :
          winnerState === playerSymbol ? "win" : "lose"
        }
        time={timer}
        score={board.filter(c => c !== null).length} 
        onClose={() => navigation.goBack()}
      />
    </Layout>
  );
};

export default TicTacToeScreen;

const styles = StyleSheet.create({
  boardCard: {
    width: "90%",
    aspectRatio: 1,
    marginVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
