import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from "expo-sqlite";
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FAB } from 'react-native-paper';
import AuthLayout from '../../components/AuthLayout';
import { insertUser } from "../../database/repository/user";

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const db = useSQLiteContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorUsername, setErrorUsername] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const { t } = useTranslation();

  const handleSignup = async () => {

    setErrorUsername(null);
    setErrorPassword(null);

    let valid = true;

    if (!username.trim()) {
      setErrorUsername(t("errorUsername1"));
      valid = false;
    }

    if (!password) {
      setErrorPassword(t("errorPassword1"));
      valid = false;
    }

    if (password !== confirmPassword) {
      setErrorPassword(t("errorPasswordMatch"));
      valid = false;
    }

    if (!valid) return;

    const userId = await insertUser(db, {
      username,
      password
    });

    if (!userId) {
      setErrorUsername(t("errorUserExists"));
      return;
    }

    console.log("Korisnik uspješno registrovan:", userId);
    navigation.replace("Login");
  };

  return (
    <AuthLayout>
      <Text style={styles.title}>{t("signupTitle")}</Text>

      <TextInput
        placeholder={t("username")}
        placeholderTextColor="#555"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {errorUsername && (
        <Text style={styles.errorText}>{errorUsername}</Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder={t("password")}
          placeholderTextColor="#555"
          style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.underline} />

      <View style={styles.passwordContainer}>
      <TextInput
        placeholder={t("confirmPassword")}
        placeholderTextColor="#555"
        style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
        secureTextEntry={!showConfirmPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
      <MaterialCommunityIcons
        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
        size={24}
        color="#555"
      />
      </TouchableOpacity>
      </View>

      {errorPassword && (
        <Text style={styles.errorText}>{errorPassword}</Text>
      )}

      <View style={styles.underline} />

      <FAB
        mode="extended"
        label={t("signupButton")}
        onPress={handleSignup}
        style={styles.extendedFab}
        color="#fff"
        backgroundColor="#185195"
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("alreadyHaveAccTitle")}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>{t("loginSignUpButton")}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};
export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    width: width * 0.70,
    height: height * 0.40,
    marginTop: 30,
    marginBottom: -70,
  },
  form: {
    backgroundColor: '#fff',
    width: width * 0.85,
    borderRadius: 12,
    padding: 25,
    borderWidth: 2,
    borderColor: '#000',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#333',  
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
  },
  underline: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  footerText: {
    color: '#555',
  },
  linkText: {
    color: '#185195',
    fontWeight: '600',
  },
    langSwitch: {
  position: "absolute",
  top: 50,
  right: 25,
  backgroundColor: "#185195",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  elevation: 5
},
langText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14
},
errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'left',
  },
});


