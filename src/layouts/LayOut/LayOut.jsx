import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

function LayOut({ children, className }) {
  return (
    <Grid container direction="column" className={className}>
      <Grid item container>
        <Grid item xs={2}/>
        <Grid item xs={8} container>
          {children}
        </Grid>
        <Grid item xs={2}/>
        </Grid>
    </Grid>
  );
}


LayOut.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}
export default LayOut;
