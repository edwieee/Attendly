import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


export default function Layout() {
  return (
    <div className='bg-surface text-on-surface font-body min-h-screen'>
      <Sidebar />

      <main className='ml-64 p-10 min-h-screen relative'>
        <Outlet />
      </main>
    </div>
  );
}