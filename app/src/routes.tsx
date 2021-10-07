import { Home, Invoices } from '@pages';
import { Wallet } from '@project-serum/anchor';
import { useWallet, ConnectedAppContext } from '@stores';
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
        <ConnectedAppContext.Provider value={{ wallet: connectedWallet, disconnectWallet }}>
          <Route exact path="/" component={() => <Invoices />} />
        </ConnectedAppContext.Provider>
      ) : (
        <Route exact path="/" component={() => <Home />} />
      )}
    </Switch>
  );
};
