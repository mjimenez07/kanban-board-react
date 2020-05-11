import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from '@material-ui/core';

 function ConfirmationModal({isVisible, handleConfirm, handleCancel}) {
  const [open, setOpen] = React.useState(isVisible);

  const handleClose = () => {
    setOpen(false);
    handleCancel();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ cursor: 'move' }}>
          Deleting Task
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are You sure about this? there's no way back.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="secondary">
            DO IT!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConfirmationModal.propTypes = {
  isVisible: PropTypes.bool,
  handleConfirm: PropTypes.func,
  handleCancel: PropTypes.func
}

export default ConfirmationModal;
