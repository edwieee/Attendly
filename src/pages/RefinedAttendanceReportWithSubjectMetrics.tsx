import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { attendanceService } from '../lib/attendanceService';

interface Student {
  id: number;
  initials: string;
  name: string;
  email: string;
  idNumber: string;
  department: string;
  avatarBg: string;
  avatarText: string;
  presentDays: number;
  absentDays: number;
}

export default function RefinedAttendanceReportWithSubjectMetrics() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReportData = async () => {
    const { data: studentsData } = await attendanceService.getStudents();
    if (studentsData) {
      const { data: attendanceData } = await attendanceService.getAllAttendanceWithStudents();
      
      const mappedStudents = studentsData.map((s: any) => {
        const studentAttendance = (attendanceData || []).filter((a: any) => a.student_id === s.id);
        const present = studentAttendance.filter((a: any) => a.status === 'Present').length;
        const absent = studentAttendance.filter((a: any) => a.status === 'Absent').length;
        
        return {
          id: s.id,
          initials: s.initials || '??',
          name: s.name,
          email: s.email || '',
          idNumber: s.roll_no,
          department: s.department || 'General',
          avatarBg: s.avatar_bg || 'bg-slate-100',
          avatarText: s.avatar_text || 'text-slate-500',
          presentDays: present,
          absentDays: absent
        };
      });
      setStudents(mappedStudents);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const downloadPDF = async () => {
    if (!reportRef.current || !selectedStudent) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Attendance_Report_${selectedStudent.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-8 lg:p-12 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedStudent ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-2">Attendance Reports</h2>
                  <p className="text-slate-500 font-bold text-sm">Select a student to view detailed analytics and download reports.</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    FILTERS
                  </div>
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="material-symbols-outlined text-sm">sort</span>
                    SORT
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-100/40 overflow-hidden divide-y divide-slate-50">
                <div className="grid grid-cols-12 px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  <div className="col-span-4">Student Details</div>
                  <div className="col-span-2 text-center">Total Days</div>
                  <div className="col-span-2 text-center">Present</div>
                  <div className="col-span-2 text-center">Absent</div>
                  <div className="col-span-2 text-right">Attendance %</div>
                </div>
                {students.map((student) => {
                  const total = student.presentDays + student.absentDays;
                  const rate = total > 0 ? ((student.presentDays / total) * 100).toFixed(1) : '0.0';
                  return (
                    <div 
                      key={student.id} 
                      onClick={() => setSelectedStudent(student)}
                      className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/80 transition-all group cursor-pointer"
                    >
                      <div className="col-span-4 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-[14px] ${student.avatarBg} ${student.avatarText} flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform`}>
                          {student.initials}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1 group-hover:text-primary transition-colors">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{student.idNumber}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-black text-slate-900 text-sm">{total}</div>
                      <div className="col-span-2 text-center font-black text-emerald-600 text-sm">{student.presentDays}</div>
                      <div className="col-span-2 text-center font-black text-error text-sm">{student.absentDays}</div>
                      <div className="col-span-2 text-right">
                        <span className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase border ${parseFloat(rate) > 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {rate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-xl transition-all group"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to reports
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={downloadPDF}
                    disabled={isGeneratingPDF}
                    className={`px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200 active:scale-95 group ${isGeneratingPDF ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isGeneratingPDF ? 'hourglass_top' : 'download'}
                    </span>
                    <span className="uppercase tracking-[0.1em]">{isGeneratingPDF ? 'Generating...' : 'Download Report (PDF)'}</span>
                  </button>
                </div>
              </div>

              {/* Detail Report Container for PDF Capture */}
              <div ref={reportRef} className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden p-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Attendance Analytics</h2>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${selectedStudent.avatarBg} ${selectedStudent.avatarText} flex items-center justify-center font-black text-xs`}>
                        {selectedStudent.initials}
                      </div>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">
                        Detailed summary for {selectedStudent.name} • {selectedStudent.idNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                    <p className="text-sm font-bold text-slate-900">Oct 24th, 2023</p>
                  </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-emerald-50/50 rounded-[32px] border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-50 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings:"\"FILL\" 1"}}>check_circle</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-white/50 px-2.5 py-1 rounded-full border border-emerald-100">Current Term</span>
                    </div>
                    <div>
                      <h4 className="text-5xl font-black text-emerald-700 leading-none tracking-tight mb-1">{selectedStudent.presentDays}</h4>
                      <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest">Total Days Present</p>
                    </div>
                  </div>

                  <div className="p-8 bg-error-50/50 rounded-[32px] border border-error-100 flex flex-col justify-between group hover:bg-error-50 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-error-100 flex items-center justify-center text-error shadow-inner">
                        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings:"\"FILL\" 1"}}>cancel</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-5xl font-black text-error leading-none tracking-tight mb-1">{selectedStudent.absentDays < 10 ? `0${selectedStudent.absentDays}` : selectedStudent.absentDays}</h4>
                      <p className="text-xs font-bold text-error/70 uppercase tracking-widest">Total Days Absent</p>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-900 rounded-[32px] text-white flex flex-col justify-between shadow-2xl shadow-slate-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <span className="material-symbols-outlined text-2xl">percent</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary">+2.4%</p>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">vs Last term</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-5xl font-black leading-none tracking-tight mb-1">
                        {((selectedStudent.presentDays / (selectedStudent.presentDays + selectedStudent.absentDays)) * 100).toFixed(1)}%
                      </h4>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Overall Attendance</p>
                    </div>
                  </div>
                </div>

                {/* Trend Chart (CSS Based) */}
                <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Trend</h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 text-[10px] font-black rounded-full bg-white shadow-md text-primary uppercase tracking-widest border border-primary/5 transition-all">6 Months</button>
                      <button className="px-4 py-1.5 text-[10px] font-black rounded-full text-slate-400 uppercase tracking-widest hover:bg-white transition-all">Yearly</button>
                    </div>
                  </div>
                  
                  <div className="relative h-64 w-full">
                    <div className="absolute inset-x-0 h-full flex flex-col justify-between py-1 opacity-10">
                      {[1,2,3,4].map(i => <div key={i} className="border-t-[1.5px] border-slate-900 w-full dashed"></div>)}
                    </div>
                    
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#005ac2"></stop>
                          <stop offset="100%" stopColor="#005ac2" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d="M 0,160 Q 50,140 100,140 T 200,160 T 300,100 T 400,120 T 500,170 T 600,60 L 600,200 L 0,200 Z" fill="url(#chartGradient)" opacity="0.1"></path>
                      <path d="M 0,160 Q 50,140 100,140 T 200,160 T 300,100 T 400,120 T 500,170 T 600,60" fill="none" stroke="#005ac2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                      {[0, 100, 200, 300, 400, 500, 600].map((cx, i) => (
                        <circle key={i} cx={cx} cy={[160, 140, 160, 100, 120, 170, 60][i]} fill="#005ac2" r="5" stroke="#ffffff" strokeWidth="2"></circle>
                      ))}
                    </svg>

                    <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
                       {['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'].map(m => (
                         <span key={m} className="text-[10px] font-black text-slate-400 tracking-widest">{m}</span>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Subject-wise Grid */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    Subject Distribution
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Mathematics', rate: '92%', bars: [70, 85, 60, 90, 75, 80] },
                      { name: 'Computer Sci', rate: '88%', bars: [90, 80, 95, 70, 85, 88] },
                      { name: 'Software Eng', rate: '96%', bars: [100, 95, 90, 95, 100, 96] },
                      { name: 'Data Struct', rate: '85%', bars: [80, 70, 85, 90, 80, 85] }
                    ].map((subj, sidx) => (
                      <div key={sidx} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">{subj.name}</p>
                          <span className="text-xs font-black text-primary">{subj.rate}</span>
                        </div>
                        <div className="h-10 w-full flex items-end gap-1.5 px-0.5">
                          {subj.bars.map((h, bidx) => (
                            <div key={bidx} className={`flex-1 ${bidx === 5 ? 'bg-primary' : 'bg-primary/10'} rounded-t-md transition-all group-hover:bg-primary/30`} style={{height: `${h}%`}}></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}