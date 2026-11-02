import { createContext, useContext } from "react";

export const AssetsContext = createContext(null);

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error("useAssets must be used within AssetsProvider");
  }
  return context;
};
