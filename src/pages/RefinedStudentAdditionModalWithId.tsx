import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../lib/attendanceService';

export default function RefinedStudentAdditionModalWithId() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNo: '',
    department: 'Computer Science',
    subject: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const DEPARTMENTS = ['All', 'Computer Science', 'Mechanical Eng.', 'Business Admin', 'Fine Arts'];
  const STATUSES = ['All', 'Active', 'Inactive'];

  const fetchStudents = async () => {
    const { data, error } = await attendanceService.getStudents();
    if (!error && data) {
      setStudents(data);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const deptMatch = deptFilter === 'All' || s.department === deptFilter;
      const statusMatch = statusFilter === 'All' || s.status === statusFilter;
      return deptMatch && statusMatch;
    });
  }, [students, deptFilter, statusFilter]);

  const handleRegister = async () => {
    if (!formData.firstName || !formData.rollNo) {
      alert('First Name and Student ID are required.');
      return;
    }

    setIsLoading(true);
    
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const initials = (formData.firstName?.[0] || '') + (formData.lastName?.[0] || '');
    
    try {
      const { error } = await attendanceService.addStudent({
        name,
        email: formData.email,
        roll_no: formData.rollNo,
        department: formData.department,
        subject: formData.subject || 'General',
        status: 'Active',
        initials,
        avatar_bg: 'bg-indigo-100',
        avatar_text: 'text-indigo-600'
      });

      if (!error) {
        setIsModalOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          rollNo: '',
          department: 'Computer Science',
          subject: ''
        });
        setShowToast(true);
        fetchStudents();
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert(error.message);
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >

<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-6 sm:gap-0">
<div className="w-full">
<h2 className="text-3xl sm:text-4xl font-extrabold font-headline tracking-tight text-on-surface">Student Directory</h2>
<p className="text-on-surface-variant mt-1 font-body text-sm sm:text-base">Manage individual student profiles and academic statuses.</p>
</div>
<button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-sm whitespace-nowrap">
<span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                Add Student
            </button>
</div>

<div className="grid grid-cols-12 gap-4 mb-8">
<div className="col-span-12 lg:col-span-8 bg-surface-container-low p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
<span className="text-xs font-bold font-headline text-on-surface-variant px-2">FILTERS:</span>
<div className="flex flex-wrap gap-2 w-full sm:w-auto">

{/* Department Filter Dropdown */}
<div className="relative flex-1 sm:flex-none">
<button
  onClick={() => { setShowDeptDropdown(!showDeptDropdown); setShowStatusDropdown(false); }}
  className="w-full sm:w-auto px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface flex items-center justify-between sm:justify-start gap-2"
>
  Dept: {deptFilter}
  <span className="material-symbols-outlined text-xs" data-icon="expand_more">expand_more</span>
</button>
{showDeptDropdown && (
  <div className="absolute top-full left-0 mt-1 w-52 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 z-50 py-1 overflow-hidden">
    {DEPARTMENTS.map(d => (
      <button
        key={d}
        onClick={() => { setDeptFilter(d); setShowDeptDropdown(false); }}
        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${deptFilter === d ? 'bg-primary-container text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'}`}
      >
        {d}
      </button>
    ))}
  </div>
)}
</div>

{/* Status Filter Dropdown */}
<div className="relative">
<button
  onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDeptDropdown(false); }}
  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface flex items-center gap-2"
>
  Status: {statusFilter}
  <span className="material-symbols-outlined text-xs" data-icon="expand_more">expand_more</span>
</button>
{showStatusDropdown && (
  <div className="absolute top-full left-0 mt-1 w-40 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 z-50 py-1 overflow-hidden">
    {STATUSES.map(s => (
      <button
        key={s}
        onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-primary-container text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'}`}
      >
        {s}
      </button>
    ))}
  </div>
)}
</div>

