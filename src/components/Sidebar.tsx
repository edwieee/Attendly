import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
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
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-white flex flex-col p-6 gap-2 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-10 px-2 lg:justify-start">
          <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => { navigate('/dashboard'); onClose?.(); }}>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Attendly</h1>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => {
            const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${active ? 'bg-primary-container text-primary font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4 space-y-3">
          <button 
            onClick={() => { handleLogout(); onClose?.(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm text-error hover:bg-red-50 transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
            <span>Sign Out</span>
          </button>
          <Link 
            to="/add-student" 
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>New Record</span>
          </Link>
        </div>
      </aside>
    </>
  );
}