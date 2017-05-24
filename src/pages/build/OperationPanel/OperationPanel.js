import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import uuid from 'uuid/v1';
import forOwn from 'lodash/forOwn';
import { Input, Switch, Form } from 'antd';

import StylesEditor from './StylesEditor';

import Props from '../model/Props';

import s from './OperationPanel.css';

const { Item: FormItem } = Form;

const styles = {
  paper: {
    marginBottom: '1em',
    padding: '1em',
  },
  input: {
    marginLeft: '1em',
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const getDeepestPropName = (path) => {
  const pathNames = path.split('.');
  const { length } = pathNames;

  return pathNames[length - 1];
};

@inject('stylesStore')
@observer
export default class OperationPanel extends Component {
  static propTypes = {
    instance: PropTypes.shape({
      // name: PropTypes.string.isRequired,
      model: PropTypes.instanceOf(Props).isRequired,
    }),
  };

  static defaultProps = {
    instance: null,
  };

  handleTextChange = path => ({ target: { value } }) => {
    this.props.instance.model.set(path, value);
  };

  buildHandleToggle = path => (checked) => {
    this.props.instance.model.set(path, checked);
  };

  buildToggle = path => (
    <FormItem key={path} label={getDeepestPropName(path)} {...formItemLayout}>
      <Switch
        key={path + uuid()}
        defaultChecked={this.props.instance.model.get(path)}
        onChange={this.buildHandleToggle(path)}
      />
    </FormItem>
  );

  buildInput = path => (
    <FormItem key={path} label={getDeepestPropName(path)} {...formItemLayout}>
      <Input
        key={path + uuid()}
        defaultValue={this.props.instance.model.get(path)}
        onChange={this.handleTextChange(path)}
      />
    </FormItem>
  );

  buildShape = (path, value) => {
    const depth = path.split('.').length;

    const inputs = Object.keys(value).map((propName) => {
      const propType = value[propName];

      let input;

      const nextPath = [path, propName].join('.');

      switch (propType.name) {
        case 'shape':
          input = this.buildShape(nextPath, propType.value);
          break;
        case 'bool':
          input = this.buildToggle(nextPath);
          break;
        default:
          input = this.buildInput(nextPath);
          break;
      }

      return input;
    });

    const paperStyle = Object.assign({}, styles.paper, {
      padding: `${(depth - 1)}em 0 0 ${(depth - 1)}em`,
    });

    return (
      <div style={paperStyle}>
        {
          React.createElement(`h${depth + 1}`, null, getDeepestPropName(path))
        }

        <div>
          {inputs}
        </div>
      </div>
    );
  };

  render() {
    /* eslint-disable react/prop-types */
    const { instance, stylesStore } = this.props;

    if (!instance) {
      return (
        <div className={s.root} />
      );
    }

    const { id, model: { propsSchema } } = instance;
    const instanceStyleModel = stylesStore.getStyle(id);

    const inputs = [];

    forOwn(propsSchema.props, (value, key) => {
      const { type } = value;

      let input;

      switch (type.name) {
        case 'shape':
          input = this.buildShape(key, type.value);
          break;
        case 'bool':
          input = this.buildToggle(key);
          break;
        default:
          input = this.buildInput(key);
          break;
      }

      inputs.push(
        <div key={uuid()}>
          {input}
        </div>,
      );
    });

    return (
      <div className={s.root}>
        <div className={s.propsContainer}>
          {inputs}
        </div>

        <hr className={s.hr} />

        <div className={s.stylesInputsContainer}>
          <h2>样式</h2>
          <StylesEditor styleModel={instanceStyleModel} />
        </div>
      </div>
    );
  }
}
