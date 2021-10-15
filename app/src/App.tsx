import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Routes } from "./routes";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

const wallets = [
  // view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets
  getPhantomWallet(),
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="w-screen h-screen">{children}</div>
    </main>
  );
};

export default function AppWithProviders() {
  return (
    <BrowserRouter>
      <ConnectionProvider endpoint="http://127.0.0.1:8899">
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <AppLayout>
              <Routes />
            </AppLayout>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  );
}
