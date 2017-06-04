import set from 'lodash/set';
import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import {
  observable,
  action,
  computed,
  extendObservable,
} from 'mobx';

const defaultStyle = {
  width: 'auto',
  height: 'auto',
  lineHeight: 'inherit',
  margin: 0,
  padding: 0,
  backgroundImage: '',
  backgroundColor: 'transparent',
};

export default class StyleModel {
  id;

  @observable editableStyle = defaultStyle;
  @observable center = true;
  @observable fixed = '';
  @computed get style() {
    if (!this.initialized) {
      return undefined;
    }

    const result = Object.assign({}, this.editableStyle);

    return result;
  }

  constructor(id) {
    this.id = id;

    extendObservable(this, {
      initialized: false,
    });

    Object.defineProperty(this, 'initialized', Object.assign({}, {
      enumerable: false,
    }));
  }

  @action initializeFromDOM(cssStyleDeclaration) {
    const editableKeys = Object.keys(defaultStyle);
    const styleNeedAssign = editableKeys
      .map((key) => {
        const keyKebabCase = kebabCase(key);
        const cssValue = cssStyleDeclaration.getPropertyValue(keyKebabCase);

        return [key, cssValue];
      })
      .reduce((acc, [key, cssValue]) => {
        acc[key] = cssValue;

        return acc;
      }, {});

    Object.assign(this.editableStyle, styleNeedAssign);
    this.initialized = true;

    return this;
  }

  @action
  set(path, value) {
    set(this, path, value);

    return this;
  }

  get(path) {
    return get(this, path);
  }

  toData() {
    const { center, id, fixed, style } = this;

    return { id, center, fixed, style };
  }
}
