import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";

import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import AppCard from "../../components/AppCard";
import Layout from "../../components/Layout";
import { getGameById } from "../../database/repository/game";
import { useAssets } from "../../providers/AssetsProvider";
import { ThemeContext } from "../../providers/ThemeProvider";

const { width, height } = Dimensions.get("window");

const gameImageKey = {
  ticTacToe: "tttlogo",
  sudoku: "sudokulogo",
  memoryGame: "memorylogo",
};

const GameDetailsScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [game, setGame] = useState(null);
  const images = useAssets();

  console.log("Received gameId:", gameId);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const g = await getGameById(db, gameId);
        console.log("Fetched game:", g);
        setGame(g);
      } catch (err) {
        console.error("Error fetching game:", err);
      }
    };
    fetchGame();
  }, [gameId]);

  if (!game) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background2 },
        ]}
      >
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Image
        source={images[gameImageKey[game.name]]}
        style={styles.floatingImage}
        resizeMode="contain"
      />

      <AppCard style={{ width: "90%", paddingTop: 100, marginTop: 100 }}>
        <Text style={[styles.gameName, { color: theme.text }]}>
          {t(game.name)}
        </Text>

        <Text style={[styles.gameDescription, { color: theme.text }]}>
          {t(game.description)}
        </Text>

        <FAB
          icon="play"
          label={t("playButton")}
          size="medium"
          color="#fff"
          style={[styles.playFab, { backgroundColor: theme.accent }]}
          onPress={() => {
            if (game.id === 1) {
              navigation.navigate("TTTStart");
            } else if (game.id === 2) {
              navigation.navigate("MemoryStart");
            } else if (game.id === 3) {
              navigation.navigate("SudokuStart");
            }
          }}
        />

        <Text style={[styles.hintText, { color: theme.text }]}>
          {t("dontKnowHowToPlay")}
        </Text>

        <FAB
          icon="book-open-variant"
          label={t("rulesButton")}
          size="medium"
          color="#fff"
          style={[styles.rulesFab, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("GameRules", { gameId })}
        />
      </AppCard>
    </Layout>
  );
};

export default GameDetailsScreen;

const styles = StyleSheet.create({
  floatingImage: {
    position: "absolute",
    width: width * 0.65,
    height: height * 0.25,
    zIndex: 10,
  },
  gameName: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  gameDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  playFab: {
    width: width * 0.55,
    borderWidth: 1.5,
    borderColor: "#000",
    marginTop: 10,
    marginBottom: 15,
    alignSelf: "center",
    elevation: 5,
  },
  hintText: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: "center",
    opacity: 0.85,
  },
  rulesFab: {
    width: width * 0.55,
    borderWidth: 1.5,
    borderColor: "#000",
    marginBottom: 10,
    alignSelf: "center",
    elevation: 5,
  },
});
