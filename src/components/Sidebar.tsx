import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Students', icon: 'group', path: '/add-student' },
    { name: 'Attendance', icon: 'fact_check', path: '/mark-attendance' },
    { name: 'Reports', icon: 'analytics', path: '/reports' },
    { name: 'Analytics', icon: 'insights', path: '/analytics' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-white flex flex-col p-6 gap-2 z-50">
      <div className="mb-10 px-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/dashboard')}>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Attendly</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => {
          const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${active ? 'bg-primary-container text-primary font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 space-y-3">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm text-error hover:bg-red-50 transition-all group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
          <span>Sign Out</span>
        </button>
        <Link to="/add-student" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Record</span>
        </Link>
      </div>
    </aside>
  );
}