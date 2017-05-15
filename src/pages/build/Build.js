import React, { PureComponent } from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
import { observable, action, autorun, reaction } from 'mobx';
// import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
// import forOwn from 'lodash/forOwn';
import { observer } from 'mobx-react';
import { Row, Col, Tabs, Icon, message } from 'antd';
// import rasterizeHTML from 'rasterizehtml/dist/rasterizeHTML.allinone';

import SortableList from '../../components/SortableList';

import Props from './model/Props';

import OperationPanel from './OperationPanel';
import ModuleLibraries from './ModuleLibraries';
import InstancesList from './InstancesList';

import s from './Build.css';

const { TabPane } = Tabs;

const countMap = {};
const componentCount = (name) => {
  if (countMap[name]) {
    countMap[name] += 1;
  } else {
    countMap[name] = 1;
  }

  return countMap[name];
};

@observer
export default class Build extends PureComponent {
  @observable instances = [];
  @observable operatingInstance = null;
  @observable activeKey = 'libraries';

  state = {
    instances: [],
    operatingInstance: null,
    activeKey: 'edit',
  };

  constructor(...args) {
    super(...args);

    reaction(
      () => this.instances.length,
      (instancesLength) => {
        const { operatingInstance, instances } = this;
        const isExist = instances.some(i => i === operatingInstance);

        if (!isExist && operatingInstance) {
          if (instancesLength > 0) {
            this.operatingInstance = instances[length - 1];
            return;
          }

          this.operatingInstance = null;
        }
      },
    );
  }

  @action handleTabClick = (activeKey) => {
    this.activeKey = activeKey;
  };

  @action handleInstanceClick = (clickedInstance) => {
    const { operatingInstance } = this;

    this.handleTabClick('edit');

    if (operatingInstance !== clickedInstance) {
      this.operatingInstance = clickedInstance;
    }
  };

  @action handleAddInstance = ({ name, propsSchema, type, path }) => {
    const model = new Props(propsSchema);
    const identifier = `${name}-${uuid()}`;
    const instance = {
      id: identifier,
      index: componentCount(name),
      path,
      name,
      propsSchema,
      type,
      model,
    };

    this.instances.push(instance);
    this.operatingInstance = instance;

    message.success(`添加组件「 ${name} 」成功`);
  };

  buildHandleDeleteInstance = instance => action(() => {
    const { name, index: instanceIndex } = instance;
    const { instances } = this;
    const arrayIndex = instances.findIndex(x => x.id === instance.id);

    instances.splice(arrayIndex, 1);

    message.success(`组件「 ${name} - ${instanceIndex} 」已被删除`);
  });

  buildSortableInstance = (item) => {
    const { index, model: { data }, name } = item;

    // const canvas = document.createElement('canvas');
    // canvas.setAttribute('id', `canvas-${id}`);
    // const context = canvas.getContext('2d');

    // rasterizeHTML.drawHTML(html).then(({ image }) => {
    //   context.drawImage(image, 10, 25);
    //   document.body.appendChild(image);
    //   console.log(image);
    // });

    // return `${name} - ${index} ${JSON.stringify(data)}`;
    return (
      <div className={s.sortableItemWrapper}>
        <div className={s.sortableItem}>
          {name} - {index} {JSON.stringify(data, null, 0)};
        </div>

        <div className={s.sortableItemOperations}>
          <Icon
            type="close-circle-o"
            className={s.icon}
            onClick={this.buildHandleDeleteInstance(item)}
          />
        </div>
      </div>
    );
  };

  @action handleSortEnded = (sortedInstances) => {
    this.instances = sortedInstances;
  };

  render() {
    const { operatingInstance, activeKey, instances } = this;

    return (
      <div className={s.root}>
        <div className={s.instances}>
          <InstancesList
            instances={instances}
            onInstanceClick={this.handleInstanceClick}
          />
        </div>

        <div className={s.controls}>
          <Tabs
            activeKey={activeKey}
            onTabClick={this.handleTabClick}
          >
            <TabPane
              key="list"
              tab="列表"
            >
              <SortableList
                data={instances.toJS()}
                render={this.buildSortableInstance}
                onSortEnded={this.handleSortEnded}
              />
            </TabPane>

            <TabPane
              key="edit"
              tab="编辑"
            >
              <OperationPanel
                instance={operatingInstance}
              />
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
    );
  }
}
