import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { Switch, Route } from "react-router-dom";
import { ConnectWalletView, HomeView } from "./views";

export const Routes = () => {
  const wallet = useAnchorWallet();

  return (
    <Switch>
      {wallet ? (
        <Route exact path="/" component={() => <HomeView wallet={wallet} />} />
      ) : (
        <Route exact path="/" component={() => <ConnectWalletView />} />
      )}
    </Switch>
  );
};
