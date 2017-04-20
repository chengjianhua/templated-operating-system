import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import forOwn from 'lodash/forOwn';
import { observer } from 'mobx-react';
import { Row, Col, Tabs, Icon } from 'antd';

import Props from './model/Props';

import OperationPanel from './OperationPanel';
import ModuleLibraries from './ModuleLibraries';
import StyleWrapper from './StyleWrapper';

import s from './Build.css';

const { TabPane } = Tabs;

const styles = {
  paperInput: {
    marginBottom: '1em',
    padding: '1em',
  },
  tab: {
    width: `${100 / 3}%`,
  },
};

@observer
export default class Build extends PureComponent {

  state = {
    instances: [],
    operatingInstance: null,
    activeKey: 'edit',
  };

  handleTabClick = (activeKey) => {
    this.setState({ activeKey });
  };

  handleClickInstance = clickedInstance => () => {
    const { operatingInstance } = this.state;

    this.setState({ activeKey: 'edit' });

    if (operatingInstance !== clickedInstance) {
      this.setState(() => ({
        operatingInstance: clickedInstance,
      }));
    }
  };

  buildInstances = () => {
    const { instances } = this.state;

    return instances.map((instance) => {
      const { key, model, type } = instance;
      const element = React.createElement(observer(type), model.data);

      /* eslint-disable jsx-a11y/no-static-element-interactions */
      return (
        <div key={key} className={s.instanceWrapper}>
          <div
            className={s.instance}
            onClick={this.handleClickInstance(instance)}
          >
            <StyleWrapper>
              {element}
            </StyleWrapper>
          </div>
        </div>
      );
    });
  };

  handleAddInstance = ({ name, propsSchema, type }) => {
    this.setState(({ instances }) => {
      const model = new Props(propsSchema);
      const instance = {
        key: `${name}-${uuid()}`,
        name,
        propsSchema,
        type,
        model,
      };

      return {
        instances: instances.concat(instance),
        operatingInstance: instance,
      };
    });
  };

  render() {
    const { operatingInstance, activeKey } = this.state;

    return (
      <div className={s.root}>
        <div className={s.instances}>
          {this.buildInstances()}
        </div>

        <div className={s.controls}>
          <div className={s.operationPanel}>

            <Tabs
              activeKey={activeKey}
              onTabClick={this.handleTabClick}
            >
              <TabPane
                key="list"
                tab="列表"
              >

              </TabPane>

              <TabPane
                key="edit"
                tab="编辑"
              >
                {
                  operatingInstance && (
                    <OperationPanel
                      {...operatingInstance}
                    />
                  )
                }
              </TabPane>

              <TabPane
                key="libraries"
                tab="组件库"
              >
                <ModuleLibraries
                  onAdd={this.handleAddInstance}
                />
              </TabPane>
            </Tabs>

          </div>
        </div>

      </div>
    );
  }
}
