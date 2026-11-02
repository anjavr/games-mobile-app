import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeProvider";

const GameModal = ({
  visible,
  title,
  message,
  buttons = [],
  onClose,
  children,
}) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          {title && (
  <Text style={[styles.title, { color: theme.text }]}>
    {title}
  </Text>
)}

{message ? (
  <Text style={[styles.message, { color: theme.text }]}>
    {message}
  </Text>
) : null}

{children}

          <View style={styles.buttonsRow}>
            {buttons.map((btn, i) => (
              <FAB
                key={i}
                mode="extended"
                label={t(btn.label)}
                onPress={btn.onPress}
                style={[styles.button, { backgroundColor: theme.accent }]}
                color="#fff"
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GameModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsRow: {
    marginTop: 20,
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
  button: {
    borderRadius: 8,
    marginBottom: 12,
  },
});
