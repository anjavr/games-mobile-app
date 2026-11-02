import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../providers/ThemeProvider";

const AppCard = ({
  children,
  style,
  contentStyle,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.text,
        },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

export default AppCard;

const styles = StyleSheet.create({
  card: {
    width: "90%",
    borderRadius: 20,
    borderWidth: 1.5,
    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
