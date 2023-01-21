import { useContext } from "react";
import { WalletContext } from "../providers/WalletProvider";

export const useWalletContext = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }

  return context;
};
