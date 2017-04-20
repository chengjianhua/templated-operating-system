import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';
import DevTool from 'mobx-react-devtools';

import s from './Layout.css';

const { Header, Content, Footer, Sider } = Layout;

const { Item: MenuItem } = Menu;

const { Item: BreadcrumbItem } = Breadcrumb;

export default class extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState(({ collapsed }) => ({
      collapsed: !collapsed,
    }));
  }

  render() {
    const { collapsed } = this.state;

    return (
      <Layout className={s.root}>
        <Sider
          collapsible
          breakpoint="lg"
          trigger={null}
          collapsed={collapsed}
        >
          <div className={s.logo} />

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <MenuItem key="1">
              <Link to="/">
                <Icon type="appstore-o" />
                <span className="nav-text">Dashboard</span>
              </Link>
            </MenuItem>

            <MenuItem key="2">
              <Link to="/components">
                <Icon type="folder" />
                <span className="nav-text">组件库</span>
              </Link>
            </MenuItem>

            <MenuItem key="3">
              <Link to="/build">
                <Icon type="layout" />
                <span className="nav-text">工作台</span>
              </Link>
            </MenuItem>
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={s.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>

          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            {/*<Breadcrumb style={{ margin: '12px 0' }}>
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
              <BreadcrumbItem>App</BreadcrumbItem>
            </Breadcrumb>*/}

            <div>
              {React.Children.only(this.props.children)}
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
              运营活动模板化系统 ©2016 Created by Liulishuo FE
          </Footer>

          {
            process.env.NODE_ENV !== 'production' && (
              <DevTool />
            )
          }
        </Layout>
      </Layout>
    );
  }
}
