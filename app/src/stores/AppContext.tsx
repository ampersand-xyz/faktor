import { ConnectionProvider, useConnection } from './ConnectionContext';
import { useWalletContext, WalletProvider } from './WalletContext';

export const AppContextProvider: React.FC = ({ children }) => {
  return (
    <WalletProvider>
      <ConnectionProvider>{children}</ConnectionProvider>
    </WalletProvider>
  );
};

export const useAppContext = () => {
  const walletCtx = useWalletContext();
  const connection = useConnection();
  return { ...walletCtx, ...connection };
};
