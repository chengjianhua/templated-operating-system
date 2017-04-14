import React, { Component } from 'react';
import ReactServer from 'react-dom/server';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Preview.css';

const styles = {
  root: {
    width: '375px',
    height: '667px',
  },
};

@withStyles(s)
export default class MyComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    // const { contentWindow: { document: iframeDocument } } = this.iframe;

    // console.log(iframeDocument);
  }

  iframeRef = (ref) => { this.iframe = ref; };

  renderContent = () => {
    const { children } = this.props;

    const html = ReactDOM.renderToString(
      <html lang="zh-CN">
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>预览手机展示</title>
        <body>
          {children}
        </body>
      </html>,
    );

    return html;
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <div
        ref={this.iframeRef}
        style={styles.root}
        {...props}
      >
        {children}
      </div>
    );
  }
}