</div>
</div>
<div className="col-span-12 lg:col-span-4 bg-surface-container-low p-3 sm:p-4 rounded-xl flex items-center justify-between">
<p className="text-xs sm:text-sm text-on-surface-variant"><span className="font-bold text-on-surface">{filteredStudents.length}</span> Students found</p>
<div className="flex gap-1">
<button className="p-2 bg-surface-container-lowest rounded-lg">
<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
</button>
<button className="p-2 bg-primary text-on-primary rounded-lg shadow-sm">
<span className="material-symbols-outlined" data-icon="list">list</span>
</button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50">
<th className="px-6 py-5 text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest">Student Details</th>
<th className="px-6 py-5 text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest">Roll No.</th>
<th className="px-6 py-5 text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest">Department</th>
<th className="px-6 py-5 text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest">Status</th>
<th className="px-6 py-5 text-xs font-bold font-headline text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">
{filteredStudents.length === 0 && (
  <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-medium">No students match the selected filters.</td></tr>
)}
{filteredStudents.map(student => (
<tr key={student.id} className="transition-colors group hover:bg-surface-container-low/30">
<td className="px-6 py-4">
<div className="flex items-center gap-4">
  {student.imgSrc ? (
    <img alt={student.name} className="w-10 h-10 rounded-full object-cover" src={student.imgSrc}/>
  ) : (
    <div className={`w-10 h-10 rounded-full ${student.avatar_bg} flex items-center justify-center ${student.avatar_text} font-bold text-sm`}>{student.initials}</div>
  )}
  <div>
    <p className="font-bold text-on-surface font-headline">{student.name}</p>
    <p className="text-xs text-on-surface-variant">{student.email}</p>
  </div>
</div>
</td>
<td className="px-6 py-4 font-label text-on-surface-variant">{student.roll_no}</td>
<td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{student.department}</td>
<td className="px-6 py-4">
  <span className={`text-xs font-bold px-3 py-1 rounded-full ${student.status === 'Active' ? 'bg-primary-container/30 text-primary' : 'bg-error-container/30 text-error'}`}>
    {student.status}
  </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-1">
<button onClick={() => alert(`Viewing ${student.name}'s profile`)} className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">visibility</span></button>
<button onClick={() => alert(`Editing ${student.name}'s profile`)} className="p-2 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl" data-icon="edit">edit</span></button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>


{isModalOpen && (
<div className="fixed inset-0 bg-on-surface/40 backdrop-blur-md z-[60] flex items-center justify-center p-6">
<div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform animate-in fade-in zoom-in duration-300">

<div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-surface-container flex items-center justify-between">
<div>
<h3 className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface leading-tight">Add New Student</h3>
<p className="text-xs sm:text-sm text-on-surface-variant font-body mt-1">Populate the fields to create a comprehensive academic profile.</p>
</div>
<button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
<span className="material-symbols-outlined text-xl sm:text-2xl" data-icon="close">close</span>
</button>
</div>

<div className="flex-1 overflow-y-auto p-10 space-y-10 hide-scrollbar">

<div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
<div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
<div className="w-full h-full rounded-2xl bg-primary-container/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary relative group cursor-pointer hover:bg-primary-container/20 transition-all">
<span className="material-symbols-outlined text-2xl sm:text-3xl mb-1" data-icon="add_a_photo">add_a_photo</span>
<span className="text-[8px] sm:text-[9px] font-bold font-headline uppercase tracking-widest text-primary/60">Upload Image</span>
<div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
</div>
<div className="flex-1 text-center sm:text-left">
<p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                            Upload a high-resolution identification photo for the student profile.
                        </p>
</div>
</div>

<div className="space-y-6">
<div className="flex items-center gap-3">
<div className="h-px flex-1 bg-surface-container"></div>
<span className="text-[10px] font-bold font-headline text-outline tracking-widest uppercase">Personal Details</span>
<div className="h-px flex-1 bg-surface-container"></div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">FIRST NAME</label>
<input 
  name="firstName"
  value={formData.firstName}
  onChange={handleInputChange}
  className="w-full px-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline-variant" 
  placeholder="e.g. John" 
  type="text"
/>
</div>
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">LAST NAME</label>
<input 
  name="lastName"
  value={formData.lastName}
  onChange={handleInputChange}
  className="w-full px-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline-variant" 
  placeholder="e.g. Doe" 
  type="text"
/>
</div>
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">INSTITUTIONAL EMAIL</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg" data-icon="alternate_email">alternate_email</span>
<input 
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  className="w-full pl-12 pr-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline-variant" 
  placeholder="j.doe@edu.curator.com" 
  type="email"
/>
</div>
</div>
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">STUDENT ID</label>
<input 
  name="rollNo"
  value={formData.rollNo}
  onChange={handleInputChange}
  className="w-full px-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline-variant" 
  placeholder="e.g. 2024-0001" 
  type="text"
/>
</div>
</div>
</div>

<div className="space-y-6">
<div className="flex items-center gap-3">
<div className="h-px flex-1 bg-surface-container"></div>
<span className="text-[10px] font-bold font-headline text-outline tracking-widest uppercase">Academic Context</span>
<div className="h-px flex-1 bg-surface-container"></div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">DEPARTMENT</label>
<div className="relative">
<select 
  name="department"
  value={formData.department}
  onChange={handleInputChange}
  className="w-full px-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body appearance-none"
>
<option>Computer Science</option>
<option>Data Science</option>
<option>Electrical Eng.</option>
<option>Business Admin</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
</div>
<div className="space-y-2.5">
<label className="text-xs font-bold font-headline text-on-surface tracking-wide px-1">SUBJECT</label>
<input 
  name="subject"
  value={formData.subject}
  onChange={handleInputChange}
  className="w-full px-5 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm font-body placeholder:text-outline-variant" 
  placeholder="e.g. Advanced AI" 
  type="text"
/>
</div>
</div>
</div>
</div>

<div className="px-6 py-6 sm:px-10 sm:py-8 bg-surface-container-low/50 border-t border-surface-container flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-5">
<button onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 text-sm font-bold font-headline text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-lg" data-icon="history">history</span>
                    Discard Changes
                </button>
<button disabled={isLoading} onClick={handleRegister} className={`w-full sm:w-auto px-10 py-3.5 bg-primary text-on-primary rounded-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-wait' : ''}`}>
<span className="material-symbols-outlined text-lg" data-icon={isLoading ? "hourglass_empty" : "how_to_reg"}>{isLoading ? 'hourglass_empty' : 'how_to_reg'}</span>
                    {isLoading ? 'Processing...' : 'Register Student'}
                </button>
</div>
</div>
</div>
)}

<div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 z-50 transform transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
<span className="material-symbols-outlined text-primary">check_circle</span>
<span className="text-sm font-medium">Student registered successfully.</span>
</div>

    </motion.div>
  );
}