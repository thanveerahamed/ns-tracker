import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './pages/App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ErrorScreen from './pages/Error.tsx';
import Favourites from './pages/Favourites.tsx';
import Login from './pages/Login.tsx';
import Trip from './pages/Trip.tsx';
import Trips from './pages/Trips.tsx';
import SplitView from './pages/splitView/SplitView.tsx';
import SplitViewDashboard from './pages/splitView/SplitViewDashboard.tsx';
import SplitViewForm from './pages/splitView/SplitViewForm.tsx';
import SplitViewTripsInformation from './pages/splitView/SplitViewTripsInformation.tsx';

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
        path: '/trips',
        element: <Trips />,
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
        children: [
          {
            index: true,
            element: <SplitViewDashboard />,
          },
          {
            path: '/splitview/form',
            element: <SplitViewForm />,
          },
          {
            path: '/splitview/tripsInformation/:id',
            element: <SplitViewTripsInformation />,
          },
        ],
      },
    ],
  },
]);
