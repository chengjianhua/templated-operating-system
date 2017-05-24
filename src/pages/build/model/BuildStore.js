import { observable, action } from 'mobx';

import request from 'core/request';
import { IONamespaces } from 'constants';

import io from 'socket.io-client';

// const socket = io(IONamespaces.PAGES_BUILD);

class BuildStore {
  stylesStore;

  id;
  @observable instances = [];
  @observable operatingInstance;
  @observable activeKey = 'libraries';

  constructor(stylesStore) {
    this.stylesStore = stylesStore;
  }

  // TODO: add save
  // @action save() {
  //   if (this.id) {

  //   }
  // }

  @action create() {
    const { instances, stylesStore } = this;
    const styles = stylesStore.getStyles();
    const page = {
      instances: instances.map(({ id, index, path, name, model }) => ({
        id,
        index,
        path,
        name,
        data: model.toData(),
      })),
      styles,
    };

    return request.post('/pages', {
      page,
    });
  }

  // TODO: add update
  // @action update() {

  // }

  @action setActiveKey(activeKey) {
    this.activeKey = activeKey;
  }

  @action setOperatingInstance(operatingInstance) {
    this.operatingInstance = operatingInstance;
  }

  @action setInstances(instances) {
    this.instances = instances;
  }
}

export default BuildStore;
