import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { SearchFilterProvider } from './context/SearchFilterContext.tsx';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { TripsInformationProvider } from './context/TripsInformationContext.tsx';
import { router } from './routes.tsx';
import './utils/date.ts';
import '@fontsource-variable/geist';
import { Toaster } from 'sonner';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: false },
    mutations: { retry: false },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        richColors
        theme="dark"
        position="top-center"
        toastOptions={{ style: { fontFamily: 'Geist Variable, sans-serif' } }}
      />
      <SnackbarProvider>
        <SearchFilterProvider>
          <TripsInformationProvider>
            <RouterProvider router={router} />
          </TripsInformationProvider>
        </SearchFilterProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
