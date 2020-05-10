import React, { useState } from 'react';
import { Typography, Grid, TextField, Button, Modal, makeStyles } from '@material-ui/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createTask } from '../../services/firebaseService';
import { statusOptions, tagOptions, usersList } from '../../config/constants';

import CreateTaskLayOut from '../../layouts/CreateTaskLayOut';
import DropDown from '../DropDown';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '95%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalInnerGrid: {
    height: '100%',
    padding: '30px'
  },
  datePickerWrapper: {
    minHeight: '38px',
    minWidth: '250px',
    border: '1px solid hsl(0,0%,100%)',
    borderRadius: 4,
    marginBottom: '20px',
  },
  closeButton: {
    marginLeft: '15px'
  }
}));

function CreateTask({ isVisible, toggleVisible }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('');

  async function onCreateTask() {
    const data = await createTask({
      title: title,
      description: description,
      status: status ? status : 'to-do',
      tag: tag ? tag : 'article',
      assignee: user ? user : 'not assigned',
      dueDate: dueDate,
      createdDate: new Date()
    });
    console.log(data);
  }

  const classes = useStyles();
  return (
    <Modal open={isVisible} onClose={toggleVisible} className={classes.paper}>
      <CreateTaskLayOut className={classes.modalInnerGrid}>
      <form>
      <TextField required id="title" label="Title" fullWidth onChange={(event) => setTitle(event.target.value)} value={title}/>
      <TextField required id="description" label="Description" fullWidth onChange={(event) => setDescription(event.target.value)} />
      <Grid item container m={2}>
        <Grid item md={5}>
          <DropDown options={statusOptions} handleOnChange={setStatus} label={'Status'}/>
        </Grid>
        <Grid item md={2} />
        <Grid item md={5}>
          <DropDown options={tagOptions} handleOnChange={setTag} label={'Tags'}/>
        </Grid>
        <Grid item md={5}>
          <Typography>Due Date</Typography>
          <DatePicker
            className={classes.datePickerWrapper}
            dateFormat="yyyy/MM/dd"
            selected={dueDate}
            onChange={date => setDueDate(date)}
          />
      </Grid>
      <Grid item md={2} />
      <Grid item md={5}>
        <DropDown options={usersList} handleOnChange={setUser} label={'Assignee'}/>
      </Grid>
    </Grid>
    </form>
    <Button variant="contained" onClick={onCreateTask} disabled={(title.length === 0 || description.length === 0)}>
      create
    </Button>
    <Button variant="contained" onClick={toggleVisible} color="secondary" className={classes.closeButton}>
      close
    </Button>

      </CreateTaskLayOut>
    </Modal>
  )
}

export default CreateTask;
