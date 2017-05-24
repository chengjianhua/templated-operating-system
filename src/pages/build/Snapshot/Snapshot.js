import React, { Component } from 'react';
import PropTypes from 'prop-types';

import emptyFunction from 'fbjs/lib/emptyFunction';

export default class Snapshot extends Component {
  static propTypes = {
    onMounted: PropTypes.func,
  };

  static defaultProps = {
    onMounted: emptyFunction,
  };

  canvasRef = ref => (this.canvas = ref);

  componentDidMount() {
    this.props.onMounted();
  }

  render() {
    return (
      <canvas ref={this.canvasRef} />
    );
  }
}
