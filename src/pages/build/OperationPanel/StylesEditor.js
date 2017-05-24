import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isObservableObject } from 'mobx';
import { observer } from 'mobx-react';
import { Input, Form } from 'antd';
import pick from 'lodash/pick';
import isObject from 'lodash/isObject';

import StyleModel from '../../../components/StyleWrapper/StyleModel';

const { Item: FormItem } = Form;

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

const StylePropertiesTextMap = {
  width: '宽度',
  height: '高度',
  lineHeight: '行高',
  margin: '外边距',
  padding: '内边距',
  background: '背景',
  backgroundColor: '背景颜色',
  backgroundImage: '背景图片',
  center: '居中',
  fixed: '固定',
};

const getDeepestPropName = (path) => {
  const pathNames = path.split('.');

  return pathNames[pathNames.length - 1];
};

@observer
export default class StylesEditor extends Component {
  static propTypes = {
    styleModel: PropTypes.instanceOf(StyleModel),
  };

  static defaultProps = {
    styleModel: null,
  };

  buildHandleTextChange = path => ({ target: { value } }) => {
    this.props.styleModel.set(path, value);
  };

  buildInput = (path) => {
    const deepestPropertyName = getDeepestPropName(path);
    const label = StylePropertiesTextMap[deepestPropertyName] || deepestPropertyName;

    return (
      <FormItem
        key={path}
        label={label}
        {...formItemLayout}
      >
        <Input
          defaultValue={this.props.styleModel.get(path)}
          onChange={this.buildHandleTextChange(path)}
        />
      </FormItem>
    );
  }

  render() {
    const { styleModel } = this.props;

    if (!styleModel) {
      return null;
    }

    const inputs = Object.keys(pick(styleModel, ['center', 'fixed', 'editableStyle'])).map((propertyName) => {
      const property = styleModel[propertyName];

      if ([isObject, isObservableObject].some(fn => fn(property))) {
        return Object.keys(property).map(p => this.buildInput([propertyName, p].join('.')));
      }

      return this.buildInput(propertyName);
    });

    return (
      <div>
        {inputs}
      </div>
    );
  }
}
