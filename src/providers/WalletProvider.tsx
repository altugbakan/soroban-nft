import { createContext, ReactNode, useState } from "react";
import { getNetworkDetails, getPublicKey } from "@stellar/freighter-api";
import { Server } from "soroban-client";

export interface NetworkDetailsType {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

export interface WalletContextType {
  address?: string;
  networkDetails?: NetworkDetailsType;
  server?: Server;
  connect(): Promise<void>;
}

export interface WalletProviderProps {
  children: ReactNode;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletContext, setWalletContext] = useState<WalletContextType>({
    connect: async () => {},
  });

  const connect = async () => {
    const walletAddress = await getPublicKey();

    if (!walletAddress) return;

    const networkDetails = await getNetworkDetails();
    setWalletContext({
      address: walletAddress,
      networkDetails: networkDetails,
      server: new Server(
        // "http://localhost:8000/soroban/rpc",
        "https://kalepail-futurenet.stellar.quest/soroban/rpc",
        { allowHttp: true }
      ), // Thanks kalepail!
      connect,
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address: walletContext.address,
        networkDetails: walletContext.networkDetails,
        server: walletContext.server,
        connect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
