import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import { ITEM } from './ItemTypes';

const style = {
  cursor: 'move',
};

let hoveredTarget;

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findItem(props.id).index,
    };
  },

  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    let finalTarget = [droppedId, originalIndex];

    if (!didDrop) {
      console.log('did not drop');
      // do nothing
    } else if (hoveredTarget) {
      finalTarget = hoveredTarget;
    }

    const { onSortEnded } = props;
    const { data } = props.moveItem(...finalTarget);

    onSortEnded(data);

    hoveredTarget = undefined;
  },
};

const cardTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props;

    if (draggedId !== overId) {
      const { index: overIndex } = props.findItem(overId);
      // const { onSortEnded } = props;
      // const { data } = props.moveItem(draggedId, overIndex);

      // onSortEnded(data);

      // eslint-disable-next-line no-param-reassign
      hoveredTarget = [draggedId, overIndex];
    }
  },
};

/* eslint-disable react/no-unused-prop-types */

@DropTarget(ITEM, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ITEM, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class SortableItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    id: PropTypes.any.isRequired,
    moveItem: PropTypes.func.isRequired,
    findItem: PropTypes.func.isRequired,
    onSortEnded: PropTypes.func.isRequired,
  };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      children,
    } = this.props;

    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{ ...style, opacity }}>
        {children}
      </div>,
    ));
  }
}
