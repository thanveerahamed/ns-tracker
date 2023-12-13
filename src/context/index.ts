import { useContext } from 'react';

import {
  SearchFilterContext,
  SearchFilterContextValue,
} from './SearchFilterContext.tsx';
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

export const useSearchFilterContext = (): SearchFilterContextValue => {
  const context = useContext(SearchFilterContext);

  if (context === null) {
    throw new Error(
      'useSearchFilterContext must be used within a SearchFilterProvider',
    );
  }

  return context;
};
