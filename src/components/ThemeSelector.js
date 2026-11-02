import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

const ThemeSelector = ({ theme, label, onPress }) => {
  return (
    <FAB
      label={label.toUpperCase()}
      small={false}
      style={[
        styles.fab,
        {
          backgroundColor: theme.accent,
          borderColor: theme.text,
          borderWidth: 2,
        },
      ]}
      color={theme.card}
      onPress={onPress}
    />
  );
};

export default ThemeSelector;

const styles = StyleSheet.create({
  fab: {
    width: 200,
    height: 50,
    marginBottom: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
