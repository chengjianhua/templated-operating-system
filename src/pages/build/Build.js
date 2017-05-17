import React, { PureComponent } from 'react';
import { action, reaction } from 'mobx';
// import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import { observer, inject } from 'mobx-react';
import { Row, Col, Tabs, Icon, message, Button } from 'antd';

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

/* eslint react/prop-types: ['error', { ignore: ['buildStore'] }] */
@inject('buildStore')
@observer
export default class Build extends PureComponent {
  operatingInstanceDisposer;

  handleTabClick = (activeKey) => {
    this.props.buildStore.setActiveKey(activeKey);
  };

  handleInstanceClick = (clickedInstance) => {
    const { buildStore } = this.props;

    this.handleTabClick('edit');

    if (buildStore.operatingInstance !== clickedInstance) {
      buildStore.setOperatingInstance(clickedInstance);
    }
  };

  @action handleAddInstance = ({ name, propsSchema, type, path }) => {
    const { buildStore } = this.props;
    const { instances } = buildStore;

    const model = new Props(propsSchema);
    const identifier = `${name}-${uuid()}`;
    const instance = {
      id: identifier,
      index: componentCount(name),
      path,
      name,
      type,
      model,
    };

    instances.push(instance);
    buildStore.setOperatingInstance(instance);

    message.success(`添加组件「 ${name} 」成功`);
  };

  buildHandleDeleteInstance = instance => action(() => {
    const { name, index: instanceIndex } = instance;
    const { instances } = this.props.buildStore;
    const arrayIndex = instances.findIndex(x => x.id === instance.id);

    instances.splice(arrayIndex, 1);

    message.success(`组件「 ${name} - ${instanceIndex} 」已被删除`);
  });

  buildSortableInstance = (item) => {
    const { index, model: { data }, name } = item;

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
    this.props.buildStore.setInstances(sortedInstances);
  };

  handleUpload = () => {
    const { buildStore } = this.props;

    buildStore.create()
    .then(() => {
      message.success('上传配置成功');
    })
    .catch(() => {
      message.error('上传配置失败');
    });
  };

  componentWillMount() {
    const { buildStore } = this.props;

    this.operatingInstanceDisposer = reaction(
      () => buildStore.instances.length,
      (instancesLength) => {
        if (instancesLength === 0) {
          buildStore.setOperatingInstance(null);

          return;
        }

        const { operatingInstance, instances } = buildStore;
        const isExist = instances.some(i => i === operatingInstance);

        if (!isExist && operatingInstance) {
          buildStore.setOperatingInstance(instances[instancesLength - 1]);
        }
      },
    );
  }

  componentWillUnmount() {
    this.operatingInstanceDisposer();
  }

  render() {
    const { operatingInstance, activeKey, instances } = this.props.buildStore;

    return (
      <div>
        <Row>
          <Col span={24}>
            <Button type="primary" onClick={this.handleUpload}>上传页面</Button>
          </Col>
        </Row>
        <div className={s.main}>
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
      </div>
    );
  }
}
