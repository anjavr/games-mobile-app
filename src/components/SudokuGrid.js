import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SudokuGrid = ({
  board,
  fixedCells,
  wrongCells,
  selectedCell,
  onCellPress,
  theme,
  cellSize = 40
}) => {

  
  return (
    <View style={[styles.boardContainer, { width: cellSize * 9, height: cellSize * 9 }]}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((cell, colIndex) => {
            const isWrong = wrongCells.some(c => c.row === rowIndex && c.col === colIndex);
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            return (
              <TouchableOpacity
                key={colIndex}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderLeftWidth: colIndex === 0 ? 2 : 1,
                  borderTopWidth: rowIndex === 0 ? 2 : 1,
                  borderRightWidth: (colIndex + 1) % 3 === 0 ? 2 : 1,
                  borderBottomWidth: (rowIndex + 1) % 3 === 0 ? 2 : 1,
                  borderColor: ((colIndex + 1) % 3 === 0 || (rowIndex + 1) % 3 === 0) ? "black" : "#ccc",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isWrong
                    ? "#ffcccc"
                    : isSelected
                      ? "#a0e0ff"
                      : fixedCells[rowIndex][colIndex]
                        ? "#ddd"
                        : "white"
                }}
                onPress={() => onCellPress(rowIndex, colIndex)}
              >
                <Text style={{
                  color: fixedCells[rowIndex][colIndex] ? "black" : theme.text,
                  fontWeight: fixedCells[rowIndex][colIndex] ? "700" : "400"
                }}>
                  {cell !== 0 ? cell : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default SudokuGrid;

const styles = StyleSheet.create({
  boardContainer: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});


