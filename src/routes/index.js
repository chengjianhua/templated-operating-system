import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Layout from '../components/Layout';

import Home from '../pages/home';
import Build from '../pages/build';
import Components from '../pages/components';

const routes = (
  <Layout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/components" component={Components} />
      <Route path="/build" component={Build} />
    </Switch>
  </Layout>
);

// const routes = (
//   <Route component={App}>
//     <Route exact strict path="/" component={Home} />

//   </Route>
// );

export default routes;
