import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Components.css';

@withStyles(s)
export default class Components extends Component {
  render() {
    return (
      <div
        className={s.root}
      >
        Components.
      </div>
    );
  }
}
