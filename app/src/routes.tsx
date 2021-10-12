import { Home, Invoices } from '@pages';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

import { Switch, Route } from 'react-router-dom';

export const Routes = () => {
  const wallet = useAnchorWallet();

  return (
    <Switch>
      {wallet ? (
        <Route exact path="/" component={() => <Invoices wallet={wallet} />} />
      ) : (
        <Route exact path="/" component={() => <Home />} />
      )}
    </Switch>
  );
};
