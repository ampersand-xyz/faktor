import { createContext, useContext, useState } from 'react';

interface IConnectionContext {
  walletPickerOpen: boolean;
  setWalletPickerOpen: any;
  walletBusy: boolean;
  setWalletBusy: any;
  walletError: string | null;
  setWalletError: (error: string | null) => void;
}

const ConnectionContext = createContext<IConnectionContext | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error();
  return context;
};

export const ConnectionProvider: React.FC = ({ children }) => {
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  return (
    <ConnectionContext.Provider
      value={{
        walletPickerOpen,
        setWalletPickerOpen,
        walletBusy,
        setWalletBusy,
        walletError,
        setWalletError
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
