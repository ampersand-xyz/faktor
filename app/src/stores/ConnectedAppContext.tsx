import { Wallet } from '@project-serum/anchor';
import { createContext, useContext } from 'react';

interface IConnectedAppContext {
  wallet: Wallet;
  disconnectWallet: () => void;
}

export const ConnectedAppContext = createContext<IConnectedAppContext | undefined>(undefined);

export const useConnectedApp = () => {
  const context = useContext(ConnectedAppContext);
  if (!context) throw new Error();
  return context;
};
