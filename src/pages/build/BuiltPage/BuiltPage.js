import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, Provider } from 'mobx-react';

import { StylesStore, StyleWrapperReadonly } from 'components/StyleWrapper';

import s from './BuiltPage.css';

const getStylesStore = (styles) => {
  const store = StylesStore.fromJS(styles).turnReadonly();

  return store;
};

@observer
export default class BuiltPage extends Component {
  static propTypes = {
    instances: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      index: PropTypes.number,
      path: PropTypes.string.isRequired,
      name: PropTypes.string,
      data: PropTypes.object.isRequired,
    })).isRequired,
    styles: PropTypes.object.isRequired,
    // id: PropTypes.string.isRequired,
  };

  static defaultProps = {
    instances: [],
    styles: {},
  };

  render() {
    const { instances, styles } = this.props;

    const stores = {
      stylesStore: getStylesStore(styles),
    };

    const instancesDOM = instances.map((instance) => {
      const { id, path, data } = instance;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const type = require(`../../../modules/${path}`).default;
      const element = React.createElement(type, data);

      return (
        <StyleWrapperReadonly key={id} id={id}>
          {element}
        </StyleWrapperReadonly>
      );
    });

    return (
      <Provider {...stores}>
        <div className={s.root}>
          {instancesDOM}
        </div>
      </Provider>
    );
  }
}
