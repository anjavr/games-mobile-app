import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";

import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import AppCard from "../../components/AppCard";
import Layout from "../../components/Layout";
import { getGames } from "../../database/repository/game";
import { useAssets } from "../../providers/AssetsProvider";
import { ThemeContext } from "../../providers/ThemeProvider";

const { width, height } = Dimensions.get("window");

const gameImageKey = {
  ticTacToe: "tttlogo",
  sudoku: "sudokulogo",
  memoryGame: "memorylogo",
};


const GamesScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const images = useAssets();
  
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchGames = async () => {
      const allGames = await getGames(db);
      setGames(allGames);
    };
    fetchGames();
  }, []);

  const renderItem = ({ item }) => (
  <AppCard style={{ width: width * 0.97, marginTop: -50 }}>
    
    <Image
      source={images[gameImageKey[item.name]]}
      style={styles.gameImage}
      resizeMode="contain"
    />

    <Text style={[styles.gameName, { color: theme.text }]}>
      {t(item.name)}
    </Text>

    <Text style={[styles.gameShortDesc, { color: theme.text }]}>
      {t(item.short_description)}
    </Text>

    <FAB
      icon="play"
      size="medium"
      color="#fff"
      label={t("selectButton")}
      style={[styles.playFab, { backgroundColor: theme.accent }]}
      onPress={() =>
        navigation.navigate("GameDetails", { gameId: item.id })
      }
    />
  </AppCard>
);


  return (
    <Layout navigation={navigation} showBack showProfile showLogo={true}>
      <View>
        {games.length > 0 && (
          <Carousel
            ref={carouselRef}
            data={games}
            renderItem={renderItem}
            loop
            width={width}
            height={height * 0.50}
            mode="parallax"
            modeConfig={{
              parallaxScrollingOffset: 110,
              parallaxAdjacentItemScale: 0.65,
            }}
            onSnapToItem={setCurrentIndex}
          />
        )}
      </View>

      <View style={styles.controls}>
        <FAB
          icon="chevron-left"
          color="#fff"
          style={[styles.arrowFab, { backgroundColor: theme.accent }]}
          onPress={() => carouselRef.current?.prev()}
        />
        <FAB
          icon="chevron-right"
          color="#fff"
          style={[styles.arrowFab, { backgroundColor: theme.accent }]}
          onPress={() => carouselRef.current?.next()}
        />
      </View>
    </Layout>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  gameImage: {
    width: "100%",
    height: height * 0.25,
    marginBottom: 30,
  },

  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  gameShortDesc: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },

  playFab: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#000",
    alignSelf: "center",
    elevation: 5,
    width: width * 0.5,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 50,
  },

  arrowFab: {
    elevation: 5,
  },
});
