import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { useAssets } from '../../providers/AssetsProvider';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const images = useAssets();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#FFBF59', '#FFA73D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={images.logo}
          style={{ width: width * 0.9, height: height * 0.5 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cubeContainer}>
        <Image
          source={images.cube}
          style={{
            width: width * 0.6,
            height: width * 0.6,
            transform: [{ rotate: '9deg' }],
            resizeMode: 'contain',
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  cubeContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -height * 0.15,
  },
});

export default SplashScreen;
