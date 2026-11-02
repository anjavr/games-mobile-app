import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import AppCard from "../../../components/AppCard";
import Layout from "../../../components/Layout";
import ThemeSelector from "../../../components/ThemeSelector";
import { ThemeContext } from "../../../providers/ThemeProvider";

const MemoryStartScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const themes = [
    { name: "nature", label: `🌿 ${t("nature")}` },
    { name: "sport", label: `⚽ ${t("sport")}` },
    { name: "gaming", label: `🎮 ${t("gaming")}` },
  ];

  return (
    <Layout navigation={navigation} showLogo>
      <AppCard style={styles.card}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t("chooseTheme")}
        </Text>

        {themes.map(({ name, label }) => (
          <ThemeSelector
            key={name}
            theme={theme}
            label={label}
            onPress={() =>
              navigation.navigate("MemoryScreen", { theme: name })
            }
          />
        ))}
      </AppCard>
    </Layout>
  );
};

export default MemoryStartScreen;

const styles = StyleSheet.create({
  card: {
    width: "85%",
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },
});
