import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAssets } from "../providers/AssetsProvider";

const MemoryCard = ({ image, isFlipped, onPress, backgroundColor }) => {
  const images = useAssets();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        { backgroundColor }
      ]}
      onPress={onPress}
    >
      {isFlipped ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <Image
          source={images.cube}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

export default MemoryCard;

const styles = StyleSheet.create({
 card: {
  width: "30%",
  height: "30%",
  aspectRatio: 1,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  elevation: 3,
  marginBottom: 8,
},

  image: {
    width: "70%",
    height: "70%",
  },
  logo: {
    width: "55%",
    height: "55%",
    opacity: 0.9,
  },
});
