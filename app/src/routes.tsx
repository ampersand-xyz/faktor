import { Home } from '@pages';
import { HashRouter, Switch, Route } from 'react-router-dom';

export const Routes = () => {
  return (
    <HashRouter basename={'/'}>
      <Switch>
        <Route exact path="/" component={() => <Home />} />
      </Switch>
    </HashRouter>
  );
};
