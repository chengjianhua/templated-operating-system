import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link, withRouter } from 'react-router-dom';

import s from './Layout.css';

const styles = {
  sidebar: {
    flex: 1,
  },
};

@withStyles(s)
@withRouter
export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
  };

  state = {
    drawerOpen: false,
  };

  handleAppBarLeftIconTouch = () => {
    this.setState(({ drawerOpen }) => ({
      drawerOpen: !drawerOpen,
    }));
  };

  render() {
    const { drawerOpen } = this.state;

    const sidebarClass = cx(
      s.sidebar, {
        [s.close]: !drawerOpen,
      },
    );

    return (
      <div className={s.root}>
        <header>
          <AppBar
            title="运营模板系统"
            onLeftIconButtonTouchTap={this.handleAppBarLeftIconTouch}
          />
        </header>

        <section className={s.section}>

          <main className={s.main}>
            {this.props.children}
          </main>

          <aside className={sidebarClass}>
            <Paper zDepth={1} style={styles.sidebar}>
              <Link to="/">
                <MenuItem>Dashboard</MenuItem>
              </Link>
              <Link to="/components">
                <MenuItem>组件库</MenuItem>
              </Link>
              <Link to="/build">
                <MenuItem>制作</MenuItem>
              </Link>
            </Paper>
          </aside>
        </section>

        <footer>
          {''}
        </footer>

      </div>
    );
  }
}
