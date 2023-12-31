import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './pages/App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ErrorScreen from './pages/Error.tsx';
import Favourites from './pages/Favourites.tsx';
import Login from './pages/Login.tsx';
import SplitView from './pages/SplitView.tsx';
import Trip from './pages/Trip.tsx';
import TripsInformation from './pages/TripsInformation.tsx';

export const router = createBrowserRouter([
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
        path: '/trip',
        element: <Trip />,
      },
      {
        path: '/favourites',
        element: <Favourites />,
      },
      {
        path: '/splitview',
        element: <SplitView />,
      },
    ],
  },
]);
