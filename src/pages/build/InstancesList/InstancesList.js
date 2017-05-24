import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPT } from 'mobx-react';
import emptyFunction from 'fbjs/lib/emptyFunction';

import StyleWrapper from '../../../components/StyleWrapper/StyleWrapper';

import Props from '../model/Props';

import s from './InstancesList.css';

@observer
export default class extends Component {
  static propTypes = {
    instances: MPT.arrayOrObservableArrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      model: PropTypes.instanceOf(Props).isRequired,
      type: PropTypes.oneOfType([
        PropTypes.instanceOf(Component),
        PropTypes.instanceOf(Function),
      ]).isRequired,
    })),
    onInstanceClick: PropTypes.func,
  };

  static defaultProps = {
    instances: [],
    onInstanceClick: emptyFunction,
  };

  buildHandleInstanceClick = clickedInstance => () => {
    this.props.onInstanceClick(clickedInstance);
  };

  render() {
    const { instances } = this.props;

    const instancesDOM = instances.map((instance) => {
      const { model, type, id } = instance;
      const element = React.createElement(observer(type), model.data);

      /* eslint-disable jsx-a11y/no-static-element-interactions */
      return (
        <div
          key={id}
          className={s.instance}
          onClick={this.buildHandleInstanceClick(instance)}
        >
          <StyleWrapper id={id}>
            {element}
          </StyleWrapper>
        </div>
      );
    });

    return (
      <div className={s.instances}>
        {instancesDOM}
      </div>
    );
  }
}
