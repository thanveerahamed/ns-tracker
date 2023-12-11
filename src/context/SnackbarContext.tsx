import { ReactNode, createContext, useState } from 'react';

import { AlertColor, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

export interface SnackbarContextValue {
  showNotification: (message: string, severity: AlertColor) => void;
}
export interface SnackbarProps {
  children: ReactNode;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const SnackbarProvider = ({ children }: SnackbarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [message, setMessage] = useState<string>('');

  const openSnackbar = (message: string, severity: AlertColor) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage('');
    setSeverity(undefined);
  };

  return (
    <SnackbarContext.Provider value={{ showNotification: openSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
