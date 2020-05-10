import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@material-ui/core';

function CreateTaskLayOut({ children, className }) {
  return (
    <Paper>
      <Grid container direction="column" className={className}>
        <Typography align="center" variant="h2">Create Task</Typography>
        <Grid item container>
          <Grid item xs={2} />
          <Grid item xs={8}>{children}</Grid>
          <Grid item xs={2}/>
        </Grid>
      </Grid>
    </Paper>
  );
}


CreateTaskLayOut.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default CreateTaskLayOut;
