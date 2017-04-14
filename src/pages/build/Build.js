import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import uuid from 'uuid/v1';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
// import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// import Preview from '../../components/Preview';

import s from './Build.css';

import * as modules from '../../modules';

const GridLayout = WidthProvider(ReactGridLayout);

const styles = {
  remove: {
    position: 'absolute',
    right: '2px',
    top: 0,
    cursor: 'pointer',
  },
};

@withStyles(s)
export default class Build extends PureComponent {

  state = {
    components: [],
  };

  buildComponents = () => {
    const { components } = this.state;

    return components.map(({ component, ...config }) => {
      const i = config.add ? '+' : config.i;

      const instance = React.createElement(component);

      /* eslint-disable jsx-a11y/no-static-element-interactions */
      return (
        <div key={i} data-grid={config}>
          {
            config.add ? (
              <span
                className="add text"
                onClick={this.onAddItem}
                title="You can add an item by clicking here, too."
              >Add +</span>
            ) : (
              <span className="text">
                {instance}
              </span>
            )
          }
          <span
            className="remove"
            style={styles.remove}
            onClick={this.onRemoveItem}
          >x</span>
        </div>
      );
    });
  };

  addComponentConfig = component => () => {
    this.setState(({ components }) => {
      const newComponent = {
        i: uuid(),
        x: (components.length * 2) % 1,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        margin: [0, 0],
        component,
      };

      return {
        components: components.concat([newComponent]),
      };
    });
  };

  renderModuleMenu = component => (
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      <MenuItem onTouchTap={this.addComponentConfig(component)} >
        添加
      </MenuItem>
      {/* <Divider />
        <MenuItem>
        </MenuItem>
        <Divider />
        <MenuItem>
        </MenuItem>*/}

    </IconMenu>
  );


  renderModules = () => {
    const moduleKeys = Object.keys(modules);

    const modulesDOM = moduleKeys.map((moduleName) => {
      const module = modules[moduleName];

      const moduleDOM = React.createElement(module, {
        key: moduleName,
      });

      return (
        <div key={moduleName} className={s.moduleWrapper}>
          <div className={s.module}>
            {moduleDOM}
          </div>
          <div>
            {this.renderModuleMenu(module)}
          </div>
        </div>
      );
    });

    return modulesDOM;
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.operationPanel}>
          {this.renderModules()}
        </div>

        <div className={s.preview}>
          <GridLayout
            cols={1}
            // rowHeight={100}
          >
            {this.buildComponents()}
          </GridLayout>
        </div>

        {/*
        <Preview className={s.preview}>
          Home
        </Preview>
        */}
      </div>
    );
  }
}
