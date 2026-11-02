import { StyleSheet, Text } from "react-native";

const Timer = ({ time = 0, style }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <Text style={[styles.timerText, style]}>
      {formattedTime}
    </Text>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Timer;
