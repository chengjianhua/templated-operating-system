import React from 'react';
import { render } from 'react-dom';
import FastClick from 'fastclick';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import BuiltPage from './BuiltPage';

const muiTheme = getMuiTheme({ userAgent: navigator.userAgent });

const appContainer = document.getElementById('app');

/* global __PAGE_DATA__ */

FastClick.attach(document.body);

const { _id: id, ...data } = __PAGE_DATA__;

render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <BuiltPage
      key={id}
      {...data}
    />
  </MuiThemeProvider>,
  appContainer,
);
