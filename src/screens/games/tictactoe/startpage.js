import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text } from "react-native";
import { FAB } from "react-native-paper";
import AppCard from "../../../components/AppCard";
import Layout from "../../../components/Layout";
import SymbolSelector from "../../../components/SymbolSelector";
import { ThemeContext } from "../../../providers/ThemeProvider";

const { width } = Dimensions.get("window");

const TTTStartScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [selectedSymbol, setSelectedSymbol] = useState("X");

  return (
    <Layout navigation={navigation} showLogo={true}>
        <AppCard style={{ height: "70%" }}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("chooseYourSide")}
          </Text>

          <SymbolSelector
            selectedSymbol={selectedSymbol}
            onSelect={setSelectedSymbol}
          />

          <FAB
            label={t("continueButton")}
            icon="arrow-right"
            color="#fff"
            style={[styles.continueFab, { backgroundColor: theme.accent }]}
            onPress={() =>
              navigation.navigate("TicTacToeScreen", {
                playerSymbol: selectedSymbol,
              })
            }
          />
        </AppCard>
    </Layout>
  );
};

export default TTTStartScreen;

const styles = StyleSheet.create({

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 25,
    alignSelf: "center",
  },

  symbolRow: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 30,
    justifyContent: "center",
  },

  symbolBox: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },

  selected: {
    borderColor: "#000",
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  symbolImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },

  continueFab: {
    width: width * 0.5,
    borderWidth: 1.5,
    borderColor: "#000",
    elevation: 6,
    alignSelf: "center",
    marginTop: 20,
  },
});
