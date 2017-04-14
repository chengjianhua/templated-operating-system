import React, { Component } from 'react';
import ReactServer from 'react-dom/server';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Preview.css';


@withStyles(s)
export default class MyComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    const { contentWindow: { document: iframeDocument } } = this.iframe;

    console.log(iframeDocument);
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
    const { ...props } = this.props;

    return (
      <iframe
        ref={this.iframeRef}
        frameBorder={0}
        width={375}
        height={667}
        // srcDoc={this.renderContent()}
        src="http://hybrid.liulishuo.com/lingome/company_board.html?debug=1&token=0c5876c045bf0134bfef0242ac110002&deviceId=995ae3a9c003dfc514b8ce79de5e528475a7b922&sDeviceId=995ae3a9c003dfc514b8ce79de5e528475a7b922&appVer=5&appId=lls&clientAppVersion=4.5&orderSourceType=#/t/jsti2017/board?_k=eaa4qr"
        {...props}
      />
    );
  }
}
