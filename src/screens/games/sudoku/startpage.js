import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import AppCard from "../../../components/AppCard";
import Layout from "../../../components/Layout";
import LevelSelector from "../../../components/LevelSelector";
import { ThemeContext } from "../../../providers/ThemeProvider";

const SudokuStartScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const startGame = (level) => {
    navigation.navigate("SudokuScreen", { level });
  };

  const levels = [
    { label: t("easy"), value: "easy" },
    { label: t("medium"), value: "medium" },
    { label: t("hard"), value: "hard" },
  ];

  return (
    <Layout navigation={navigation} showLogo>
      <AppCard style={styles.card}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t("chooseDifficulty")}
        </Text>

        <LevelSelector
          levels={levels}
          onSelectLevel={startGame}
          theme={theme}
        />
      </AppCard>
    </Layout>
  );
};

export default SudokuStartScreen;

const styles = StyleSheet.create({
  card: {
    width: "85%",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 25,
    textAlign:"center",
  },
});
