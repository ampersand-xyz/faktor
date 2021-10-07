import { Home, Invoices } from '@pages';
import { Wallet } from '@project-serum/anchor';
import { useWallet } from '@stores';
import { useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';

export const Routes = () => {
  const { wallet, walletPublicKey } = useWallet();

  const anchorWallet = useMemo(() => {
    return wallet
      ? ({
          publicKey: walletPublicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions
        } as Wallet)
      : null;
  }, [wallet]);

  return (
    <Switch>
      <Route exact path="/" component={() => <Home />} />
      {anchorWallet && (
        <Route exact path="/" component={() => <Invoices wallet={anchorWallet} />} />
      )}
    </Switch>
  );
};
