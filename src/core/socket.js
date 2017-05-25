import socketIO from 'socket.io-client';

const defaultOptions = {
  path: '/tos/socket.io',
};

export default function client(url = '', options = {}) {
  const base = process.env.NODE_ENV === 'production' ?
    window.location.origin :
    'http://localhost:4000';

  const finalOptions = Object.assign({}, defaultOptions, options);
  let finalUrl;

  if (/^http/.test(url)) {
    finalUrl = url;
  } else {
    finalUrl = base + url;
  }

  return socketIO(finalUrl, finalOptions);
}
