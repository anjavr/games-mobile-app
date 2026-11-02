import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../providers/ThemeProvider";
import GameModal from "./GameModal";

const GameEndModal = ({
  visible,
  result,
  time,
  score,
  onClose,
}) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const getTitle = () => {
    if (result === "win") return "🎉 " + t("youWin");
    if (result === "lose") return "😢 " + t("youLose");
    if (result === "draw") return "🤝 " + t("draw");
    return t("gameOver");
  };

  return (
    <GameModal
      visible={visible}
      title={getTitle()}
      message=""
      buttons={[
        { label: t("ok"), onPress: onClose }
      ]}
      onClose={onClose}
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>
          ⏱ {t("time")}: {time}s
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          ⭐ {t("score")}: {score}
        </Text>
      </View>
    </GameModal>
  );
};

export default GameEndModal;

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});
