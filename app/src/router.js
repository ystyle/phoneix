import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Servers from './routes/ServersPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage}>
        <Route path="servers" component={Servers} />
      </Route>

    </Router>
  );
}

export default RouterConfig;
