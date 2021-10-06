import { Routes } from './routes';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from '@stores';
import { WalletConnector } from '@components';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="h-screen w-screen relative z-0">
        <header className="w-screen h-24 py-5 px-8 flex items-center gap-4">
          <nav>
            <a href="/">Faktor</a>
          </nav>
          <WalletConnector />
        </header>
        {children}
      </div>
    </main>
  );
};

export default function AppWithProviders() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AppLayout>
          <Routes />
        </AppLayout>
      </AppContextProvider>
    </BrowserRouter>
  );
}
