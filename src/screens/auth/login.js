import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from "expo-sqlite";
import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { initI18n } from '../../../i18n';
import AuthLayout from "../../components/AuthLayout";
import { getSettings, insertSettings } from "../../database/repository/settings";
import { loginUser } from '../../database/repository/user';
import { useAuth } from '../../providers/AuthProvider';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const { t } = useTranslation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [errorUsername, setErrorUsername] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);


  useEffect(() => {
    i18n.changeLanguage('en');
  }, []);

  // login function
  const handleLogin = async () => {
    setErrorUsername(null);
    setErrorPassword(null);

    if (!username) {
      setErrorUsername(t("errorUsername"));
      return;
    }
    if (!password) {
      setErrorPassword(t("errorPassword"));
      return;
    }

    const user = await loginUser(db, username, password);
    if (!user) {
      setErrorUsername(t("errorUsername"));
      setErrorPassword(t("errorPassword"));
      return;
    }

    const settings = await getSettings(db, user.id);
    if (!settings) {
      await insertSettings(db, user.id, "en", "light");
    }

    await initI18n(db, user.id);
    login({
      id: user.id,
      username: user.username,
    });
  };

  return (
    <AuthLayout>

      <Text style={styles.title}>{t("welcomeTitle")}</Text>

      <TextInput
        placeholder={t("username")}
        style={styles.input}
        value={username}
        onChangeText={text => {
          setUsername(text);
          setErrorUsername(null);
        }}
        placeholderTextColor="#777"
      />
      {errorUsername && <Text style={styles.errorText}>{errorUsername}</Text>}


      <View style={styles.passwordContainer}>
        <TextInput
          placeholder={t("password")}
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrorPassword(null);
          }}
          placeholderTextColor="#777"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {errorPassword && <Text style={styles.errorText}>{errorPassword}</Text>}

      <View style={styles.underline} />

      <FAB
        mode="extended"
        label={t("loginButton")}
        onPress={handleLogin}
        style={styles.extendedFab}
        color="#fff"
        backgroundColor="#185195"
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("dontHaveAccTitle")}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>{t("signupLoginButton")}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

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

export default LoginScreen;
