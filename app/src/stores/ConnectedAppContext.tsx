import { InvoicesManager, InvoicesStore } from '@core/invoices';
import { Wallet } from '@project-serum/anchor';
import { useConnection } from '@stores';
import { createContext, useContext, useEffect, useState } from 'react';

interface IConnectedAppContext {
  wallet: Wallet;
  disconnectWallet: () => void;
  invoicesManager: InvoicesManager;
}

export const ConnectedAppContext = createContext<IConnectedAppContext | undefined>(undefined);

export const useConnectedApp = () => {
  const context = useContext(ConnectedAppContext);
  if (!context) throw new Error();
  return context;
};

export interface ConnectedAppProviderProps {
  wallet: Wallet;
  disconnectWallet: () => void;
}

export const ConnectedAppProvider: React.FC<ConnectedAppProviderProps> = ({
  wallet,
  disconnectWallet,
  children
}) => {
  const [invoicesStore, setInvoicesStore] = useState<InvoicesStore>({ received: [], issued: [] });
  const { connection } = useConnection();
  const [invoicesManager, setInvoicesManager] = useState<InvoicesManager>(
    new InvoicesManager(invoicesStore, connection, wallet, setInvoicesStore)
  );

  useEffect(() => {
    // TODO load invoices for this wallet and create InvoicesManager with the initial data
    // setInvoicesManager(new InvoicesManager(invoicesStore, connection, wallet, setInvoicesStore));
    InvoicesManager.load(connection, wallet, setInvoicesStore).then(setInvoicesManager);
    console.log(`\ninitialized InvoicesManager...\n`, { invoicesManager });
  }, [wallet]);

  return (
    <ConnectedAppContext.Provider value={{ wallet, disconnectWallet, invoicesManager }}>
      {children}
    </ConnectedAppContext.Provider>
  );
};
