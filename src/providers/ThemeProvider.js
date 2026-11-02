import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const lightTheme = {
    background1: "rgba(250, 193, 102)",
    background2: "#FFA73D",
    card: "#FFFFFF",
    text: "#000",
    accent: "#185195",
    themeback: "#1850953b"
  };

  const darkTheme = {
    background1: "#5f9ce7ff",
    background2: "#185195",
    card: "#333333",
    text: "#fff",
    accent: "#FFA73D",
    themeback: "#ffa83d33"
  };

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
