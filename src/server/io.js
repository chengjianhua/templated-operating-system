import http from 'http';
import socketIO from 'socket.io';

let ioInstance;

export function initialize(expressApp) {
  const server = http.Server(expressApp);
  ioInstance = socketIO(server, {
    path: '/tos/socket.io',
  });

  return server;
}

export function io() {
  return ioInstance;
}

export default io;


