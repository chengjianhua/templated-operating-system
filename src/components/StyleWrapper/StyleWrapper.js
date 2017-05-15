import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';

import Style from './StyleModel';

/* eslint-disable comma-dangle, quotes, quote-props */

/* eslint react/prop-types: ['error', { ignore: ['stylesStore'] }] */
@inject(({ styles: stylesStore }) => ({
  stylesStore,
}))
@observer
export default class StyleWrapper extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
  };

  static defaultProps = {
    "center": false,
    "fixed": ""
  };

  @observable model;

  elRef = ref => (this.el = ref);

  @action initializeStyleModel() {
    const { id, stylesStore } = this.props;

    const style = new Style(id);

    stylesStore.addStyle(style);

    this.model = style;
  }

  componentWillMount() {
    this.initializeStyleModel();
  }

  componentDidMount() {
    const { el } = this;
    const node = findDOMNode(el);
    const styleObject = window.getComputedStyle(node);
    this.model.initializeFromDOM(styleObject);
  }

  componentWillUnmount() {
    const { id, stylesStore } = this.props;

    stylesStore.removeStyle(id);
  }

  render() {
    const { model: { style } } = this;
    const { children } = this.props;
    const onlyChildren = React.Children.only(children);
    const newChildren = React.cloneElement(onlyChildren, {
      ref: this.elRef,
      style,
    });

    return newChildren;
  }
}
