import { Routes } from './routes';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CLUSTERS } from '@core';

const AppHeader = () => {
  return (
    <header className="w-screen h-24 py-5 px-8 flex items-center gap-4 justify-between">
      <nav>
        <a href="/">Faktor</a>
      </nav>
      <aside className="flex items-center gap-6">
        <WalletMultiButton />
      </aside>
    </header>
  );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="h-screen w-screen relative z-0">
        <AppHeader />
        {children}
      </div>
    </main>
  );
};

export default function AppWithProviders() {
  return (
    <BrowserRouter>
      <ConnectionProvider endpoint={CLUSTERS[2].url}>
        <WalletProvider wallets={[getPhantomWallet()]}>
          <AppLayout>
            <Routes />
          </AppLayout>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  );
}
