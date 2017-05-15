import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import isEqual from 'lodash/isEqual';

import SortableItem from './SortableItem';
import { ITEM } from './ItemTypes';

const emptyFunction = () => {};

const style = {
  // width: 400,
};

const itemTarget = {
  drop() {

  },
};

@DragDropContext(HTML5Backend)
@DropTarget(ITEM, itemTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class SortableList extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    render: PropTypes.func,
    onSortEnded: PropTypes.func,
  };

  static defaultProps = {
    render: emptyFunction,
    onSortEnded: emptyFunction,
  };

  state = {
    data: this.props.data,
  };

  moveItem = (id, atIndex) => {
    const { item, index } = this.findItem(id);

    const updatedState = update(this.state, {
      data: {
        $splice: [
          [index, 1],
          [atIndex, 0, item],
        ],
      },
    });

    // this.setState(updatedState);

    return updatedState;
  };

  findItem = (id) => {
    const { data } = this.state;
    const item = data.find(x => x.id === id);

    return {
      item,
      index: data.indexOf(item),
    };
  };

  componentWillReceiveProps({ data }) {
    if (data !== this.props.data || !isEqual(data, this.props.data)) {
      this.setState({ data });
    }
  }

  render() {
    const {
      connectDropTarget,
      render: itemRender,
      onSortEnded,
     } = this.props;
    const { data } = this.state;

    return connectDropTarget(
      <div style={style}>
        {
          data.map((item) => {
            const { id } = item;

            return (
              <SortableItem
                key={id}
                id={id}
                onSortEnded={onSortEnded}
                moveItem={this.moveItem}
                findItem={this.findItem}
              >
                {itemRender(item)}
              </SortableItem>
            );
          })
        }
      </div>,
    );
  }
}
