import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAssets } from "../providers/AssetsProvider";
const { width } = Dimensions.get("window");

const SymbolSelector = ({ selectedSymbol, onSelect }) => {
    const images = useAssets();


  return (
    <View style={styles.symbolRow}>
      {["X", "O"].map((symbol) => (
        <TouchableOpacity
          key={symbol}
          style={[styles.symbolBox, selectedSymbol === symbol && styles.selected]}
          onPress={() => onSelect(symbol)}
        >
          <Image
            source={symbol === "X" ? images.x : images.o}
            style={styles.symbolImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  symbolRow: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 30,
    justifyContent: "center",
  },

  symbolBox: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },

  selected: {
    borderColor: "#000",
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  symbolImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
});

export default SymbolSelector;
