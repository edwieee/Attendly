import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function ModernizedClassAnalyticsVariation3() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);

  const fetchData = async () => {
    const { data: stData } = await supabase.from('students').select('*');
    const { data: attData } = await supabase.from('attendance').select('*');
    if (stData) setStudents(stData);
    if (attData) setAttendance(attData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (students.length === 0) return { avgRate: '0%', activeDepts: 0, enrollment: 0, deptStats: [], studentStats: [] };

    const totalStudents = students.length;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const avgRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;
    
    const depts = Array.from(new Set(students.map(s => s.department)));
    
    const deptStats = depts.map(dept => {
      const deptStudents = students.filter(s => s.department === dept);
      const studentIds = deptStudents.map(s => s.id);
      const deptAttendance = attendance.filter(a => studentIds.includes(a.student_id));
      const deptPresent = deptAttendance.filter(a => a.status === 'Present').length;
      const rate = deptAttendance.length > 0 ? (deptPresent / deptAttendance.length) * 100 : 0;
      
      return {
        name: dept,
        rate: rate.toFixed(1) + '%',
        color: '#005ac2',
        icon: 'terminal'
      };
    });

    const studentStats = students.map(s => {
      const sAtt = attendance.filter(a => a.student_id === s.id);
      const sPresent = sAtt.filter(a => a.status === 'Present').length;
      const rate = sAtt.length > 0 ? (sPresent / sAtt.length) * 100 : 0;
      return {
        ...s,
        initials: s.name.split(' ').map((n: string) => n[0]).join(''),
        rate: rate.toFixed(1) + '%',
        color: rate >= 90 ? 'primary' : rate >= 75 ? 'tertiary' : 'error'
      };
    });

    return {
      avgRate: avgRate.toFixed(1) + '%',
      activeDepts: depts.length,
      enrollment: totalStudents,
      deptStats,
      studentStats
    };
  }, [students, attendance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full pb-10"
    >
      <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
        {/* Modern Header Section */}
        <div className="px-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight font-headline">Reports & Analytics</h2>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">Institutional attendance insights and departmental performance monitoring.</p>
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Avg Attendance Rate', value: stats.avgRate, icon: 'trending_up', trend: '+0.0%', color: 'primary' },
            { label: 'Active Departments', value: String(stats.activeDepts), icon: 'account_tree', trend: 'Direct', color: 'tertiary' },
            { id: 'enrollment', label: 'Total Enrollment', value: String(stats.enrollment), icon: 'groups', trend: 'Live', color: 'secondary' }
          ].map((metric, i) => (
            <div key={i} className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-100/30 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-[180px] overflow-hidden relative">
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-12 h-12 flex items-center justify-center bg-${metric.color}-container text-${metric.color} rounded-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
                </div>
                <div className={`px-3 py-1 bg-${metric.color}/10 text-${metric.color} text-[10px] font-black rounded-full uppercase tracking-widest border border-${metric.color}/5`}>
                  {metric.trend}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{metric.label}</p>
                <h3 className="text-4xl font-black text-slate-900 leading-none tracking-tight">{metric.value}</h3>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:scale-110 transition-transform pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">{metric.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Overall Attendance Trends - Line Chart style */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100/50 flex flex-col h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Trends</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">Institutional performance timeline</p>
              </div>
            </div>
            
            <div className="flex-1 relative mt-4">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#005ac2" stopOpacity="0.15"></stop>
                    <stop offset="100%" stopColor="#005ac2" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {[0, 60, 120, 180, 240].map((y, i) => (
                  <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                <path 
                  d="M 0,200 Q 100,180 200,190 T 400,120 T 600,150 L 600,240 L 0,240 Z" 
                  fill="url(#chartGradient)" 
                />
                <path 
                  d="M 0,200 Q 100,180 200,190 T 400,120 T 600,150" 
                  fill="none" 
                  stroke="#005ac2" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>

          {/* Attendance by Department - Card Based Modules */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100/50 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Department Statistics</h4>
                <p className="text-xs font-medium text-slate-400 mt-1">Performance by unit</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 scrollbar-hide">
              {stats.deptStats.map((dept: any, i: number) => (
                <div key={i} className="group p-5 bg-slate-50/50 border border-slate-100 rounded-[24px] hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">{dept.icon}</span>
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-sm">{dept.name}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time stats</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 leading-none">{dept.rate}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Avg Rate</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: dept.rate }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Restore Top Performing Students Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Top Performing Students</h4>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">High Integrity Group</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.studentStats
              .sort((a: any, b: any) => parseFloat(b.rate) - parseFloat(a.rate))
              .slice(0, 4)
              .map((student: any, i: number) => (
                <div key={i} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                      {student.initials}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 text-sm leading-none mb-1">{student.name}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.department}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-end justify-between relative z-10">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance Rate</p>
                      <h6 className="text-2xl font-black text-primary leading-none">{student.rate}</h6>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                    </div>
                  </div>
                  <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.05] transition-all">
                    <span className="material-symbols-outlined text-6xl">military_tech</span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Detailed Records Section */}
        <section className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Detailed Records</h4>
              <p className="text-xs font-medium text-slate-400 mt-1">Snapshot of individualized student performance data</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="px-10 py-6">Student Information</th>
                  <th className="px-10 py-6">Roll No.</th>
                  <th className="px-10 py-6">Department</th>
                  <th className="px-10 py-6">Attendance Integrity</th>
                  <th className="px-10 py-6 text-right">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50">
                {stats.studentStats?.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-sm group-hover:scale-105 transition-transform`}>{row.initials}</div>
                        <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs text-slate-500 font-bold">{row.roll_no}</td>
                    <td className="px-10 py-6 font-black">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">{row.department}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div className={`bg-primary h-full rounded-full`} style={{ width: row.rate }}></div>
                        </div>
                        <span className={`text-[11px] font-black text-primary`}>{row.rate}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="w-10 h-10 inline-flex items-center justify-center text-slate-300 hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                        <span className="material-symbols-outlined text-[20px]">insights</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="py-8 bg-slate-50/50 text-center border-t border-slate-100">
            <button className="text-[10px] font-black text-primary hover:text-primary-dim transition-colors uppercase tracking-[0.3em] hover:scale-105 transition-transform active:scale-95">Analyze Full Dataset</button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}