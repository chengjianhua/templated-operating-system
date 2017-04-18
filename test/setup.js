import { jsdom } from 'jsdom';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount, render } from 'enzyme';

process.env.NODE_ENV = 'test';

function noop() {
  return null;
}

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.md'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;

chai.use(chaiEnzyme());

global.sinon = sinon;
global.should = chai.should();
global.shallow = shallow;
global.mount = mount;
global.render = render;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;

/**
 * this is a polyfill
 * @see https://github.com/WickyNilliams/enquire.js/issues/91#issuecomment-47402945
 */
window.matchMedia || (
  window.matchMedia = function(mediaQuery) {
    return {
      matches: false,
      media: mediaQuery,
      addListener: function() {},
      removeListener: function() {}
  };
});

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.documentRef = document;
