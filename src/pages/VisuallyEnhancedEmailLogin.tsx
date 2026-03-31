import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VisuallyEnhancedEmailLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginRole, setLoginRole] = useState<'admin' | 'student' | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // DEMO CREDENTIALS
  const DEMO_CREDENTIALS = {
    admin: { email: 'admin@attendly.edu', pass: 'admin123' },
    student: { email: 'student@attendly.edu', pass: 'student123' }
  };

  const [creds, setCreds] = useState({ email: '', pass: '' });

  // Handle existing sessions and auto-redirect (Disabled for bypass)
  useEffect(() => {
    // Session check disabled to allow free navigation
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // DELAY for realistic feel
    setTimeout(() => {
      if (!loginRole) {
          setError("Please select a portal first");
          setLoading(false);
          return;
      }

      const valid = DEMO_CREDENTIALS[loginRole];
      
      if (creds.email === valid.email && creds.pass === valid.pass) {
          localStorage.setItem('demo_role', loginRole);
          navigate(loginRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      } else {
          setError(`Invalid credentials for ${loginRole} portal`);
          setLoading(false);
      }
    }, 800);
  };

  const fillDemo = () => {
    if (!loginRole) return;
    setCreds(DEMO_CREDENTIALS[loginRole]);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden font-body"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="w-full max-w-[500px] relative z-10">
        <div className="mb-12 text-center">
          {/* Badge Removed per Request */}
          <h1 className="text-5xl font-black tracking-[-0.05em] text-on-background font-headline mb-2">Attendly</h1>
          <p className="text-outline font-medium text-sm">Secure Institutional Portal Access</p>
        </div>

        <motion.div
          layout
          className="bg-surface-container-lowest rounded-[48px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!loginRole ? (
              <motion.div 
                key="role-select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-10"
              >
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-on-surface font-headline mb-3">Welcome Back</h2>
                    <p className="text-outline text-sm font-semibold">Select your portal to continue</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <button 
                        onClick={() => setLoginRole('admin')}
                        className="group relative flex items-center gap-6 p-6 bg-surface-container-low/50 hover:bg-white border border-transparent hover:border-primary/20 rounded-[32px] transition-all hover:shadow-xl hover:shadow-primary/5 text-left"
                    >
                        <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500">
                            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-on-surface text-lg group-hover:text-primary transition-colors">Admin Portal</h3>
                            <p className="text-outline group-hover:text-outline-variant transition-colors text-xs font-bold uppercase tracking-wider mt-0.5">Faculty & Management</p>
                        </div>
                        <span className="material-symbols-outlined text-primary/0 group-hover:text-primary/100 transform -translate-x-2 group-hover:translate-x-0 transition-all">arrow_forward</span>
                    </button>

                    <button 
                        onClick={() => setLoginRole('student')}
                        className="group relative flex items-center gap-6 p-6 bg-surface-container-low/50 hover:bg-white border border-transparent hover:border-primary/20 rounded-[32px] transition-all hover:shadow-xl hover:shadow-primary/5 text-left"
                    >
                        <div className="w-16 h-16 bg-slate-100 group-hover:bg-slate-900 text-slate-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500">
                            <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-on-surface text-lg group-hover:text-primary transition-colors">Student Portal</h3>
                            <p className="text-outline group-hover:text-outline-variant transition-colors text-xs font-bold uppercase tracking-wider mt-0.5">Enrollment & Analytics</p>
                        </div>
                        <span className="material-symbols-outlined text-primary/0 group-hover:text-primary/100 transform -translate-x-2 group-hover:translate-x-0 transition-all">arrow_forward</span>
                    </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-10"
              >
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <button 
                            onClick={() => { setLoginRole(null); setError(null); }}
                            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all mb-4"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Switch Portal
                        </button>
                        <h2 className="text-3xl font-black text-on-surface font-headline leading-tight">
                            {loginRole === 'admin' ? 'Admin Gateway' : 'Student Access'}
                        </h2>
                    </div>
                    <button 
                        onClick={fillDemo}
                        type="button"
                        className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors border border-primary/10"
                        title="Click to fill demo account"
                    >
                        Auto-Fill
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Institutional Email</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors">email</span>
                      <input 
                        required
                        value={creds.email}
                        onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300" 
                        placeholder="yourname@attendly.edu" 
                        type="email" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline px-1">Access Key</label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors">lock</span>
                      <input 
                        required
                        value={creds.pass}
                        onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
                        className="w-full pl-14 pr-16 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300" 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ACCESS REMOVED */}

                  {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-black text-center"
                    >
                        {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 hover:bg-primary text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 relative group overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                        </motion.div>
                      ) : (
                        <motion.span 
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-3"
                        >
                          Access Portal
                          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">login</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 text-center text-[10px] font-black text-outline uppercase tracking-[0.25em]">
            &copy; 2026 attendly intelligence systems &bull; v2.4.1
        </div>
      </main>
    </motion.div>
  );
}