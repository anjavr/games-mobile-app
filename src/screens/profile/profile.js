import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { FAB } from "react-native-paper";
import Layout from "../../components/Layout";
import { getBestScoreForGame } from "../../database/repository/result";
import { AuthContext } from "../../providers/AuthProvider";
import { ThemeContext } from "../../providers/ThemeProvider";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const userId = user?.id;

  const db = useSQLiteContext();
  const { t } = useTranslation();

  const [scores, setScores] = useState({
    xox: null,
    memory: null,
    sudoku: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfileData = async () => {
      try {
        const xoxScore = await getBestScoreForGame(db, userId, 1);
        const memoryScore = await getBestScoreForGame(db, userId, 2);
        const sudokuScore = await getBestScoreForGame(db, userId, 3);

        setScores({
          xox: xoxScore,
          memory: memoryScore,
          sudoku: sudokuScore,
        });
      } catch (error) {
        console.error("Greška pri učitavanju profila:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userId]);



   return (
    <Layout navigation={navigation} showBack showLogo showProfile={false}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.text, borderWidth: 1.5 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("account")}
        </Text>

        <Text style={[styles.label, { color: theme.text + "99" }]}>
          {t("username")}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {user?.username}
        </Text>

        <Text style={[styles.label, { color: theme.text + "99" }]}>
          {t("password")}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          ••••••••
        </Text>


      {/* user best scores */}
       <Text
          style={[
            styles.sectionTitle,
            { marginTop: 25, color: theme.text },
          ]}
        >
          {t("bestScores")}
        </Text>

        {[
          ["XOX", scores.xox],
          ["Memory", scores.memory],
          ["Sudoku", scores.sudoku],
        ].map(([label, value]) => (
          <View
            key={label}
            style={[
              styles.scoreRow,
              { borderBottomColor: theme.text + "22" },
            ]}
          >
            <Text style={[styles.scoreLabel, { color: theme.text }]}>
              {label}
            </Text>
            <Text style={[styles.scoreValue, { color: theme.accent }]}>
              {value ?? "-"}
            </Text>
          </View>
        ))}
      </View>

      <FAB
      icon="logout"
      label={t("logout")}
      size="medium"
      color="#fff"
      style={[styles.logoutFab, { backgroundColor: theme.accent }]}
      onPress={logout}
    />
    </Layout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 14,
    padding: 30,
    elevation: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
    marginBottom: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 5,
  },

  passwordBtn: {
    marginTop: 15,
    alignSelf: "flex-start",
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  scoreLabel: {
    fontSize: 15,
    color: "#444",
  },

  scoreValue: {
    fontSize: 15,
    fontWeight: "bold",
  },

  logoutFab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "55%",
    elevation: 5,
    borderWidth: 1.5,
    borderColor: "#000",
  },
});
