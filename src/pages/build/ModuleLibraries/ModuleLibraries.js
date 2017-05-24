import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { modulesWithPropsSchemaArray } from './modulesWithPropsSchema';

import s from './ModuleLibraries.css';

export default class ModuleLibraries extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
  };

  handleAdd = moduleWithPropsSchema => () => {
    const { onAdd } = this.props;

    onAdd(moduleWithPropsSchema);
  };

  render() {
    const modules = modulesWithPropsSchemaArray.map((moduleWithPropsSchema) => {
      const { type, path } = moduleWithPropsSchema;
      const moduleDOM = React.createElement(type);

      return (
        <div key={path} className={s.moduleWrapper}>
          <div className={s.module}>
            {moduleDOM}
          </div>

          <div className={s.operations}>
            <Icon
              type="plus-circle-o"
              className={s.icon}
              onClick={this.handleAdd(moduleWithPropsSchema)}
            />
          </div>
        </div>
      );
    });

    return (
      <div>
        {modules}
      </div>
    );
  }
}
