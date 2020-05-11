import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core';

import { theme } from '../../config';
import useDnd from '../../hooks/useDnD';

import Column from '../Column';
import LayOut from '../../layouts/LayOut';

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: 'rgb(36, 40, 42)',
    width: '100vw',
    height: '100vh',
    color: '#fff'
  },
});

function Board({ baseColumns }) {
  const {
    columns,
    draggingTaskId,
    selectedTasksIds,
    multiSelectTo,
    toggleSelection,
    toggleSelectionInGroup,
    onDragStart,
    onDragEnd
  } = useDnd(baseColumns);

  const classes = useStyles(theme);

  return (
    <DragDropContext
    onDragStart={onDragStart}
    onDragEnd={result => onDragEnd(result, columns)}
  >
    <LayOut className={classes.wrapper}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <Column
              draggingTaskId={draggingTaskId}
              selectedTasksIds={selectedTasksIds}
              key={column.name}
              column={column}
              columnId={columnId}
              multiSelectTo={multiSelectTo}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
            />
          );
        })}
    </LayOut>
  </DragDropContext>

  );
}

Board.propTypes = {
  baseColumns: PropTypes.object
}

export default Board;
