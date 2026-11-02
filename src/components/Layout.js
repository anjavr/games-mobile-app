import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAssets } from "../providers/AssetsProvider";
import { ThemeContext } from "../providers/ThemeProvider";
const Layout = ({
  children,
  navigation,
  showBack = true,
  showProfile = true,
  showLogo = false,
  showSettings = false,
  onSettingsPress,
}) => {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const images = useAssets();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.background1, theme.background2]}
        style={styles.container}
      >
        {/* header */}
        {(showBack || showProfile || showSettings) && (
          <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>

            {showBack ? (
              <FAB
                icon="arrow-left"
                size="small"
                color="#fff"
                style={[styles.fab, { backgroundColor: theme.accent }]}
                onPress={() => navigation.goBack()}
              />
            ) : (
              <View style={styles.fabPlaceholder} />
            )}

            {showSettings ? (
              <FAB
                icon="cog"
                size="small"
                color="#fff"
                style={[styles.fab, { backgroundColor: theme.accent }]}
                onPress={onSettingsPress} 
              />
            ) : (
              <View style={styles.fabPlaceholder} />
            )}

            {showProfile ? (
              <FAB
                icon="account"
                size="small"
                color="#fff"
                style={[styles.fab, { backgroundColor: theme.accent }]}
                onPress={() => navigation.navigate("Profile")}
              />
            ) : (
              <View style={styles.fabPlaceholder} />
            )}
          </View>
        )}

        {/* logo */}
        {showLogo && (
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
};


export default Layout;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  fab: {
    elevation: 8,
  },

  fabPlaceholder: {
    width: 40,
    height: 40,
  },

   logo: {
    width: "70%",
    height: 140,
    alignSelf: "center",
    marginBottom: 10,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
