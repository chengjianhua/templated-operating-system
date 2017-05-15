import { jsdom } from 'jsdom';

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;

/**
 * this is a polyfill
 * @see https://github.com/WickyNilliams/enquire.js/issues/91#issuecomment-47402945
 */
if (!window.matchMedia) {
  window.matchMedia = function (mediaQuery) {
    return {
      matches: false,
      media: mediaQuery,
      addListener() {},
      removeListener() {},
    };
  };
}

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

global.documentRef = document;
