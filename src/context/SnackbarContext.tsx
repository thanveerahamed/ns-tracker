import { ReactNode, createContext } from 'react';

import { toast } from 'sonner';

export type AlertColor = 'error' | 'info' | 'success' | 'warning';

export interface SnackbarContextValue {
  showNotification: (message: string, severity: AlertColor) => void;
}
export interface SnackbarProps {
  children: ReactNode;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const SnackbarProvider = ({ children }: SnackbarProps) => {
  const showNotification = (message: string, severity: AlertColor) => {
    toast[severity](message);
  };

  return (
    <SnackbarContext.Provider value={{ showNotification }}>
      {children}
    </SnackbarContext.Provider>
  );
};
