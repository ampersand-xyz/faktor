import { Home } from '@pages';
import { Switch, Route } from 'react-router-dom';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={() => <Home />} />
    </Switch>
  );
};
