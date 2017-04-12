import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Home.css';

@withStyles(s)
export default class Home extends Component {
  render() {
    return (
      <div
        className={s.root}
      >
        Homepage.
      </div>
    );
  }
}
