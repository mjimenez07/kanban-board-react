import React  from "react";
import { Droppable } from "react-beautiful-dnd";
import memoizeOne from 'memoize-one';
import Task from '../Task';
import { Typography } from "@material-ui/core";

const getSelectedMap = memoizeOne((selectedTaskIds) =>
  selectedTaskIds.reduce((previous, current)=> {
    previous[current] = true;
    return previous;
  }, {}),
);

function Column({ column, columnId, multiSelectTo, toggleSelection, toggleSelectionInGroup, selectedTasksIds, draggingTaskId }) {
  return (
    <div style={{
      display: "flex",
      flex: 1,
      flexDirection: "column",
      alignItems: "center"
    }}
  >
      <Typography variant="h4">{column.name}</Typography>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background: snapshot.isDraggingOver
                  ? "#FF6347"
                  : "lightgrey",
                padding: '4px',
                width: '250px',
                minHeight: '500px',
                height: '93vh'
              }}
            >
                {column.items.map((item, index) => {
                  const isSelected = Boolean(
                    getSelectedMap(selectedTasksIds)[item.id],
                  );
                  const isGhosting = isSelected && Boolean(draggingTaskId) && draggingTaskId !== item.id;
                  return (
                    <Task
                      isSelected={isSelected}
                      isGhosting={isGhosting}
                      key={`task-${item.id}`}
                      task={item}
                      index={index}
                      toggleSelection={toggleSelection}
                      toggleSelectionInGroup={toggleSelectionInGroup}
                      multiSelectTo={multiSelectTo}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
      </Droppable>
    </div>
  )
}

export default Column;
