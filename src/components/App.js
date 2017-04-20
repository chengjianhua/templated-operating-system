import React from 'react';

import Layout from './Layout';
import routes from '../routes';

class App extends React.Component {

  render() {
    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

export default App;
