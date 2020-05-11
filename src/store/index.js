import { createStore, thunk, action } from 'easy-peasy';
import { getTasks, createTask, updateTask, deleteTask } from '../services/firebaseService';

const tasksModel = {
  tasks: [],
  addTasks: action((state, payload) => {
    state.tasks = [...payload];
  }),
  fetchTasks: thunk(async (actions) => {
    try {
      const data = await getTasks();
      actions.addTasks(data);
    } catch(error) {
      throw new Error(`Something went wrong fetching the tasks ${error}`);
    }
  }),
  createTask: thunk(async (actions, payload) => {
    try {
      await createTask(payload);
      actions.fetchTasks();
    } catch(error) {
      throw new Error(`Something went wrong while creating the task please ${error}`);
    }
  }),
  updateTask: thunk(async (_, { id, values }) => {
    try {
      await updateTask(id, values);
    } catch(error) {
      throw new Error(`Something went wrong while updating the task ${error}`);
    }
  }),
  updateTasks: thunk(async (_, {statusValue, tasks}) => {
    try {
      Promise.all(tasks.map(task => updateTask(task.id, { ...task, status: statusValue })));
    } catch(error) {
      throw new Error(`Something went wrong while updating the tasks ${error}`);
    }
  }),
  deleteTask: thunk(async (actions, payload) => {
    try {
      await deleteTask(payload);
      actions.fetchTasks();
    } catch(error) {
      throw new Error(`Something went wrong while updating the tasks ${error}`);
    }
  })
};

const store = createStore(tasksModel);

export default store;
