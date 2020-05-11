import React from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  dropdown: {
    color: 'black',
    marginTop: '10px',
    marginBottom: '20px',
  }
});

function DropDown({ options, handleOnChange, label }) {
  const classes = useStyles();
  return <Select className={classes.dropdown} placeholder={label} options={options} onChange={({ value }) => handleOnChange(value)}/>
};

DropDown.propTypes = {
  options: PropTypes.array,
  handleOnChange: PropTypes.func,
  label: PropTypes.string
}

export default DropDown;