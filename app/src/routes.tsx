import { useAnchorWallet } from '@solana/wallet-adapter-react';

import { Switch, Route } from 'react-router-dom';
import {HomeView, InvoicesView} from './views';

export const Routes = () => {
  const wallet = useAnchorWallet();

  return (
    <Switch>
      {wallet ? (
        <Route exact path="/" component={() => <InvoicesView wallet={wallet} />} />
      ) : (
        <Route exact path="/" component={() => <HomeView />} />
      )}
    </Switch>
  );
};
