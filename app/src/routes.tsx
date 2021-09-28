import {HashRouter, Switch, Route} from 'react-router-dom';
import {HomeView, NewView, SentView, ReceivedView} from './views';

export const Routes = () => {
  return (
    <HashRouter basename={'/'}>
      <Switch>
        <Route exact path="/" component={() => <HomeView />} />
        <Route exact path="/new" component={() => <NewView />} />
        <Route exact path="/sent" component={() => <SentView />} />
        <Route exact path="/received" component={() => <ReceivedView />} />
      </Switch>
    </HashRouter>
  );
};
