import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { HomeView, NewView, SentView, ReceivedView, LandingView } from '@views';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { ConnectedHeader, DefaultHeader } from './Header';
import { AppStateProvider } from './AppState';

const Content = ({ children }: ContainerProps) => {
  return <div className="px-5 py-8 bg-gray-100 w-full h-content">{children}</div>;
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
            <Route exact path="/">
              <HomeView />
            </Route>
            <Route exact path="/new">
              <NewView />
            </Route>
            <Route exact path="/received">
              <ReceivedView />
            </Route>
            <Route exact path="/sent">
              <SentView />
            </Route>
          </Switch>
        </Content>
      </BrowserRouter>
    </AppStateProvider>
  );
};
