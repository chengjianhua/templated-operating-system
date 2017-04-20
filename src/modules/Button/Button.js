import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tappable from 'react-tappable';
import cx from 'classnames';

import s from './Button.css';

export default class Button extends Component {
  static displayName = 'Button';

  /* eslint-disable comma-dangle, quotes, quote-props */
  static propTypes = {
    "label": PropTypes.node,
    "fullWidth": PropTypes.bool,
  };

  static defaultProps = {
    "label": "按钮",
    "fullWidth": true
  };

  render() {
    const { label, fullWidth, ...props } = this.props;
    const className = cx(
      s.root,
      fullWidth && s.fullWidth,
    );

    return (
      <Tappable
        component="button"
        className={className}
        {...props}
      >
        {label}
      </Tappable>
    );
  }
}
