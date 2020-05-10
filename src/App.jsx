import React, { useState } from 'react';
import { ThemeProvider, makeStyles, Button } from '@material-ui/core';
import { DragDropContext } from "react-beautiful-dnd";

import { theme } from './config';
import { applyTasksFilters } from './helpers';
import useDnd from './hooks/useDnD';

import LayOut from './layouts/LayOut';
import CreateTask from './components/CreateTask';
import Column from './components/Column';
import Filters from './components/Filters';

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
  const [isVisible, setIsVisible] = useState(false);
  const toggleIsVisible = () => setIsVisible(!isVisible);
  const [tagFilter, setTagFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const mockData = [
    {
      "title": "Whit something different",
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

  const test = applyTasksFilters(titleFilter, tagFilter, mockData);
  console.log('filtersApplied', test);

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
    <ThemeProvider theme={theme}>
      <Button variant="contained" className={classes.createTaskButton} onClick={toggleIsVisible}>create Task </Button>
      {isVisible && <CreateTask isVisible={isVisible} toggleVisible={toggleIsVisible} />}
      <Filters handleTagChange={setTagFilter} handleTitleChange={setTitleFilter} />
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
    </ThemeProvider>
  );
}

export default App;
