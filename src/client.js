import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FastClick from 'fastclick';
// import queryString from 'query-string';
// import { createPath } from 'history/PathUtils';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// import history from './core/history';
import { ErrorReporter, deepForceUpdate } from './core/devUtils';
// import { updateMeta } from './core/DOMUtils';

import App from './components/App';

injectTapEventPlugin();

// import routes from './routes';

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => { removeCss.forEach(f => f()); };
  },
};

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

const container = document.getElementById('app');
const muiTheme = getMuiTheme({ userAgent: navigator.userAgent });

function render(routesRender) {
  // eslint-disable-next-line
  return ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router basename="/app">
        <App context={context}>
          {routesRender}
        </App>
      </Router>
    </MuiThemeProvider>,
    container,
  );
}

let routes = require('./routes').default;
// eslint-disable-next-line
let appInstance = render(routes);

if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null;
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.render(<ErrorReporter error={event.error} />, container);
  });
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes', () => {
    routes = require('./routes').default; // eslint-disable-line global-require

    if (appInstance) {
      try {
        // Force-update the whole tree, including components that refuse to update
        deepForceUpdate(appInstance);
        appInstance = render(routes);
      } catch (error) {
        appInstance = null;
        document.title = `Hot Update Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, container);
      }
    }
  });
}
