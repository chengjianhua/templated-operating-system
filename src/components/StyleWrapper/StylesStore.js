// import { observable } from 'mobx';

import StyleModel from './StyleModel';

export default class StylesStore {
  readonly = false;

  styles = {};

  addStyle(style) {
    if (!(style instanceof StyleModel)) {
      throw new Error('The parameter should be be an instance of StyleModel');
    }

    Object.assign(this.styles, {
      [style.id]: style,
    });
  }

  getStyle(id) {
    return this.styles[id];
  }

  removeStyle(id) {
    delete this.styles[id];
  }

  getStyles() {
    return Object.keys(this.styles).map((key) => {
      const style = this.styles[key].toData();

      return [key, style];
    })
    .reduce((acc, [key, style]) => {
      acc[key] = style;

      return acc;
    }, {});
  }

  turnReadonly() {
    this.readonly = true;

    return this;
  }

  // turnEditable() {
  //   this.readonly = false;
  // }

  static fromJS(styles) {
    const store = new StylesStore();

    store.styles = styles;

    return store;
  }
}
