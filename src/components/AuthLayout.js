import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAssets } from "../providers/AssetsProvider";
import { LanguageContext } from "../providers/LanguageProvider";

const { width, height } = Dimensions.get("window");

export default function AuthLayout({ children }) {
  const { lang, switchLanguage } = useContext(LanguageContext);
  const images = useAssets();
  return (
    <View style={{ flex: 1, backgroundColor: '#FFA73D' }}>
      <LinearGradient
        colors={['#FFBF59', '#FFA73D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* lang */}
        <TouchableOpacity
          style={styles.langSwitch}
          onPress={() => switchLanguage(lang === "en" ? "sr" : "en")}
        >
          <Text style={styles.langText}>
            {lang === "en" ? "SR" : "EN"}
          </Text>
        </TouchableOpacity>

        <View style={styles.form}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: 30,
    marginBottom: -70,
  },
  form: {
    backgroundColor: "#fff",
    width: width * 0.85,
    borderRadius: 12,
    padding: 25,
    borderWidth: 2,
    borderColor: "#000",
    elevation: 12,
  },
  langSwitch: {
    position: "absolute",
    top: 50,
    right: 25,
    backgroundColor: "#185195",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  langText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
