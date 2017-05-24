import { observable, action, extendObservable } from 'mobx';
import set from 'lodash/set';
import get from 'lodash/get';
import merge from 'lodash/merge';

function flat(propName, typeName) {
  switch (typeName) {
    // case 'array':

    default:
      return '';
  }
}

function shape(value) {
  const structure = {};
  const propNames = Object.keys(value);

  propNames.forEach((propName) => {
    const propType = value[propName];

    if (propType.name === 'shape') {
      structure[propName] = shape(propType.value);
    } else {
      structure[propName] = flat(propName, propType.name);
    }
  });

  return structure;
}

export default class Props {

  propsSchema;

  @observable data = {};

  constructor(propsSchema) {
    this.propsSchema = propsSchema;

    // eslint-disable-next-line no-unused-vars
    const {
      props,
    } = propsSchema;

    const structure = {};

    Object.keys(props).forEach((propName) => {
      const prop = props[propName];
      const {
        type,
        defaultValue: { value: defaultValue },
      } = prop;

      if (type.name === 'shape') {
        const value = type.value;
        structure[propName] = shape(value);
      } else {
        structure[propName] = flat(type);
      }

      const defaultValueString = defaultValue.replace(/[\r\n]*/g, '');

      merge(structure, {
        [propName]: JSON.parse(defaultValueString),
      });
    });

    extendObservable(this, {
      data: structure,
    });
  }

  @action
  set(path, value) {
    set(this.data, path, value);

    return this;
  }

  @action
  get(path) {
    return get(this.data, path);
  }

  toData() {
    const { data } = this;

    return data;
  }
}
