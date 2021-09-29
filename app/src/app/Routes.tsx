import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { HomeView, NewView, SentView, ReceivedView, LandingView } from '@views';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ConnectedHeader, DefaultHeader } from './Header';
import { AppStateProvider } from '@contexts';

const Content = ({ children }: ContainerProps) => {
  return <div className="px-5 py-8">{children}</div>;
};

export const Routes = () => {
  const wallet = useAnchorWallet();

  if (!wallet) {
    return (
      <BrowserRouter>
        <main>
          <DefaultHeader />
          <Content>
            <Switch>
              <Route path="/">
                <LandingView />
              </Route>
            </Switch>
          </Content>
        </main>
      </BrowserRouter>
    );
  }

  return (
    <AppStateProvider wallet={wallet}>
      <BrowserRouter>
        <ConnectedHeader />
        <Content>
          <Switch>
            <Route path="/">
              <HomeView />
            </Route>
            <Route path="/new">
              <NewView />
            </Route>
            <Route path="/received">
              <ReceivedView />
            </Route>
            <Route path="/sent">
              <SentView />
            </Route>
          </Switch>
        </Content>
      </BrowserRouter>
    </AppStateProvider>
  );
};
