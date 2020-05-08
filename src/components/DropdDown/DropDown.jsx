import React from 'react';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  dropdown: {
    color: 'black',
    marginTop: '10px',
    marginBottom: '20px',
  }
})
function DropDown({ options, handleOnChange, label }) {
  const classes = useStyles();
  return <Select className={classes.dropdown} placeholder={label} options={options} onChange={({ value }) => handleOnChange(value)}/>
};

export default DropDown;