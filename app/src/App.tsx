import { Routes } from './routes';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@stores';
import { ClusterSwitcher, WalletConnector } from '@ui/components';

const AppHeader = () => {
  return (
    <header className="w-screen h-24 py-5 px-8 flex items-center gap-4 justify-between">
      <nav>
        <a href="/">Faktor</a>
      </nav>
      <aside className="flex items-center gap-6">
        <WalletConnector />
        <ClusterSwitcher />
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
      <WalletProvider>
        <ConnectionProvider>
          <AppLayout>
            <Routes />
          </AppLayout>
        </ConnectionProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}
