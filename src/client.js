import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import FastClick from 'fastclick';
// import queryString from 'query-string';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { ErrorReporter, deepForceUpdate } from './core/devUtils';
// import { updateMeta } from './core/DOMUtils';

injectTapEventPlugin();

// const stylesheets = document.querySelectorAll('link.stylesheet');

// stylesheets.forEach((stylesheet) => {
//   console.log(stylesheet);
// });

setTimeout(() => {
  serverStyleCleanup();
}, 3000);

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

const container = document.getElementById('app');
const muiTheme = getMuiTheme({ userAgent: navigator.userAgent });

function render(App) {
  // eslint-disable-next-line
  return ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router basename="/app">
        <App />
      </Router>
    </MuiThemeProvider>,
    container,
  );
}

let App = require('./components/App').default;

let appInstance = render(App);

// remove the style tag which [className="server-style-loader-element"]
// serverStyleCleanup();

if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null;
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.render(<ErrorReporter error={event.error} />, container);
  });
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./components/App', () => {
    App = require('./components/App').default; // eslint-disable-line global-require

    if (appInstance) {
      try {
        // Force-update the whole tree, including components that refuse to update
        deepForceUpdate(appInstance);
        appInstance = render(App);
      } catch (error) {
        appInstance = null;
        document.title = `Hot Update Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, container);
      }
    }
  });
}
