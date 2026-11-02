import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const TicTacToeGrid = ({ board, onCellPress, cellBorderColor }) => {
  return (
    <View style={styles.grid}>
      {board.map((cell, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.cell, { borderColor: cellBorderColor || "#000" }]}
          onPress={() => onCellPress(index)}
        >
          {cell && (
            <Image
              source={
                cell === "X"
                  ? require("../../assets/x.png")
                  : require("../../assets/o.png")
              }
              style={styles.cellImage}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
  cell: {
    width: "33.33%",
    height: "33.33%",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
});

export default TicTacToeGrid;
