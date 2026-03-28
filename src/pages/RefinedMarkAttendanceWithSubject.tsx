import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../lib/attendanceService';

export default function RefinedMarkAttendanceWithSubject() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});

  const DEPARTMENTS = [
    'All Departments',
    'Computer Science',
    'Mechanical Eng.',
    'Business Admin',
    'Fine Arts',
  ];

  const fetchStudents = async () => {
    const { data, error } = await attendanceService.getStudents();
    
    if (!error && data) {
      setStudents(data);
      // Initialize all as present by default
      const init: Record<number, boolean> = {};
      data.forEach(s => { init[s.id] = true; });
      setAttendance(init);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    if (selectedDept === 'All Departments') return students;
    return students.filter(s => s.department === selectedDept);
  }, [students, selectedDept]);

  const presentCount = filteredStudents.filter(s => attendance[s.id]).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendanceRate = filteredStudents.length > 0
    ? ((presentCount / filteredStudents.length) * 100).toFixed(1)
    : '0.0';

  const handleSave = async () => {
    const records = filteredStudents.map(s => ({
      student_id: s.id,
      date: selectedDate,
      status: (attendance[s.id] ? 'Present' : 'Absent') as 'Present' | 'Absent',
      subject: s.subject || 'General'
    }));

    const { error } = await attendanceService.saveAttendance(records);

    if (!error) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 2000);
    } else {
      alert(error.message);
    }
  };

  const markAllPresent = () => {
    setAttendance(prev => {
      const next = { ...prev };
      filteredStudents.forEach(s => { next[s.id] = true; });
      return next;
    });
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' — Session AM';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >

<div className="p-8 max-w-7xl mx-auto lg:px-12">

<div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-sm py-6 z-30 border-b border-slate-50">
<div>
<h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Mark Attendance</h2>
<p className="text-on-surface-variant font-label text-sm mt-1">{formatDateLabel(selectedDate)}</p>
</div>
<button onClick={handleSave} className="bg-primary hover:bg-primary-dim text-on-primary px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95">
<span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"\"FILL\" 1"}}>save</span>
                    Save Attendance
                </button>
</div>

<section className="bg-surface-container rounded-xl p-6 mb-8 flex flex-wrap gap-6 items-end">
<div className="flex flex-col gap-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Select Date</label>
<div className="relative group">
<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">calendar_today</span>
<input
  className="bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-3 text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary w-56"
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">Department</label>
<select
  className="bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary w-64 appearance-none"
  value={selectedDept}
  onChange={(e) => setSelectedDept(e.target.value)}
>
{DEPARTMENTS.map(d => (
  <option key={d} value={d}>{d}</option>
))}
</select>
</div>
</section>

<section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-8">
<div className="p-6 border-b border-surface-container flex items-center justify-between">
<h3 className="font-headline font-bold text-lg">Student Roll ({filteredStudents.length} Students)</h3>
<div className="flex gap-4">
<button onClick={markAllPresent} className="text-xs font-bold text-primary px-3 py-1.5 rounded-full bg-primary-container/30 hover:bg-primary-container transition-colors">Mark All Present</button>
<button onClick={() => alert('Exporting Attendance Sheet...')} className="text-xs font-bold text-outline px-3 py-1.5 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors">Export Sheet</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50">
<th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">Student Name</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">ID Number</th>
<th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">Subject</th>
<th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label text-right">Status Toggle</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
{filteredStudents.length === 0 && (
  <tr><td colSpan={4} className="px-8 py-12 text-center text-on-surface-variant font-medium">No students found for the selected department.</td></tr>
)}
{filteredStudents.map(student => {
  const isPresent = attendance[student.id];
  return (
    <tr key={student.id} className="group hover:bg-surface-container-low/30 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          {student.imgSrc ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" src={student.imgSrc} alt={student.name} />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-full ${student.avatar_bg} flex items-center justify-center ${student.avatar_text} font-bold text-sm`}>{student.initials}</div>
          )}
          <div>
            <p className="font-semibold text-on-surface">{student.name}</p>
            <p className="text-xs text-on-surface-variant">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 font-mono text-sm text-on-surface-variant">{student.roll_no}</td>
      <td className="px-6 py-5"><span className="text-sm font-medium text-on-surface-variant">{student.subject}</span></td>
      <td className="px-8 py-5 text-right">
        <button
          onClick={() => setAttendance(prev => ({...prev, [student.id]: !prev[student.id]}))}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-200 shadow-sm active:scale-95 ${
            isPresent
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings:'"FILL" 1'}}>{isPresent ? 'check_circle' : 'cancel'}</span>
          {isPresent ? 'PRESENT' : 'ABSENT'}
        </button>
      </td>
    </tr>
  );
})}
</tbody>
</table>
</div>
<div className="p-6 bg-surface-container-low/30 flex justify-between items-center">
<div className="text-sm font-label text-on-surface-variant">
                        Showing <span className="font-bold text-on-surface">1-{filteredStudents.length}</span> of <span className="font-bold text-on-surface">{filteredStudents.length}</span> students
                    </div>
<div className="flex gap-2">
<button className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">1</button>
</div>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12">
<div className="bg-primary-container p-6 rounded-2xl relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-primary-container font-label font-bold text-xs uppercase tracking-widest mb-1">Students Present</p>
<h4 className="text-4xl font-extrabold font-headline text-on-primary-container">{String(presentCount).padStart(2, '0')}</h4>
<div className="mt-4 flex items-center gap-2 text-on-primary-container/80 text-sm">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span>{attendanceRate}% attendance rate today</span>
</div>
</div>
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-on-primary-container/10 group-hover:scale-110 transition-transform duration-500">how_to_reg</span>
</div>
<div className="bg-error-container p-6 rounded-2xl relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-error-container font-label font-bold text-xs uppercase tracking-widest mb-1">Students Absent</p>
<h4 className="text-4xl font-extrabold font-headline text-on-error-container">{String(absentCount).padStart(2, '0')}</h4>
<div className="mt-4 flex items-center gap-2 text-on-error-container/80 text-sm">
<span className="material-symbols-outlined text-sm">error_outline</span>
<span>{absentCount} unexcused absences</span>
</div>
</div>
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-on-error-container/10 group-hover:scale-110 transition-transform duration-500">person_off</span>
</div>
<div className="bg-surface-container-highest p-6 rounded-2xl relative overflow-hidden group">
<div className="relative z-10">
<p className="text-on-surface-variant font-label font-bold text-xs uppercase tracking-widest mb-1">Department Average</p>
<h4 className="text-4xl font-extrabold font-headline text-on-surface">88%</h4>
<div className="mt-4 flex items-center gap-2 text-on-surface-variant text-sm">
<span className="material-symbols-outlined text-sm">info</span>
<span>October monthly average</span>
</div>
</div>
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-on-surface-variant/10 group-hover:scale-110 transition-transform duration-500">analytics</span>
</div>
</section>
</div>


<div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 z-50 transform transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm font-medium">Attendance has been synchronized.</span>
<button onClick={() => setShowToast(false)} className="text-primary-fixed-dim text-xs font-bold uppercase ml-4 relative z-10">Undo</button>
</div>
    </motion.div>
  );
}