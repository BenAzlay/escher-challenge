"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { config } from "@/wagmiConfig";
import ConnectWalletModal from "@/components/ConnectWalletModal";

const queryClient = new QueryClient();

interface WalletContextType {
  connectWalletModalOpen: boolean;
  setConnectWalletModalOpen: Dispatch<SetStateAction<boolean>>;
}

const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [connectWalletModalOpen, setConnectWalletModalOpen] =
    useState<boolean>(false);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletContext.Provider
          value={{ connectWalletModalOpen, setConnectWalletModalOpen }}
        >
          {children}
          <ConnectWalletModal open={connectWalletModalOpen} onClose={() => setConnectWalletModalOpen(false)} />
        </WalletContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
