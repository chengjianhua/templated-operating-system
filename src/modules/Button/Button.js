import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Button.css';

@withStyles(s)
export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '按钮',
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <FlatButton
        {...props}
      >
        {children}
      </FlatButton>
    );
  }
}
