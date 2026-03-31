import { supabase } from './supabase';

export interface Student {
  id: number;
  name: string;
  email: string | null;
  department: string | null;
  roll_no: string;
  subject: string | null;
  status: 'Active' | 'Inactive';
  avatar_bg: string;
  avatar_text: string;
  initials: string;
  user_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: 'admin' | 'student';
  email: string;
  created_at: string;
}

export interface AttendanceRecord {
  id?: number;
  student_id: number;
  date: string;
  status: 'Present' | 'Absent';
  subject: string;
  user_id?: string;
}

export const attendanceService = {
  // --- Auth & Profile Operations (Bypassed) ---
  async getProfile() {
    // Returns a dummy admin profile in bypass mode
    return {
       id: 'demo-user',
       role: 'admin',
       email: 'demo@example.com',
       created_at: new Date().toISOString()
    } as Profile;
  },

  // --- Student Operations ---
  async getStudents() {
    return await supabase
      .from('students')
      .select('*')
      .order('name');
  },

  async addStudent(student: Partial<Student>) {
    return await supabase
      .from('students')
      .insert([student]);
  },

  async updateStudent(id: number, updates: Partial<Student>) {
    return await supabase
      .from('students')
      .update(updates)
      .eq('id', id);
  },

  async deleteStudent(id: number) {
    return await supabase
      .from('students')
      .delete()
      .eq('id', id);
  },

  // --- Attendance Operations ---
  async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const [
      studentResponse,
      attendanceResponse,
      recentActivityResponse
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('attendance').select('status').eq('date', today),
      supabase.from('attendance')
        .select(`
          status, date, subject,
          students (id, name, department, initials)
        `)
        .order('date', { ascending: false })
        .limit(5)
    ]);

    return { 
      studentCount: studentResponse.count || 0, 
      attendanceData: attendanceResponse.data || [], 
      recentActivity: (recentActivityResponse.data || []).map((ra: any) => ({
        ...ra,
        student: ra.students 
      }))
    };
  },

  async saveAttendance(records: Partial<AttendanceRecord>[]) {
    // NO Auth check in bypass mode
    return await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date,subject' });
  },

  async getAttendanceByStudent(studentId: number) {
    return await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
  },

  async getAllAttendanceWithStudents() {
    return await supabase
      .from('attendance')
      .select(`
        *,
        students (*)
      `)
      .order('date', { ascending: false });
  }
};
