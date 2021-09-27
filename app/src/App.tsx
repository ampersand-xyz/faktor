import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { Routes } from "./routes";
import { ReactNode } from "react";

const wallets = [
  // view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets
  getPhantomWallet(),
];

const AppLayout = ({children}: {children: ReactNode}) => {
  return <main>
    <body className="h-screen w-screen">
      <header className="w-screen h-24 py-5 px-8 flex items-center gap-4"><a href="/#">HOME</a><a href="/#/new">NEW</a><a href="/#/sent">SENT</a><a href="/#/received">RECEIVED</a></header>
      {children}</body></main>
}

export default function AppWithProviders() {
  return (
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppLayout><Routes /></AppLayout>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}