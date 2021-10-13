import { HashRouter, Switch, Route } from "react-router-dom";
import { HomeView } from "./views";

export const Routes = () => {
  return (
    <HashRouter basename={"/"}>
      <Switch>
        <Route exact path="/" component={() => <HomeView />} />
      </Switch>
    </HashRouter>
  );
};
