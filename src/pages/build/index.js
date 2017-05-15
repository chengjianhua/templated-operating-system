import React from 'react';
// import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { Route } from 'react-router-dom';

import Build from './Build';

import StylesStore from '../../components/StyleWrapper/StylesStore';

const stores = {
  styles: new StylesStore(),
};

function BuildRoot() {
  return (
    <Provider {...stores}>
      <Route component={Build} />
    </Provider>
  );
}

BuildRoot.propTypes = {
  // children: PropTypes.element.isRequired,
};

export default BuildRoot;
