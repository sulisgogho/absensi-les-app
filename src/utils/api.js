import { supabase } from './supabaseClient';
import { nanoid } from 'nanoid';

// --- Helper Functions for CamelCase <-> snake_case ---
const toCamel = (s) => s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const toSnake = (s) => s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const keysToCamel = (obj) => {
  if (Array.isArray(obj)) return obj.map(v => keysToCamel(v));
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamel(key)] = keysToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

const keysToSnake = (obj) => {
  if (Array.isArray(obj)) return obj.map(v => keysToSnake(v));
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toSnake(key)] = keysToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Helper function to throw error if response has error, and convert to camelCase
const handleResponse = (res) => {
  if (res.error) throw new Error(res.error.message);
  return keysToCamel(res.data);
};

export const api = {
  // Teacher Info
  getTeacherInfo: async () => {
    const res = await supabase.from('teacher_info').select('*').eq('id', 1).single();
    if (res.error && res.error.code === 'PGRST116') return null; // No rows found
    return handleResponse(res);
  },
  updateTeacherInfo: async (data) => {
    const res = await supabase.from('teacher_info').upsert({ id: 1, ...keysToSnake(data) }).select().single();
    return handleResponse(res);
  },

  // Subjects
  getSubjects: async () => {
    const res = await supabase.from('subjects').select('*').order('created_at', { ascending: true });
    return handleResponse(res);
  },
  createSubject: async (data) => {
    const id = `subj-${nanoid(6)}`;
    const res = await supabase.from('subjects').insert({ id, ...keysToSnake(data) }).select().single();
    return handleResponse(res);
  },
  updateSubject: async (id, data) => {
    const res = await supabase.from('subjects').update(keysToSnake(data)).eq('id', id).select().single();
    return handleResponse(res);
  },
  deleteSubject: async (id) => {
    const res = await supabase.from('subjects').delete().eq('id', id);
    if (res.error) throw new Error(res.error.message);
    return true;
  },

  // Students
  getStudents: async () => {
    const res = await supabase.from('students').select('*').order('created_at', { ascending: false });
    return handleResponse(res);
  },
  createStudent: async (data) => {
    const id = `std-${nanoid(6)}`;
    const res = await supabase.from('students').insert({ id, ...keysToSnake(data) }).select().single();
    return handleResponse(res);
  },
  updateStudent: async (id, data) => {
    const res = await supabase.from('students').update(keysToSnake(data)).eq('id', id).select().single();
    return handleResponse(res);
  },
  deleteStudent: async (id) => {
    const res = await supabase.from('students').delete().eq('id', id);
    if (res.error) throw new Error(res.error.message);
    return true;
  },

  // Schedules
  getSchedules: async () => {
    const res = await supabase.from('schedules').select('*').order('date', { ascending: false }).order('start_time', { ascending: true });
    return handleResponse(res);
  },
  createSchedule: async (data) => {
    const id = `sch-${nanoid(6)}`;
    const res = await supabase.from('schedules').insert({ id, ...keysToSnake(data) }).select().single();
    return handleResponse(res);
  },
  updateSchedule: async (id, data) => {
    const res = await supabase.from('schedules').update(keysToSnake(data)).eq('id', id).select().single();
    return handleResponse(res);
  },
  deleteSchedule: async (id) => {
    const res = await supabase.from('schedules').delete().eq('id', id);
    if (res.error) throw new Error(res.error.message);
    return true;
  },

  // Attendance
  getAttendance: async () => {
    const res = await supabase.from('attendance').select('*, additional_fees(*)').order('date', { ascending: false }).order('start_time', { ascending: false });
    if (res.error) throw new Error(res.error.message);
    
    // Map the result to match the camelCase structure
    const camelData = keysToCamel(res.data);
    return camelData.map(item => ({
      ...item,
      additionalFees: item.additionalFees || [] 
    }));
  },
  createAttendance: async (data) => {
    const { additionalFees, ...attendanceData } = data;
    const attId = `att-${nanoid(6)}`;
    
    const totalAddFees = (additionalFees || []).reduce((sum, f) => sum + Number(f.amount || 0), 0);
    const total_fee = Number(attendanceData.calculatedFee || 0) + totalAddFees;
    
    const insertData = keysToSnake({
      id: attId,
      ...attendanceData,
      totalFee: total_fee,
      paymentStatus: attendanceData.paymentStatus || 'unpaid',
    });

    const res = await supabase.from('attendance').insert(insertData).select().single();
    if (res.error) throw new Error(res.error.message);

    if (additionalFees && additionalFees.length > 0) {
      const feesToInsert = additionalFees.map(f => ({
        id: `fee-${nanoid(6)}`,
        attendance_id: attId,
        description: f.description,
        amount: f.amount
      }));
      const { error: feeError } = await supabase.from('additional_fees').insert(feesToInsert);
      if (feeError) console.error("Error inserting fees:", feeError);
    }
    
    if (attendanceData.scheduleId) {
       await supabase.from('schedules').update({ status: 'completed' }).eq('id', attendanceData.scheduleId);
    }

    const camelRes = keysToCamel(res.data);
    return { ...camelRes, additionalFees: additionalFees || [] };
  },
  updateAttendance: async (id, data) => {
    const { additionalFees, ...attendanceData } = data;
    const updateData = keysToSnake(attendanceData);
    
    if (additionalFees !== undefined) {
      await supabase.from('additional_fees').delete().eq('attendance_id', id);
      if (additionalFees.length > 0) {
        const feesToInsert = additionalFees.map(f => ({
          id: `fee-${nanoid(6)}`,
          attendance_id: id,
          description: f.description,
          amount: f.amount
        }));
        await supabase.from('additional_fees').insert(feesToInsert);
      }
      const totalAddFees = (additionalFees || []).reduce((sum, f) => sum + Number(f.amount || 0), 0);
      updateData.total_fee = Number(attendanceData.calculatedFee || 0) + totalAddFees;
    }

    const res = await supabase.from('attendance').update(updateData).eq('id', id).select().single();
    if (res.error) throw new Error(res.error.message);
    
    const camelRes = keysToCamel(res.data);
    return { ...camelRes, additionalFees: additionalFees || [] };
  },
  deleteAttendance: async (id) => {
    const res = await supabase.from('attendance').delete().eq('id', id);
    if (res.error) throw new Error(res.error.message);
    return true;
  },
  togglePayment: async (id, paymentStatus) => {
    const payment_date = paymentStatus === 'paid' ? new Date().toISOString().split('T')[0] : null;
    const res = await supabase.from('attendance').update({ payment_status: paymentStatus, payment_date }).eq('id', id).select().single();
    if (res.error) throw new Error(res.error.message);
    return keysToCamel(res.data);
  },
  batchPayment: async (ids) => {
    const payment_date = new Date().toISOString().split('T')[0];
    const res = await supabase.from('attendance').update({ payment_status: 'paid', payment_date }).in('id', ids);
    if (res.error) throw new Error(res.error.message);
    return true;
  },

  getDashboardSummary: async () => {
    const { data: attendance } = await supabase.from('attendance').select('*');
    const { data: students } = await supabase.from('students').select('id');
    
    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); 
    
    let totalPendapatanBulanIni = 0;
    let totalTagihanBelumLunas = 0;
    let totalJamMengajarBulanIni = 0;

    (attendance || []).forEach(att => {
      const isCurrentMonth = att.date.startsWith(currentMonthStr);
      
      if (att.payment_status === 'paid' && isCurrentMonth) {
        totalPendapatanBulanIni += (att.total_fee || 0);
      }
      if (att.payment_status === 'unpaid') {
        totalTagihanBelumLunas += (att.total_fee || 0);
      }
      if (isCurrentMonth) {
        totalJamMengajarBulanIni += (att.duration_minutes || 0);
      }
    });

    return {
      totalPendapatanBulanIni,
      totalTagihanBelumLunas,
      totalJamMengajarBulanIni: Math.round(totalJamMengajarBulanIni / 60),
      totalSiswaAktif: students ? students.length : 0
    };
  },
};
