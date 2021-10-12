import { InvoicesManager, InvoicesStore } from '@core/invoice';
import { SolService } from '@core/solana';
import { Provider, Wallet } from '@project-serum/anchor';
import { useConnection } from '@stores';
import { createContext, useContext, useEffect, useState } from 'react';

interface IConnectedAppContext {
  wallet: Wallet;
  disconnectWallet: () => void;
  invoicesManager: InvoicesManager;
  solService: SolService;
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
    new InvoicesManager(
      invoicesStore,
      new Provider(connection, wallet, { preflightCommitment: 'confirmed' }),
      setInvoicesStore
    )
  );

  const [solService, setSolService] = useState<SolService>(new SolService(connection));

  useEffect(() => {
    // TODO load invoices for this wallet and create InvoicesManager with the initial data
    // setInvoicesManager(new InvoicesManager(invoicesStore, connection, wallet, setInvoicesStore));
    InvoicesManager.load(connection, wallet, setInvoicesStore).then(setInvoicesManager);
    console.log(`\ninitialized InvoicesManager...\n`, { invoicesManager });
    setSolService(new SolService(connection));
  }, [wallet, connection]);

  return (
    <ConnectedAppContext.Provider value={{ wallet, disconnectWallet, invoicesManager, solService }}>
      {children}
    </ConnectedAppContext.Provider>
  );
};
