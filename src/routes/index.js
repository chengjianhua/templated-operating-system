import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Home from '../pages/home';
import Build from '../pages/build';
import Components from '../pages/components';

const routes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/components" component={Components} />
    <Route path="/build" component={Build} />
  </Switch>
);

export default routes;
