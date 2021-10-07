import { HashRouter, Switch, Route } from "react-router-dom";
import {
  HomeView,
  NewView,
  SentView,
  ReceivedView,
  InvoicesView,
} from "./views";

export const Routes = () => {
  return (
    <HashRouter basename={"/"}>
      <Switch>
        <Route exact path="/" component={() => <HomeView />} />
        <Route exact path="/new" component={() => <NewView />} />
        <Route exact path="/sent" component={() => <SentView />} />
        <Route exact path="/received" component={() => <ReceivedView />} />
        <Route exact path="/invoices" component={() => <InvoicesView />} />
      </Switch>
    </HashRouter>
  );
};
