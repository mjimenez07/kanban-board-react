import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  InputBase,
  makeStyles,
  fade,
  Typography
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { tagOptions } from '../../config/constants';

import DropDown from '../DropDown';

const useStyles = makeStyles((theme) => ({
  paperWrapper: {
    position: 'absolute',
    width: '250px',
    height: '150px',
    top: '50px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    margin: '10px',
    width: 'auto',
    display: 'flex',
    justifyContent: 'space-around'
  },
  searchIcon: {
    display: 'flex',
    height: '100%',
    pointerEvents: 'none',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  tagsDropDown: {
    margin: '10px'
  }
}));

function Filters({ handleTagChange, handleTitleChange }) {
  const classes = useStyles();
  return (
    <Paper m={1} elevation={10} className={classes.paperWrapper}>
      <Typography variant="h5" align="center">
        Filters
      </Typography>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Filter by task title"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => handleTitleChange(event.target.value)}
        />
      </div>
      <div className={classes.tagsDropDown}>
        <DropDown
          options={tagOptions}
          handleOnChange={handleTagChange}
          label={'Tags'}
        />
      </div>
    </Paper>
  );
}

Filters.propTypes = {
  handleTagChange: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired
};

export default Filters;
