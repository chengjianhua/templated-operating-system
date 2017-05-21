import path from 'path';
import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
// import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import PrettyError from 'pretty-error';

import { collectInitial } from 'node-style-loader/collect';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { port, auth } from 'config';
import 'core/ssrPolyfill';
import App from 'components/App';
import Html from 'components/Html';
import ErrorPage from 'pages/error/ErrorPage';

import apiRouter from 'server/api';

import assets from './assets.json'; // eslint-disable-line import/no-unresolved

// import passport from './core/passport';
// import routes from './routes';
// import { port, auth } from '../config';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/pages', express.static(path.join(__dirname, 'pages')));
//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
// app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}

// use socket.io middleware
app.use((req, res, next) => {
  req.io = io;

  next();
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/api', apiRouter);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const initialStyleTag = collectInitial();

    const initialCss = initialStyleTag.replace(/<\/?style.*>/, '');

    const routerContext = {};

    const userAgent = req.headers['user-agent'];
    const muiTheme = getMuiTheme({ userAgent });

    global.navigator.userAgent = userAgent;

    const data = {
      title: 'html',
      description: 'html',
      children: ReactDOM.renderToString(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router
            basename="/app"
            location={req.url}
            context={routerContext}
          >
            <App />
          </Router>
        </MuiThemeProvider>,
      ),
      styles: [
        { id: 'css', cssText: initialCss },
      ],
      stylesheets: [
        assets.client.css,
      ],
      scripts: [
        assets.vendor.js,
        assets.client.js,
      ],
    };

    if (routerContext.url) {
      res.writeHead(301, {
        Location: routerContext.url,
      });
      res.end();
    } else {
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(200);
      res.send(`<!doctype html>${html}`);
    }
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console

  const initialStyleTag = collectInitial();

  const initialCss = initialStyleTag.replace(/<\/?style.*>/, '');

  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: initialCss }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */
