import { ConnectionProvider, useConnection } from './ConnectionContext';
import { useWalletContext, WalletProvider } from './WalletStore';

export const AppStoreProvider: React.FC = ({ children }) => {
  return (
    <WalletProvider>
      <ConnectionProvider>{children}</ConnectionProvider>
    </WalletProvider>
  );
};

export const useAppStore = () => {
  const walletCtx = useWalletContext();
  const connection = useConnection();
  return { ...walletCtx, ...connection };
};
