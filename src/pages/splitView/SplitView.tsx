import * as React from 'react';
import { Outlet } from 'react-router-dom';

export default function SplitView() {
  return (
    <>
      <Outlet />
    </>
  );
}
