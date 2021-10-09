import { Home, Invoices } from '@ui/pages';
import { Wallet } from '@project-serum/anchor';
import { useWallet, ConnectedAppProvider } from '@stores';
import { useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';

export const Routes = () => {
  const { wallet, disconnectWallet } = useWallet();

  const connectedWallet = useMemo(() => {
    return wallet && wallet.publicKey && wallet.signAllTransactions && wallet.signAllTransactions
      ? ({
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions
        } as Wallet)
      : null;
  }, [wallet, wallet?.publicKey, wallet?.signTransaction, wallet?.signAllTransactions]);

  return (
    <Switch>
      {connectedWallet ? (
        <ConnectedAppProvider {...{ wallet: connectedWallet, disconnectWallet }}>
          <Route exact path="/" component={() => <Invoices />} />
        </ConnectedAppProvider>
      ) : (
        <Route exact path="/" component={() => <Home />} />
      )}
    </Switch>
  );
};
