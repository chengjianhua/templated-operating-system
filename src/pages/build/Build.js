import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import uuid from 'uuid/v1';
import forOwn from 'lodash/forOwn';
import { observer } from 'mobx-react';

import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

// import Preview from '../../components/Preview';

import * as modules from '../../modules';
import modulesDocs from '../../modules/module-docs.json';

import Props from './model/Props';

import OperationPanel from './OperationPanel';

import s from './Build.css';

const getModuleDoc = (function () {
  const docs = Object.keys(modulesDocs);

  return (moduleName) => {
    for (let i = docs.length - 1; i >= 0; i--) {
      const moduleKey = docs[i];

      if (moduleKey.indexOf(moduleName) !== -1) {
        return modulesDocs[moduleKey];
      }
    }

    return null;
  };
}());

const modulesWithPropsSchemaArray = Object.keys(modules).map((moduleKey) => {
  const moduleWithPropsSchema = {
    type: modules[moduleKey],
    propsSchema: getModuleDoc(moduleKey),
    name: moduleKey,
  };

  return moduleWithPropsSchema;
});

const modulesWithPropsSchema = modulesWithPropsSchemaArray.reduce((
  previousValue,
  currentValue,
) => {
// eslint-disable-next-line no-param-reassign
  previousValue[currentValue.name] = currentValue;

  return previousValue;
}, {});

const styles = {
  paperInput: {
    marginBottom: '1em',
    padding: '1em',
  },
};

@withStyles(s)
@observer
export default class Build extends PureComponent {

  state = {
    instances: [],
    operatingInstance: null,
  };

  handleClickInstance = clickedInstance => () => {
    const { operatingInstance } = this.state;

    if (operatingInstance !== clickedInstance) {
      this.setState(() => ({
        operatingInstance: clickedInstance,
      }));
    }
  };

  buildInstances = () => {
    const { instances } = this.state;

    return instances.map((instance) => {
      const { key, name, model } = instance;
      const { type } = modulesWithPropsSchema[name];
      const element = React.createElement(observer(type), model.data);

      /* eslint-disable jsx-a11y/no-static-element-interactions */
      return (
        <div key={key} className={s.instanceWrapper}>
          <div
            className={s.instance}
            onClick={this.handleClickInstance(instance)}
          >
            {element}
          </div>
        </div>
      );
    });
  };

  addInstance = ({ name, propsSchema }) => () => {
    this.setState(({ instances }) => {
      const model = new Props(propsSchema);
      const instance = {
        key: `${name}-${uuid()}`,
        name,
        model,
        propsSchema,
      };

      // console.log('addInstance, ', model);

      return {
        instances: instances.concat(instance),
      };
    });
  };

  renderModules = () => {
    const modulesDOM = modulesWithPropsSchemaArray.map((moduleWithPropsSchema) => {
      const { type, name } = moduleWithPropsSchema;
      const moduleDOM = React.createElement(type);

      return (
        <div key={name} className={s.moduleWrapper}>
          <div className={s.module}>
            {moduleDOM}
          </div>
          <div className={s.menu}>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem onTouchTap={this.addInstance(moduleWithPropsSchema)} >
                添加
              </MenuItem>
            </IconMenu>
          </div>
        </div>
      );
    });

    return modulesDOM;
  };

  render() {
    const { operatingInstance } = this.state;

    return (
      <div className={s.root}>
        <div className={s.modulesWrapper}>
          <h1>组件库</h1>

          <div className={s.modules}>
            {this.renderModules()}
          </div>
        </div>

        <div className={s.operationPanelWrapper}>
          <h1>操作面板</h1>

          <div className={s.operationPanel}>
            {
              operatingInstance && (
                <OperationPanel
                  {...operatingInstance}
                />
              )
            }
          </div>
        </div>

        <div className={s.preview}>
          <h1>布局</h1>

          <div>
            {this.buildInstances()}
          </div>
        </div>
      </div>
    );
  }
}
