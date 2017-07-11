import React from "react";
import {IndexRoute, Route, Router} from "dva/router";
import IndexPage from "./routes/IndexPage";
import Servers from "./routes/ServersPage";
import Webhooks from "./routes/Webhooks";
import Login from "./routes/Login";

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage}>
        <IndexRoute  component={Servers}/>
        <Route path="servers" component={Servers}/>
        <Route path="webhooks" component={Webhooks}/>
      </Route>
      <Route path="/login" component={Login}/>
    </Router>
  );
}

export default RouterConfig;
