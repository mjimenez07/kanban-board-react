import React, { useState, useEffect, useCallback } from 'react';
import { Grid, ThemeProvider, makeStyles, Button } from '@material-ui/core';
import { DragDropContext } from "react-beautiful-dnd";

import { theme } from './config';
import { getTasks } from './services/firebaseService';
import { multiSelectTo as multiSelect } from './helpers';

import CreateTask from './components/CreateTask';
import Column from './components/Column';

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: 'rgb(36, 40, 42)',
    width: '100vw',
    height: '100vh',
    color: '#fff'
  },
  createTaskButton: {
    position: 'absolute'
  }
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const toggleIsVisible = useCallback(() => setIsVisible(!isVisible), [isVisible]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchData();
  }, []);
  console.log(tasks);

  const mockData = [
    {
      "title": "",
      "assignee": "Foo User",
      "createdDate": {
        "seconds": 1588971215,
        "nanoseconds": 347000000
      },
      "description": "",
      "tag": "article",
      "status": "to-do",
      "dueDate": {
        "seconds": 1588971108,
        "nanoseconds": 893000000
      },
      "id": "BI3UvhcXIKvGwpRTwyLo"
    },
    {
      "title": "Testing",
      "assignee": "Foo User",
      "tag": "blog-post",
      "createdDate": {
        "seconds": 1588970468,
        "nanoseconds": 493000000
      },
      "description": "fancy description",
      "status": "in-progress",
      "dueDate": {
        "seconds": 1591476055,
        "nanoseconds": 0
      },
      "id": "d1rDWI8lB5pqNj643cNh"
    }
  ];

  const baseColumns = {
    'to-do': {
      name: "To do",
      items: mockData.filter(task => task.status === 'to-do')
    },
    'in-progress': {
      name: "In Progress",
      items: mockData.filter(task => task.status === 'in-progress')
    },
    done: {
      name: "Done",
      items: mockData.filter(task => task.status === 'done')
    }
  };

  const [columns, setColumns] = useState(baseColumns);
  const [selectedTasksIds, setSelectedTasksIds] = useState([]);
  const [draggingTaskId, setDragginTaskId] = useState(null)

  function onDragStart(start) {
    const id = start.draggableId;
    const selected = selectedTasksIds.find(
      (taskId)  => taskId === id,
    );
    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      unselectAll();
    }
    setDragginTaskId(start.draggableId);
  };

  function onDragEnd(result, columns, setColumns) {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];

      if(selectedTasksIds.length > 1) {
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter(item => !selectedTasksIds.includes(item.id))
          },
          [destination.droppableId]: {
            ...destColumn,
            items: [...destColumn.items, ...sourceColumn.items.filter(item => selectedTasksIds.includes(item.id))]
          }
        });
        setDragginTaskId(null);
        setSelectedTasksIds([]);
        return;
      }

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter(item => item.id !== draggingTaskId)
        },
        [destination.droppableId]: {
          ...destColumn,
          items: [...destColumn.items, sourceColumn.items.find(item => item.id === draggingTaskId)]
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
    setDragginTaskId(null);
    setSelectedTasksIds([]);
  };

  const unselectAll = () => setSelectedTasksIds([]);

  function toggleSelection(taskId) {
    const wasSelected = selectedTasksIds.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTasksIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedTasksIds(newTaskIds);
  };

   function toggleSelectionInGroup(taskId) {
    const index = selectedTasksIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedTasksIds([...selectedTasksIds, taskId]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTasksIds];
    shallow.splice(index, 1);
    setSelectedTasksIds(shallow);
  };

   function multiSelectTo(newTaskId) {
      const updated = multiSelect(
        columns,
        selectedTasksIds,
        newTaskId,
      );

      if (updated == null) {
        return;
      }

      setSelectedTasksIds(updated)
    };

  const classes = useStyles(theme);

  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" className={classes.createTaskButton} onClick={() => toggleIsVisible()}>create Task </Button>
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        <Grid container direction="column" className={classes.wrapper}>
          <Grid item container>
            <Grid item xs={2}/>
            <Grid item xs={8} container>
              {isVisible && <CreateTask isVisible={isVisible} toggleVisible={toggleIsVisible} />}
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
            </Grid>
            <Grid item xs={2}/>
          </Grid>
        </Grid>
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;
