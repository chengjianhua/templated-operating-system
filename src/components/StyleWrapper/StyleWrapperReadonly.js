import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

/* eslint react/prop-types: ['error', { ignore: ['stylesStore'] }] */
@inject('stylesStore')
export default class StyleWrapperReadonly extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
  };

  elRef = ref => (this.el = ref);

  render() {
    const { id, stylesStore, children } = this.props;
    const style = stylesStore.getStyle(id);
    const onlyChildren = React.Children.only(children);
    const newChildren = React.cloneElement(onlyChildren, {
      ref: this.elRef,
      style,
    });

    return newChildren;
  }
}
