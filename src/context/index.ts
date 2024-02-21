import { useContext } from 'react';

import {
  ForwardTripsInformationContext,
  ForwardTripsInformationContextValue,
} from './ForwardTripsInformationContext.tsx';
import {
  SearchFilterContext,
  SearchFilterContextValue,
} from './SearchFilterContext.tsx';
import { SnackbarContext, SnackbarContextValue } from './SnackbarContext.tsx';
import {
  TripsInformationContext,
  TripsInformationContextValue,
} from './TripsInformationContext.tsx';

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

export const useTripsInformationContext = (): TripsInformationContextValue => {
  const context = useContext(TripsInformationContext);

  if (context === null) {
    throw new Error(
      'useTripsInformationContext must be used within a TripsInformationProvider',
    );
  }

  return context;
};

export const useForwardTripsInformationContext =
  (): ForwardTripsInformationContextValue => {
    const context = useContext(ForwardTripsInformationContext);

    if (context === null) {
      throw new Error(
        'useForwardTripsInformationContext must be used within a ForwardTripsInformationProvider',
      );
    }

    return context;
  };
