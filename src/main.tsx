import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { SearchFilterProvider } from './context/SearchFilterContext.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import App from './pages/App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ErrorScreen from './pages/Error.tsx';
import Favourites from './pages/Favourites.tsx';
import Login from './pages/Login.tsx';
import TripsInformation from './pages/TripsInformation.tsx';
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

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/tripsInformation',
        element: <TripsInformation />,
      },
      {
        path: '/favourites',
        element: <Favourites />,
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5,
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
              <RouterProvider router={router} />
            </SearchFilterProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
