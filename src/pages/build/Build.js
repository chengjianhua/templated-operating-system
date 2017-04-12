import React, { PureComponent } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Build.css';

@withStyles(s)
export default class Build extends PureComponent {
  render() {
    return (
      <div>
        Build.
      </div>
    );
  }
}
