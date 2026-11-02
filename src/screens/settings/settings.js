import { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { RadioButton } from "react-native-paper";

import AppCard from "../../components/AppCard";
import Layout from "../../components/Layout";
import { LanguageContext } from "../../providers/LanguageProvider";
import { ThemeContext } from "../../providers/ThemeProvider";

const { width, height } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const { lang, switchLanguage } = useContext(LanguageContext);
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Layout navigation={navigation} showBack showProfile showLogo={true}>

    <AppCard style={{ width: width * 0.85, height: height * 0.50 }}>

        <Text style={[styles.title, { color: theme.text }]}>
          {t("settingsTitle")}
        </Text>

        {/* lang */}
        <Text style={[styles.optionLabel, { color: theme.text }]}>
          {t("language")}
        </Text>

        <View
          style={[
            styles.radioRow,
            { backgroundColor: theme.themeback, borderColor: theme.accent },
          ]}
        >
          <RadioButton
            value="en"
            status={lang === "en" ? "checked" : "unchecked"}
            onPress={() => switchLanguage("en")}
            color={theme.accent}
          />
          <TouchableOpacity onPress={() => switchLanguage("en")}>
            <Text style={[styles.radioText, { color: theme.text }]}>
              {t("english")}
            </Text>
          </TouchableOpacity>

          <RadioButton
            value="sr"
            status={lang === "sr" ? "checked" : "unchecked"}
            onPress={() => switchLanguage("sr")}
            color={theme.accent}
          />
          <TouchableOpacity onPress={() => switchLanguage("sr")}>
            <Text style={[styles.radioText, { color: theme.text }]}>
              {t("serbian")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* theme*/}
        <Text
          style={[
            styles.optionLabel,
            { marginTop: 40, color: theme.text },
          ]}
        >
          {t("theme")}
        </Text>

        <View
          style={[
            styles.themeRow,
            { backgroundColor: theme.themeback, borderColor: theme.accent },
          ]}
        >
          <Text style={[styles.radioText, { color: theme.text }]}>
            {t("darkTheme")}
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: theme.accent }}
            thumbColor="#fff"
          />
        </View>
      </AppCard>
    </Layout>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 35,
  },

  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    borderWidth: 2,
  },

  radioText: {
    fontSize: 16,
    marginRight: 20,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 20,
  },
});
