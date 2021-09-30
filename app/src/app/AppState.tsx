import { AnchorWallet } from '@solana/wallet-adapter-react';
import { createContext, useContext, useMemo } from 'react';
import { Endpoint, ENDPOINTS } from './endpoints';

export type AppState = {
  endpoint: Endpoint;
  wallet: AnchorWallet;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error();
  return context;
}

export function AppStateProvider({ children, wallet }: ContainerProps<{ wallet: AnchorWallet }>) {
  const initialState: AppState = useMemo(
    () => ({
      wallet,
      endpoint: ENDPOINTS[0]
    }),
    []
  );

  return <AppStateContext.Provider value={initialState}>{children}</AppStateContext.Provider>;
}
