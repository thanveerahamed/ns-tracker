import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { SearchFilterProvider } from './context/SearchFilterContext.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { TripsInformationProvider } from './context/TrpsInformationContext.tsx';
import { router } from './routes.tsx';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2b8257',
    },
    secondary: {
      main: '#F06418',
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: ['Ubuntu', 'sans-serif'].join(','),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <SearchFilterProvider>
              <TripsInformationProvider>
                <RouterProvider router={router} />
              </TripsInformationProvider>
            </SearchFilterProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
