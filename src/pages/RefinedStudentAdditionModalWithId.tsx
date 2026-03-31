import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { attendanceService, type Student } from '../lib/attendanceService';
import { supabase } from '../lib/supabase';

export default function RefinedStudentAdditionModalWithId() {
  // AUTO-DETECT ROLE FOR BYPASS
  const isStudentView = localStorage.getItem('demo_role') === 'student';

  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: number, name: string} | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNo: '',
    department: 'Computer Science',
    subject: 'Computer Science'
  });

  const DEPARTMENTS = [
    'Computer Science',
    'Mechanical Eng.',
    'Business Admin',
    'Fine Arts',
  ];

  const fetchStudents = async () => {
    const { data, error } = await attendanceService.getStudents();
    if (!error && data) setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      rollNo: '',
      department: 'Computer Science',
      subject: 'Computer Science'
    });
  };

  const handleEditClick = (student: any) => {
    const [first, ...last] = student.name.split(' ');
    setFormData({
      firstName: first,
      lastName: last.join(' '),
      email: student.email || '',
      rollNo: student.roll_no,
      department: student.department || 'Computer Science',
      subject: student.subject || 'Computer Science'
    });
    setEditingStudentId(student.id);
    setIsModalOpen(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudentId) {
        const { error } = await attendanceService.updateStudent(editingStudentId, {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          roll_no: formData.rollNo,
          department: formData.department,
          subject: formData.subject,
          status: 'Active'
        });
        if (error) throw error;
      } else {
        const { error } = await attendanceService.addStudent({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          roll_no: formData.rollNo,
          department: formData.department,
          subject: formData.subject,
          status: 'Active',
          initials: (formData.firstName?.[0] || '') + (formData.lastName?.[0] || ''),
          avatar_bg: 'bg-indigo-100',
          avatar_text: 'text-indigo-600'
        });
        if (error) throw error;
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsModalOpen(false);
        setEditingStudentId(null);
        resetForm();
        fetchStudents();
      }, 2000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    const { error } = await attendanceService.deleteStudent(studentToDelete.id);
    if (!error) {
      setStudentToDelete(null);
      fetchStudents();
    } else {
      alert(error.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
        <div className="w-full">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-5xl font-black font-headline tracking-tighter text-slate-900"
          >
            Student Directory
          </motion.h2>
        </div>
        {!isStudentView && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingStudentId(null); setIsModalOpen(true); }} 
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-xl">person_add</span>
            <span>Add Student</span>
          </motion.button>
        )}
      </div>

      <div className="glass-card p-2 sm:p-3 rounded-[2rem] border border-slate-200/50 shadow-sm flex flex-col lg:flex-row items-center gap-3 mb-10 overflow-visible">
        <div className="w-full lg:w-1/3 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-xl shadow-slate-200/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                {!isStudentView && <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Control</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={isStudentView ? 4 : 5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-5xl text-slate-200">person_search</span>
                      <p className="text-slate-400 font-bold text-lg">No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredStudents.map((student, idx) => (
                <motion.tr 
                  key={student.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-primary/5 transition-all cursor-default"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        {student.imgSrc ? (
                          <img alt={student.name} className="w-12 h-12 rounded-[1.25rem] object-cover border-2 border-white shadow-sm" src={student.imgSrc}/>
                        ) : (
                          <div className={`w-12 h-12 rounded-[1.25rem] ${student.avatar_bg} flex items-center justify-center ${student.avatar_text} font-black text-base border-2 border-white shadow-sm ring-1 ring-slate-100`}>
                            {student.initials}
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base font-headline">{student.name}</p>
                        <p className="text-xs font-bold text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-xs font-black px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg">{student.roll_no}</code>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-600">{student.department}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {student.status}
                    </span>
                  </td>
                  {!isStudentView && (
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleEditClick(student)}
                          title="Edit Student" 
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 rounded-xl transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button 
                          onClick={() => setStudentToDelete({ id: student.id, name: student.name })}
                          title="Delete" 
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-error hover:border-error/20 hover:shadow-lg hover:shadow-error/10 rounded-xl transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{editingStudentId ? 'Update Student' : 'New Student Entry'}</h3>
                <button onClick={() => { setIsModalOpen(false); setEditingStudentId(null); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleRegister} className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Institution Email</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold" type="email" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Student ID</label>
                    <input name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-black" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Department</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-[0.98]">
                  {editingStudentId ? 'Override Profile' : 'Save Connection'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">Remove Access?</h3>
              <p className="text-sm text-slate-500 font-bold mb-8">This will disconnect <span className="text-slate-900 underline">{studentToDelete.name}</span> from the active registry. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setStudentToDelete(null)} className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-200">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] transition-all duration-500 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <span className="material-symbols-outlined text-primary">check_circle</span>
        <span className="text-sm font-black tracking-tight whitespace-nowrap">Directory has been synchronized successfully</span>
      </div>
    </motion.div>
  );
}