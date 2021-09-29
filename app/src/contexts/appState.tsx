import { Endpoint, ENDPOINTS } from '@utils';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { createContext, Dispatch, useContext, useReducer } from 'react';

export type AppState = {
  endpoint: Endpoint;
  wallet: AnchorWallet;
};

type Action = { type: 'SetAddress'; address: string };

function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    default:
      return state;
  }
}

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error();
  return context;
}

export function AppStateProvider({
  children,
  wallet,
}: ContainerProps<{ wallet: AnchorWallet }>) {
  const initialState: AppState = {
    wallet,
    endpoint: ENDPOINTS[0],
  };

  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
