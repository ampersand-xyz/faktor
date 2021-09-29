import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Routes } from './routes';
import { AppLayout } from './AppLayout';
import { BrowserRouter } from 'react-router-dom';

const wallets = [
  // view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets
  getPhantomWallet(),
];

function AppWithProviders() {
  return (
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppLayout>
            <Routes />
          </AppLayout>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

type Component<P = any> = (props?: P) => JSX.Element;

const withRouter = (component: Component) => () =>
  <BrowserRouter>{component()}</BrowserRouter>;

export default withRouter(AppWithProviders);
