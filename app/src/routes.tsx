import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { HomeView, NewView, SentView, ReceivedView } from './views';

export const Routes = () => {
  return (
    <Router>
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
    </Router>
  );
};
