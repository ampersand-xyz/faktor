import { Routes } from './routes';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppStoreProvider, useAppStore } from '@stores';
import { DisconnectButton } from '@components/connection/DisconnectButton';
import { ConnectButton } from '@components/connection';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { walletPublicKey } = useAppStore();
  return (
    <main>
      <body className="h-screen w-screen">
        <header className="w-screen h-24 py-5 px-8 flex items-center gap-4">
          <nav>
            <a href="/">PayMe</a>
          </nav>
          <aside>{walletPublicKey ? <DisconnectButton /> : <ConnectButton />}</aside>
        </header>
        {children}
      </body>
    </main>
  );
};

export default function AppWithProviders() {
  return (
    <BrowserRouter>
      <AppStoreProvider>
        <AppLayout>
          <Routes />
        </AppLayout>
      </AppStoreProvider>
    </BrowserRouter>
  );
}
