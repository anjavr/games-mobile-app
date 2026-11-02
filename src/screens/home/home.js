import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

import Layout from "../../components/Layout";
import { useAssets } from "../../providers/AssetsProvider";
import { ThemeContext } from "../../providers/ThemeProvider";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const images = useAssets();
  
  return (
    <Layout navigation={navigation} showBack={false} showLogo={true}>

      <View style={styles.cubeContainer}>
        <Image
          source={images.cube}
          style={styles.cube}
          resizeMode="contain"
        />
      </View>

      {/* options */}
      <View style={styles.buttonsWrapper}>
        <FAB
          mode="extended"
          label={t("gamesButton")}
          onPress={() => navigation.navigate("Games")}
          style={[styles.extendedFab, { backgroundColor: theme.accent }]}
          color="#fff"
        />

        <FAB
          mode="extended"
          label={t("scoresButton")}
          onPress={() => navigation.navigate("Scores")}
          style={[styles.extendedFab, { backgroundColor: theme.accent }]}
          color="#fff"
        />

        <FAB
          mode="extended"
          label={t("settingsButton")}
          onPress={() => navigation.navigate("Settings")}
          style={[styles.extendedFab, { backgroundColor: theme.accent }]}
          color="#fff"
        />
      </View>
    </Layout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({

  cubeContainer: {
    alignItems: "center",
    marginTop: -height * 0.09,
  },

  cube: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: 40,
    transform: [{ rotate: "9deg" }],
  },

  buttonsWrapper: {
    width: width * 0.85,
    marginTop: 40,
    gap: 20,
    alignItems: "center",
  },

  extendedFab: {
    borderRadius: 8,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    elevation: 6,
    width: width * 0.6,
  },
});
