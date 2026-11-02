import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/AppCard";
import GameEndModal from "../../../components/GameEndModal";
import GameModal from "../../../components/GameModal";
import Layout from "../../../components/Layout";
import MemoryCard from "../../../components/MemoryCard";
import SettingsModal from "../../../components/SettingsModal";
import Timer from "../../../components/Timer";

import { saveMemoryResult } from "../../../database/repository/result";
import { AuthContext } from "../../../providers/AuthProvider";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { MEMORY_THEMES } from "./data/themes";

const MemoryGameScreen = ({ route, navigation }) => {
  const { theme: selectedTheme } = route.params;
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const db = useSQLiteContext();

  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [giveUpVisible, setGiveUpVisible] = useState(false);

  const [endVisible, setEndVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  /* memory cards*/
  const createCards = () =>
    MEMORY_THEMES[selectedTheme]
      .flatMap((img, index) => [
        { id: `${selectedTheme}-${index}-a`, pairId: index, image: img },
        { id: `${selectedTheme}-${index}-b`, pairId: index, image: img },
      ])
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        isFlipped: false,
        isMatched: false,
      }));

  const [cardsState, setCardsState] = useState(createCards());
  const [selectedCards, setSelectedCards] = useState([]);

  /* timer */
  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused, gameOver]);

  /* game logic */
  const handleCardPress = (cardIndex) => {
    if (isPaused || gameOver) return;

    const card = cardsState[cardIndex];
    if (card.isFlipped || card.isMatched) return;

    const newCards = [...cardsState];
    newCards[cardIndex].isFlipped = true;

    const newSelected = [...selectedCards, cardIndex];
    setCardsState(newCards);
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstIndex, secondIndex] = newSelected;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;

        setCardsState(newCards);
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          const reverted = [...newCards];
          reverted[firstIndex].isFlipped = false;
          reverted[secondIndex].isFlipped = false;

          setCardsState(reverted);
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  /* game end */
  useEffect(() => {
    if (
      cardsState.length > 0 &&
      cardsState.every((card) => card.isMatched) &&
      !gameOver
    ) {
      setGameOver(true);

      const saveResult = async () => {
        try {
          const score = await saveMemoryResult(db, {
            userId: user.id,
            gameId: 2,
            moves,
            time,
          });

          setFinalScore(score);
          setEndVisible(true);
        } catch (err) {
          console.log("Save error:", err);
          navigation.goBack();
        }
      };

      setTimeout(saveResult, 300);
    }
  }, [cardsState, gameOver]);


  const handlePause = () => {
    setIsPaused(true);
    setSettingsVisible(false);
    setPauseVisible(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPauseVisible(false);
  };

  const handleGiveUp = () => {
    setSettingsVisible(false);
    setGiveUpVisible(true);
  };

  const handleConfirmGiveUp = () => {
    navigation.goBack();
  };

  return (
    <Layout
      navigation={navigation}
      showBack={false}
      showProfile={false}
      showSettings
      onSettingsPress={() => setSettingsVisible(true)}
    >
      <View style={styles.container}>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          {t("theme")}: {t(selectedTheme)}
        </Text>

        <Timer time={time} />

        <Text style={{ color: theme.text, marginBottom: 10 }}>
          {t("moves")}: {moves}
        </Text>

        <AppCard style={styles.board}>
          <View style={styles.grid}>
            {cardsState.map((card, index) => (
              <MemoryCard
                key={card.id}
                image={card.image}
                isFlipped={card.isFlipped || card.isMatched}
                backgroundColor={theme.accent}
                onPress={() => handleCardPress(index)}
              />
            ))}
          </View>
        </AppCard>
      </View>

      {/* modals */}
      <SettingsModal
        visible={settingsVisible}
        onPause={handlePause}
        onGiveUp={handleGiveUp}
        onClose={() => setSettingsVisible(false)}
      />

      <GameModal
        visible={pauseVisible}
        title={t("pausedTitle")}     
        message={t("pausedMessage")}  
        buttons={[{ label: t("continueButton"), onPress: handleResume }]}
        onClose={handleResume}
      />

      <GameModal
        visible={giveUpVisible}
        title={t("giveUpTitle")}       
        message={t("giveUpMessage")}   
        buttons={[
          { label: t("yes"), onPress: handleConfirmGiveUp },
          { label: t("no"), onPress: () => setGiveUpVisible(false) },
        ]}
        onClose={() => setGiveUpVisible(false)}
      />

      <GameEndModal
        visible={endVisible}
        result="win"
        time={time}
        score={finalScore}
        onClose={() => navigation.goBack()}
      />
    </Layout>
  );
};

export default MemoryGameScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.8,
    marginTop: 50,
  },
  board: {
    width: "90%",
    aspectRatio: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
});
