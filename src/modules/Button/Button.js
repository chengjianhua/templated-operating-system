import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { observer } from 'mobx-react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Button.css';

@observer
@withStyles(s)
export default class Button extends Component {
  static displayName = 'Button';

  /* eslint-disable comma-dangle, quotes, quote-props */
  static propTypes = {
    "label": PropTypes.node,
    "fullWidth": PropTypes.bool,
    ...FlatButton.propTypes,
  };

  static defaultProps = {
    "label": "按钮",
    "fullWidth": true,
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
