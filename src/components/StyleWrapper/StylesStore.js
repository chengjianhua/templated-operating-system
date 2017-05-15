// import { observable } from 'mobx';
import StyleModel from './StyleModel';

export default class StylesStore {
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
}
