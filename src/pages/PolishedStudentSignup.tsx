import React from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function PolishedStudentSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const fullName = (document.getElementById('full_name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const { data, error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (sbError) {
      setError(sbError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      if (data.session) {
        navigate('/');
      } else {
        alert('Account created! Please check your email for a confirmation link before signing in.');
        navigate('/login');
      }
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
        <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <main className="w-full max-w-[500px] relative z-10 transition-all">
        {/* Branding */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-[-0.05em] text-primary uppercase">Attendly</h1>
        </div>

        {/* Signup Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Create Your Account</h2>
              <p className="text-on-surface-variant text-sm font-medium">Join the digital attendance ecosystem today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-wider">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="full_name">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors text-lg" style={{ fontVariationSettings: '"wght" 600' }}>
                      person
                    </span>
                    <input 
                      className="w-full pl-14 pr-5 py-3.5 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/35 font-bold text-sm" 
                      id="full_name" 
                      placeholder="Jane Doe" 
                      required 
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="student_id">
                    ID Number
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors text-lg" style={{ fontVariationSettings: '"wght" 600' }}>
                      numbers
                    </span>
                    <input 
                      className="w-full pl-14 pr-5 py-3.5 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/35 font-bold text-sm" 
                      id="student_id" 
                      placeholder="ID-0000" 
                      required 
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors text-lg" style={{ fontVariationSettings: '"wght" 600' }}>
                    alternate_email
                  </span>
                  <input 
                    className="w-full pl-14 pr-5 py-3.5 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/35 font-bold text-sm" 
                    id="email" 
                    name="email" 
                    placeholder="Enter email address" 
                    required 
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors text-lg" style={{ fontVariationSettings: '"wght" 600' }}>
                    lock
                  </span>
                  <input 
                    className="w-full pl-14 pr-5 py-3.5 bg-surface-container-low border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-on-surface placeholder:text-outline/35 font-bold text-sm" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-4.5 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dim hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-4 overflow-hidden relative" 
                type="submit"
              >
                <span className="text-[15px] uppercase tracking-widest relative z-10">{loading ? 'Creating Profile...' : 'Start Your Journey'}</span>
                {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform relative z-10">
                  rocket_launch
                </span>}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </form>
          </div>

          <div className="bg-surface-container-low/50 py-8 text-center border-t border-outline-variant/10">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
              Already a user? 
              <Link className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center gap-10 text-[10px] text-outline/60 font-black uppercase tracking-[0.25em]">
          <Link className="hover:text-primary transition-colors" to="#">Policy</Link>
          <Link className="hover:text-primary transition-colors" to="#">Terms</Link>
          <Link className="hover:text-primary transition-colors" to="#">Contact</Link>
        </div>
      </main>
    </motion.div>
  );
}