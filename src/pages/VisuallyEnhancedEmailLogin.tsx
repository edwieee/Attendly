import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VisuallyEnhancedEmailLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isConfigMissing = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your-project');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfigMissing) {
      setError("Supabase setup required. Please add your credentials to the .env file.");
      return;
    }

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const { data, error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sbError) {
      setError(sbError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      navigate('/');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden"
    >
      {/* Stitch-Aligned Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="w-full max-w-[450px] relative z-10 transition-all">
        {/* Branding */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-slate-800 font-headline">Attendly</h1>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            {isConfigMissing && (
              <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-[24px] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600">contact_support</span>
                </div>
                <div>
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest leading-none mb-1.5">Setup Required</p>
                  <p className="text-xs font-semibold text-amber-900/60 leading-relaxed capitalize">Please add your VITE_SUPABASE_URL and KEY to the .env file in the root directory.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-wider text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline/60 group-focus-within:text-primary transition-colors text-xl">
                      alternate_email
                    </span>
                  </div>
                  <input
                    className="w-full pl-14 pr-5 py-4 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/40 font-bold text-sm"
                    id="email"
                    name="email"
                    placeholder="Enter email..."
                    required
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-[10px] font-black text-primary hover:text-primary-dim transition-colors uppercase tracking-widest" to="#">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline/60 group-focus-within:text-primary transition-colors text-xl">
                      lock
                    </span>
                  </div>
                  <input
                    className="w-full pl-14 pr-14 py-4 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/40 font-bold text-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                  <button className="absolute inset-y-0 right-0 pr-5 flex items-center text-outline/40 hover:text-on-surface transition-colors" type="button">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4.5 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dim hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-4"
                type="submit"
              >
                <span className="text-[15px] uppercase tracking-widest">{loading ? 'Verifying...' : 'Sign In'}</span>
                {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>}
              </button>
            </form>
          </div>

          <div className="bg-surface-container-low/50 py-8 text-center border-t border-outline-variant/10">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              Don't have an account?
              <Link className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center gap-10 text-[10px] text-outline/60 font-black uppercase tracking-[0.25em]">
          <Link className="hover:text-primary transition-colors" to="#">Privacy</Link>
          <Link className="hover:text-primary transition-colors" to="#">Terms</Link>
          <Link className="hover:text-primary transition-colors" to="#">Support</Link>
        </div>
      </main>
    </motion.div>
  );
}