import React from 'react';
// import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { Route } from 'react-router-dom';

import Build from './Build';
import BuildStore from './model/BuildStore';

import StylesStore from '../../components/StyleWrapper/StylesStore';

const stylesStore = new StylesStore();
const buildStore = new BuildStore(stylesStore);

const stores = {
  stylesStore,
  buildStore,
};

function BuildRoot() {
  return (
    <Provider {...stores}>
      <Route component={Build} />
    </Provider>
  );
}

// BuildRoot.propTypes = {
  // children: PropTypes.element.isRequired,
// };

export default BuildRoot;
