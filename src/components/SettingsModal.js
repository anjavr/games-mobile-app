import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeProvider";

const SettingsModal = ({ visible, onPause, onGiveUp, onClose }) => {
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

          <FAB
            small
            icon="close"
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.card }]}
            color={theme.text}
            size={28} 
          />

          <Text style={[styles.title, { color: theme.text }]}>
            {t("settings")}
          </Text>

          <View style={styles.buttonsContainer}>
            <FAB
              mode="extended"
              label={t("pause")}
              onPress={onPause}
              style={[styles.fab, { backgroundColor: theme.accent }]}
              color="#fff"
            />
            <FAB
              mode="extended"
              label={t("giveUp")}
              onPress={onGiveUp}
              style={[styles.fab, { backgroundColor: theme.accent }]}
              color="#fff"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "70%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    position: "relative",
    paddingTop: 50, 
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  fab: {
    marginVertical: 8,
    borderRadius: 8,
    width: "100%",
  },
});
