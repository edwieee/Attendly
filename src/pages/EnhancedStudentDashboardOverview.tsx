import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../lib/attendanceService';

export default function EnhancedStudentDashboardOverview({ isStudentView = false }: { isStudentView?: boolean }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    myAttendanceCount: 0,
    recentActivity: [] as any[]
  });

  const fetchDashboardData = async () => {
    try {
      const { studentCount, attendanceData, recentActivity } = await attendanceService.getDashboardStats();

      // Calculate attendance rate for today
      let rate = 0;
      if (attendanceData && attendanceData.length > 0) {
        const present = attendanceData.filter((a: any) => a.status === 'Present').length;
        rate = (present / attendanceData.length) * 100;
      }

      setStats({
        totalStudents: studentCount || 0,
        attendanceRate: rate,
        myAttendanceCount: attendanceData ? attendanceData.filter((a: any) => a.status === 'Present').length : 0,
        recentActivity: recentActivity || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <div className="max-w-full mx-auto space-y-8 px-4 lg:px-6">
        {/* Compressed Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 gap-4 sm:gap-0">
          <div className="flex items-center gap-5">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-slate-900 leading-none mb-1.5 font-headline">
                {isStudentView ? 'Student Portal Overview' : 'Administrative Overview'}
              </h2>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                {formatDate()}
              </p>
            </div>
          </div>
        </div>

        {/* Proportional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Attendance Rate Card */}
          <div className="md:col-span-7 group relative bg-primary p-8 rounded-[32px] text-white shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start relative z-10">
              <div className="w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                <span className="material-symbols-outlined text-3xl text-white">how_to_reg</span>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Attendance Rate Today</p>
              <h3 className="text-6xl font-black leading-none tracking-[-0.05em] mb-6">{stats.attendanceRate.toFixed(1)}%</h3>
              <div className="overflow-hidden h-3 flex rounded-full bg-white/10 border border-white/10 p-[1.5px] shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.attendanceRate}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>

          {/* Student Count Card */}
          <div className="md:col-span-5 group relative bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-100/50 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start relative z-10">
              <div className="w-14 h-14 flex items-center justify-center bg-primary-container text-primary rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80 mb-1">Total Active Students</p>
              <h3 className="text-5xl font-black text-slate-900 leading-none tracking-[-0.04em] group-hover:text-primary transition-colors duration-500 mb-2">{stats.totalStudents.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
                <span className="material-symbols-outlined text-sm">history_edu</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Real-time Activity Stream</h3>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden divide-y divide-slate-50">
              {stats.recentActivity.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">No recent data available</div>
              )}
              {stats.recentActivity.map((item, idx) => {
                const s = item.student as any;
                if (!s) return null;
                const initials = s.name.split(' ').map((n: string) => n[0]).join('');
                const color = item.status === 'Present' ? 'emerald' : 'error';
                return (
                  <div key={idx} className="px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/80 transition-all group cursor-default gap-4 sm:gap-0">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-100 group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base group-hover:text-primary transition-colors leading-none mb-1">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:pl-0 pl-16">
                      <div className="text-left sm:text-right">
                        <p className={`text-sm sm:text-base font-black text-slate-900 ${color === 'error' ? 'text-error' : ''}`}>{item.status}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase leading-none">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`w-24 sm:w-28 px-4 py-2 ${item.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'} text-[9px] font-black border rounded-xl uppercase tracking-[0.15em] text-center shadow-sm`}>
                        Logged
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}