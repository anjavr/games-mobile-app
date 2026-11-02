import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

const LevelSelector = ({ levels = [], onSelectLevel, theme }) => {
  return (
    <View style={styles.container}>
      {levels.map((level) => (
        <FAB
          key={level.value}
          label={level.label}
          small={false} 
          style={[styles.fab, {
            backgroundColor: theme.accent,
            borderColor: theme.text,
            borderWidth: 2,
          }]}
          color={theme.card}
          onPress={() => onSelectLevel(level.value)}
        />
      ))}
    </View>
  );
};

export default LevelSelector;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  fab: {
    width: 200,
    height: 50,
    marginBottom: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
