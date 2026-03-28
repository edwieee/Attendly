import fs from 'fs';
import path from 'path';

const pDir = 'src/pages';
const files = fs.readdirSync(pDir);

files.forEach(f => {
  if (f === 'VisuallyEnhancedEmailLogin.tsx' || f === 'PolishedStudentSignup.tsx') return;
  
  let text = fs.readFileSync(path.join(pDir, f), 'utf8');
  
  // Remove aside and header
  text = text.replace(/<aside.*?<\/aside>/s, '');
  text = text.replace(/<header.*?<\/header>/s, '');
  
  // Unwrap main. It may have classNames.
  /* e.g. <main className="ml-64 mt-16 p-10 min-h-screen"> ... </main> */
  const mainMatch = text.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  if (mainMatch) {
    text = text.replace(/<main[^>]*>[\s\S]*<\/main>/i, mainMatch[1]);
  }
  
  // Replace a tags with Link
  text = text.replace(/<a([^>]*)href=["'][^"']*["']([^>]*)>/gi, '<Link$1to="#"$2>');
  text = text.replace(/<\/a>/gi, '</Link>');
  
  // Add Link import
  if(text.includes('<Link') && !text.includes('import { Link }')) {
    text = text.replace(/import \{ motion \} from 'framer-motion';/i, "import { motion } from 'framer-motion';\nimport { Link } from 'react-router-dom';");
  }
  
  fs.writeFileSync(path.join(pDir, f), text);
  console.log('Processed', f);
});

// For Login/Signup pages, we also want to remove <a> and use <Link>
['VisuallyEnhancedEmailLogin.tsx', 'PolishedStudentSignup.tsx'].forEach(f => {
  let text = fs.readFileSync(path.join(pDir, f), 'utf8');
  text = text.replace(/<a([^>]*)href=["'][^"']*["']([^>]*)>/gi, '<Link$1to="#"$2>');
  text = text.replace(/<\/a>/gi, '</Link>');
  if(text.includes('<Link') && !text.includes('import { Link }')) {
    text = text.replace(/import \{ motion \} from 'framer-motion';/i, "import { motion } from 'framer-motion';\nimport { Link } from 'react-router-dom';");
  }
  fs.writeFileSync(path.join(pDir, f), text);
  console.log('Processed', f);
});

// Also create Layout component
const layoutCode = `import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className='bg-surface text-on-surface font-body min-h-screen'>
      <Sidebar />
      <Header />
      <main className='ml-64 mt-16 p-10 min-h-screen relative'>
        <Outlet />
      </main>
    </div>
  );
}`;

fs.writeFileSync('src/components/Layout.tsx', layoutCode);
console.log('Created Layout.tsx');

// Fix Sidebar's <a> tags too
try {
  let sb = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
  sb = sb.replace(/<a([^>]*)href=["'][^"']*["']([^>]*)>/gi, '<Link$1to="#"$2>');
  sb = sb.replace(/<\/a>/gi, '</Link>');
  // Actually, we want them to link to real routes:
  // Dashboard -> /
  // Students -> /add-student
  // Attendance -> /mark-attendance
  // Reports -> /analytics
  sb = sb.replace(/<Link(.*?)>(.*?)<span.*?>Dashboard<\/span>(.*?)<\/Link>/gis, '<Link$1to="/dashboard">$2<span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "\\"FILL\\" 1"}}>dashboard</span><span>Dashboard</span>$3</Link>');
  // Re-write Sidebar to be proper Links
  const properSidebar = `import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Students', icon: 'group', path: '/add-student' },
    { name: 'Attendance', icon: 'fact_check', path: '/mark-attendance' },
    { name: 'Reports', icon: 'analytics', path: '/reports' },
    { name: 'Analytics', icon: 'insights', path: '/analytics' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-white flex flex-col p-6 gap-2 z-50">
      <div className="mb-10 px-2 cursor-pointer transition-transform hover:scale-105">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Precision</h1>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">Admin Console</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => {
          const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link key={item.name} to={item.path} className={\`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all \${active ? 'bg-primary-container text-primary font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}\`}>
              <span className="material-symbols-outlined text-[20px]" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-100">
        <Link to="/add-student" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Record</span>
        </Link>
      </div>
    </aside>
  );
}`
  fs.writeFileSync('src/components/Sidebar.tsx', properSidebar);
  console.log('Fixed Sidebar.tsx');
} catch (e) {
  console.log(e);
}
