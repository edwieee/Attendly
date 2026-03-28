import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className='bg-surface text-on-surface font-body min-h-screen'>
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-40 px-5 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">Attendly</h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className='lg:ml-64 p-5 sm:p-8 lg:p-10 min-h-screen relative pt-20 lg:pt-10'>
        <Outlet />
      </main>
    </div>
  );
}