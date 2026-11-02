import { LinearGradient } from "expo-linear-gradient";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { FAB, Searchbar } from "react-native-paper";

import { getLeaderboard } from "../../database/repository/result";
import { ThemeContext } from "../../providers/ThemeProvider";

const { width, height } = Dimensions.get("window");

const ScoresScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const db = useSQLiteContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getLeaderboard(db);
      setResults(data);
    };
    fetchResults();
  }, []);

  const filteredResults = results
    .filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        r.username.toLowerCase().includes(q) ||
        t(r.game_name).toLowerCase().includes(q) ||
        r.score.toString().includes(q) ||
        (r.datePlayed && r.datePlayed.includes(q))
      );
    })
    .filter((r) => {
      const now = new Date();
      const playedDate = new Date(r.datePlayed);
      if (timeFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return playedDate >= oneWeekAgo && playedDate <= now;
      }
      return true; 
    });

  const getMedal = (index) => {
    if (index === 0) return require("../../../assets/goldmedal.png");
    if (index === 1) return require("../../../assets/silvermedal.png");
    if (index === 2) return require("../../../assets/bronzemedal.png");
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.background1, theme.background2]}
        style={styles.container}
      >
        <FAB
          icon="arrow-left"
          size="small"
          color="#fff"
          style={[styles.backFab, { backgroundColor: theme.accent }]}
          onPress={() => navigation.goBack()}
        />

        <FAB
          icon="account"
          size="small"
          color="#fff"
          style={[styles.userFab, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("Profile")}
        />

        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* search*/}
        <Searchbar
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchBar, { backgroundColor: theme.card }]}
          inputStyle={{ color: theme.text }}
          iconColor={theme.text}
          placeholderTextColor={theme.text}
          elevation={3}
        />

        {/* result card */}
        <View
  style={[styles.card, { backgroundColor: theme.card, borderColor: theme.text }]}
>
  <Text style={[styles.title, { color: theme.text }]}>{t("leaderboardTitle")}</Text>

  {filteredResults.length === 0 ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
      <Text style={{ color: theme.text, fontSize: 16, opacity: 0.7 }}>
        {t("noResultsFound")}
      </Text>
    </View>
  ) : (
    <FlatList
      data={filteredResults}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
      renderItem={({ item, index }) => (
        <View style={[styles.resultCard, { backgroundColor: theme.background1 }]}>
          <View style={styles.place}>
            {getMedal(index) ? (
              <Image source={getMedal(index)} style={styles.medal} />
            ) : (
              <Text style={[styles.placeText, { color: theme.text }]}>{index + 1}</Text>
            )}
          </View>

          <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>

          <Text style={[styles.gameName, { color: theme.text }]}>{t(item.game_name)}</Text>

          <Text style={[styles.score, { color: theme.accent }]}>{item.score}</Text>
        </View>
      )}
    />
  )}
</View>
      </LinearGradient>
    </View>
  );
};

export default ScoresScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  logo: {
    width: width * 0.7,
    height: height * 0.25,
    marginTop: 30,
    marginBottom: -55,
    alignSelf: "center",
  },

  backFab: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },

  userFab: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  timeFilter: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },

  searchBar: {
    borderRadius: 14,
    marginBottom: 12,
    width: "95%",
  },

  card: {
  width: "95%",
  height: height * 0.55, 
  borderRadius: 22,
  paddingVertical: 16,
  paddingHorizontal: 12, 
  borderWidth: 1.5,     
},

resultCard: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,    
  paddingHorizontal: 10,
  borderRadius: 14,
  marginBottom: 8,
  elevation: 2,
},

  place: {
    width: 36,
    alignItems: "center",
  },

  placeText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  medal: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  username: {
    flex: 1.2,
    fontSize: 15,
    fontWeight: "600",
  },

  gameName: {
    flex: 1.3,
    fontSize: 14,
    opacity: 0.85,
  },

  score: {
    width: 50,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
  },
});
