import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

const GameRulesScreen = ({ route, navigation }) => {
  const { gameId } = route.params;

  const db = useSQLiteContext();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const images = useAssets();

  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      const g = await getGameById(db, gameId);
      setGame(g);
    };

    fetchGame();
  }, [gameId]);

  if (!game) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.background2 }]}
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

      <AppCard style={{ width: "90%", paddingTop: 100, marginTop: 30 }}>
        <Text style={[styles.gameName, { color: theme.text }]}>
          {t(game.name)}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("howToPlay")}
        </Text>

        <Text style={[styles.rulesText, { color: theme.text }]}>
          {t(game.rules)}
        </Text>

        <FAB
          icon="youtube"
          label={t("watchTutorial")}
          size="medium"
          color="#fff"
          style={[
            styles.tutorialFab,
            { backgroundColor: theme.accent },
          ]}
          onPress={() => Linking.openURL(game.yt_link)}
        />
      </AppCard>
    </Layout>
  );
};

export default GameRulesScreen;

const styles = StyleSheet.create({
  floatingImage: {
    position: "absolute",
    width: width * 0.45,
    height: height * 0.18,
    zIndex: 10,
  },
  gameName: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
  },
  rulesText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    marginBottom: 20,
  },
  tutorialFab: {
    width: width * 0.6,
    alignSelf: "center",
    elevation: 5,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
