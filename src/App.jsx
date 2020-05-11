import React, { useState, useEffect } from 'react';
import { ThemeProvider, makeStyles, Button } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { theme } from './config';
import { applyTasksFilters } from './helpers';

import CreateTask from './components/CreateTask';
import Filters from './components/Filters';
import Board from './components/Board';

const useStyles = makeStyles({
  createTaskButton: {
    position: 'absolute'
  }
});

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleIsVisible = () => setIsVisible(!isVisible);
  const [tagFilter, setTagFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const tasks = useStoreState(state => state.tasks);
  const fetchTasks = useStoreActions(actions => actions.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = applyTasksFilters(titleFilter, tagFilter, tasks);
  const baseColumns = {
    'to-do': {
      name: "To do",
      items: filteredTasks.filter(task => task.status === 'to-do')
    },
    'in-progress': {
      name: "In Progress",
      items: filteredTasks.filter(task => task.status === 'in-progress')
    },
    done: {
      name: "Done",
      items: filteredTasks.filter(task => task.status === 'done')
    }
  };

  const classes = useStyles(theme);

  return (
      <ThemeProvider theme={theme}>
        <Button variant="contained" className={classes.createTaskButton} onClick={toggleIsVisible}>create Task </Button>
        {isVisible && <CreateTask isVisible={isVisible} toggleVisible={toggleIsVisible} />}
        <Filters handleTagChange={setTagFilter} handleTitleChange={setTitleFilter} />
        <Board baseColumns={baseColumns}/>
      </ThemeProvider>
  );
}

export default App;
