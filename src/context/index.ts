import { useContext } from 'react';

import { SnackbarContext, SnackbarContextValue } from './SnackbarContext.tsx';

export const useSnackbarContext = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);

  if (context === null) {
    throw new Error(
      'useSnackbarContext must be used within a SnackbarProvider',
    );
  }

  return context;
};
