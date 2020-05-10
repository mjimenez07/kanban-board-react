import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, Typography, Avatar, makeStyles } from "@material-ui/core";

import { tagOptions, statusOptions } from '../../config/constants';
import { getUserInitials } from '../../helpers/index';

const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};
const primaryButton = 0;

const useStyles = makeStyles({
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: '10px',
    marginBottom: '5px',
    width: '35px',
    height: '35px',
  },
  title: {
    paddingBottom: '0'
  }
});

function Task({
  index,
  task,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  isSelected,
}) {

  function performAction(event) {

    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(task.id);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(task.id);
      return;
    }

    toggleSelection(task.id);
  };

  function handleOnKeyDown (event, snapshot) {
    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== keyCodes.enter) {
      return;
    }

    // we are using the event for selection
    event.preventDefault();

    performAction(event);
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  function handleOnClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    performAction(event);
  };


  function handleOnTouchEnd(event) {
    if (event.defaultPrevented) {
      return;
    }

    // marking the event as used
    // we would also need to add some extra logic to prevent the click
    // if this element was an anchor
    event.preventDefault();
    toggleSelectionInGroup(task.id);
  };

  // Determines if the platform specific toggle selection in group key was used
  function wasToggleInSelectionGroupKeyUsed(event) {
    const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  // Determines if the multiSelect key was used
  const wasMultiSelectKeyUsed = (event) => event.shiftKey;

  const classes = useStyles();
  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
    >
    {(provided, snapshot) => {
      return (
        <div
        onClick={handleOnClick}
        onTouchEnd={handleOnTouchEnd}
        onKeyDown={(event) => handleOnKeyDown(event, snapshot)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: "none",
            margin: "0 0 8px 0",
            minHeight: "50px",
            border: (snapshot.isDragging ||isSelected)
              ? "3px solid #FF6347"
              : "none",
            color: "white",
            ...provided.draggableProps.style
          }}
        >
        <Card>
          <CardHeader title={task.title} className={classes.title} />
          <CardContent>
          <Typography className={classes.avatarWrapper} variant="body2" color="textSecondary" component="span">
            <Avatar className={classes.avatar}>
              {getUserInitials(task.assignee)}
            </Avatar>
            {task.assignee}
          </Typography>
          <Typography variant="body2">
            Status: {statusOptions.find(option => option.value === task.status).label}
          </Typography>
          <Typography variant="body2">
            Tag: {tagOptions.find(option => option.value === task.tag).label}
          </Typography>
          </CardContent>
        </Card>
        </div>
      );
    }}
  </Draggable>
  );
}

export default Task;
