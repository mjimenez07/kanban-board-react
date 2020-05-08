import React, { useState } from 'react';
import { Typography, Grid, TextField, Button, Modal, Paper, makeStyles, InputLabel } from '@material-ui/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { firebase } from '../../config';
import { statusOptions, tagOptions } from '../../config/constants';

import DropDown from '../DropdDown';

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
  }
}));

function CreateTask({ isVisible, toggleVisible }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState('');

  const onCreateTask = () => {
    const db = firebase.firestore();
    db.collection("tasks").add({
      title: title,
      description: description,
      status: status ? status : 'to-do',
      tag: tag ? tag : 'article',
      assignee: "Foo User",
      dueDate: dueDate,
      createdDate: new Date()
    });
  }

  const classes = useStyles();
  return (
    <Modal open={isVisible} onClose={toggleVisible} className={classes.paper}>
    <Paper>
    <Grid container direction="column" className={classes.modalInnerGrid}>
    <Typography align="center" variant="h2">Create Task</Typography>
    <Grid item container>
      <Grid item xs={2} />
      <Grid item xs={8}>
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
            <Grid item xs={12}>
              <Typography variant="caption">Due Date</Typography><br/>
              <DatePicker
                className={classes.datePickerWrapper}
                dateFormat="yyyy/MM/dd"
                selected={dueDate}
                onChange={date => setDueDate(date)}
              />
          </Grid>
        </Grid>
        </form>
        <Button variant="contained" onClick={onCreateTask}>
          create
        </Button>
      </Grid>
      <Grid item xs={2}/>
    </Grid>
  </Grid>
    </Paper>
    </Modal>
  )
}

export default CreateTask;