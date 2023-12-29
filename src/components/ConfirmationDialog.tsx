import * as React from 'react';

import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ariaName: string;
  title: string;
  text: string;
}

export default function ConfirmationDialog({
  onConfirm,
  ariaName,
  open,
  onClose,
  title,
  text,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={`${ariaName}-dialog-title`}
      aria-describedby={`${ariaName}-dialog-description`}
    >
      <DialogTitle id={`${ariaName}-dialog-title`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`${ariaName}-dialog-description`}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Disagree
        </Button>
        <Button onClick={onConfirm} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
