import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Asset } from "expo-asset";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from './i18n';
import { useAuth } from "./src/providers/AuthProvider";

import { createGameTable, insertGame } from "./src/database/repository/game";
import { createResultTable } from "./src/database/repository/result";
import { createSettingsTable, insertSettings } from './src/database/repository/settings';
import { createUserTable, insertUser } from './src/database/repository/user';
import { AssetsContext } from "./src/providers/AssetsProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import { LanguageProvider } from './src/providers/LanguageProvider';
import { ThemeProvider } from "./src/providers/ThemeProvider";


import * as FileSystem from "expo-file-system/legacy";

// screens
import LoginScreen from "./src/screens/auth/login";
import SignupScreen from "./src/screens/auth/signup";
import GameDetailsScreen from "./src/screens/games/gameDetail";
import GameRulesScreen from "./src/screens/games/gameRules";
import GamesScreen from "./src/screens/games/games";
import MemoryGameScreen from "./src/screens/games/memory/game";
import MemoryStartScreen from "./src/screens/games/memory/startpage";
import SudokuScreen from "./src/screens/games/sudoku/game";
import SudokuStartScreen from "./src/screens/games/sudoku/startpage";
import TicTacToeScreen from "./src/screens/games/tictactoe/game";
import TTTStartScreen from "./src/screens/games/tictactoe/startpage";
import HomeScreen from "./src/screens/home/home";
import ProfileScreen from "./src/screens/profile/profile";
import ScoresScreen from "./src/screens/scores/scores";
import SettingsScreen from "./src/screens/settings/settings";
import SplashScreen from "./src/screens/splash/splash";


const Stack = createNativeStackNavigator();

async function deleteDatabase() {
  try {
    const dbFolder = FileSystem.documentDirectory + "SQLite";
    const dbPath = dbFolder + "/mozgalica.db";

    const info = await FileSystem.getInfoAsync(dbPath);

    if (info.exists) {
      console.log("Brisanje stare baze...");
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
    } else {
      console.log(" Baza ne postoji — preskačem brisanje.");
    }
  } catch (error) {
    console.error("Greška pri brisanju baze:", error);
  }
}

// pictures
const images = {
  logo: require("./assets/logo.png"),
  cube: require("./assets/cube.png"),

  tttlogo: require("./assets/tictactoe.png"),
  memorylogo: require("./assets/memory.png"),
  sudokulogo: require("./assets/sudoku.png"),

  x: require("./assets/x.png"),
  o: require("./assets/o.png"),

  goldmedal: require("./assets/goldmedal.png"),
  silvermedal: require("./assets/silvermedal.png"),
  bronzemedal: require("./assets/bronzemedal.png"),

  baseball: require("./assets/memory_game/sport/baseball.png"),
  basketball: require("./assets/memory_game/sport/basketball.png"),
  americanfootball: require("./assets/memory_game/sport/american-football.png"),
  football: require("./assets/memory_game/sport/football.png"),
  tennis: require("./assets/memory_game/sport/tennis.png"),
  voleyball: require("./assets/memory_game/sport/volleyball.png"),

  bee: require("./assets/memory_game/nature/bee.png"),
  flower: require("./assets/memory_game/nature/flower.png"),
  ladybug: require("./assets/memory_game/nature/ladybug.png"),
  leaf: require("./assets/memory_game/nature/leaf.png"),
  tree: require("./assets/memory_game/nature/tree.png"),
  water: require("./assets/memory_game/nature/water.png"),

  computermouse: require("./assets/memory_game/gaming/computer-mouse.png"),
  computer: require("./assets/memory_game/gaming/computer.png"),
  console: require("./assets/memory_game/gaming/console.png"),
  ghost: require("./assets/memory_game/gaming/ghost.png"),
  headphones: require("./assets/memory_game/gaming/headphones.png"),
  packman: require("./assets/memory_game/gaming/packman.png"),

};


function AppContent() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const db = useSQLiteContext();
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await migrateDbIfNeeded(db);
        await initI18n(db);
        
        await Asset.loadAsync(Object.values(images));
        
        setAssetsLoaded(true);
        setIsI18nInitialized(true);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    initializeApp();
  }, [db]);

  if (!isI18nInitialized || !assetsLoaded || loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AssetsContext.Provider value={images}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
  {!isLoggedIn ? (
    <>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Scores" component={ScoresScreen} />
      <Stack.Screen name="Games" component={GamesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
      <Stack.Screen name="GameRules" component={GameRulesScreen} />
      <Stack.Screen name="TTTStart" component={TTTStartScreen} />
      <Stack.Screen name="TicTacToeScreen" component={TicTacToeScreen} />
      <Stack.Screen name="SudokuStart" component={SudokuStartScreen} />
      <Stack.Screen name="SudokuScreen" component={SudokuScreen} />
      <Stack.Screen name="MemoryStart" component={MemoryStartScreen} />
      <Stack.Screen name="MemoryScreen" component={MemoryGameScreen} />
      </>
      )}
    </Stack.Navigator>

      </NavigationContainer>
      </AssetsContext.Provider>
    </I18nextProvider>
  );
}


export default function App() {

  //useEffect(() => {
   // deleteDatabase();
  //}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="mozgalica.db">
        <PaperProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <AppContent />
            </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </PaperProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}



async function migrateDbIfNeeded(db) {
  const DB_VERSION = 1;

  let { user_version: currentVersion } = await db.getFirstAsync("PRAGMA user_version");
  console.log("---- MIGRATION START ----");
  console.log("PRAGMA user_version =", currentVersion);

  const existingTables = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
  console.log("Postojeće tabele:", existingTables);

  if (currentVersion >= DB_VERSION) {
    console.log("Migracija nije potrebna.");
    return;
  }

  if (currentVersion === 0) {
    console.log("Pokrećem inicialnu migraciju...");

    // insert data
    await createUserTable(db);
    const userInsertResult = await insertUser(db, { username: "korisnik1", password: "1234" });

    let userId = userInsertResult?.lastInsertRowId;
    if (!userId) {
      const row = await db.getFirstAsync(`SELECT id FROM "user" LIMIT 1`);
      userId = row?.id;
    }

    const allUsers = await db.getAllAsync(`SELECT * FROM "user"`);
    console.log("Korisnici:", allUsers);

    await createSettingsTable(db);
    await insertSettings(db, userId, "en", "light");

    await createGameTable(db);
    await createResultTable(db);

    // insert tictactoe
    await insertGame(
      db,
      "ticTacToe",
      "ticTacToe_short",
      "ticTacToe_description",
      "ticTacToe_rules",
      "https://www.youtube.com/watch?v=3qzcAMShotQ"
    );

    // insert memory
    await insertGame(
      db,
      "memoryGame",
      "memoryGame_short",
      "memoryGame_description",
      "memoryGame_rules",
      "https://www.youtube.com/watch?v=oFfYmrGeTPs"
    );

    // insert sudoku
    await insertGame(
      db,
      "sudoku",
      "sudoku_short",
      "sudoku_description",
      "sudoku_rules",
      "https://www.youtube.com/watch?v=8zRXDsGydeQ"
    );

    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
    console.log("Migracija završena.");
  }
}

