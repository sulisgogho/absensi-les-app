import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [teacherInfo, setTeacherInfo] = useState({
    name: '', title: '', phone: '', email: '',
    bankName: '', bankAccount: '', bankAccountName: '',
    ewalletName: '', ewalletNumber: '', qrisText: '', notes: '',
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modal control states
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [prefilledAttendanceData, setPrefilledAttendanceData] = useState(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [prefilledScheduleData, setPrefilledScheduleData] = useState(null);

  const [invoicePreviewData, setInvoicePreviewData] = useState(null);

  // ─── Initial Data Load from Backend ─────────────────────────────────────

  useEffect(() => {
    async function loadAll() {
      try {
        const [ti, subj, stud, sch, att] = await Promise.all([
          api.getTeacherInfo(),
          api.getSubjects(),
          api.getStudents(),
          api.getSchedules(),
          api.getAttendance(),
        ]);
        setTeacherInfo(ti);
        setSubjects(subj);
        setStudents(stud);
        setSchedules(sch);
        setAttendance(att);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAll();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // ─── Schedule Conflict Detection (client-side for UX) ───────────────────

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const checkScheduleConflict = (newSchedule, ignoreId = null) => {
    if (!newSchedule.date || !newSchedule.startTime || !newSchedule.endTime) {
      return { isConflict: false };
    }

    const newStartMinutes = timeToMinutes(newSchedule.startTime);
    const newEndMinutes = timeToMinutes(newSchedule.endTime);

    if (newEndMinutes <= newStartMinutes) {
      return { isConflict: true, reason: 'Jam selesai harus lebih akhir dari jam mulai.' };
    }

    for (const item of schedules) {
      if (ignoreId && item.id === ignoreId) continue;
      if (item.status === 'cancelled') continue;
      if (item.date !== newSchedule.date) continue;

      const existStart = timeToMinutes(item.startTime);
      const existEnd = timeToMinutes(item.endTime);

      if (newStartMinutes < existEnd && newEndMinutes > existStart) {
        const student = students.find((s) => s.id === item.studentId);
        return {
          isConflict: true,
          conflictingSchedule: item,
          studentName: student ? student.name : 'Siswa Lain',
          timeSlot: `${item.startTime} - ${item.endTime}`,
          reason: `Bentrok dengan jadwal ${student ? student.name : 'Siswa Lain'} (${item.startTime} - ${item.endTime})`,
        };
      }
    }

    return { isConflict: false };
  };

  // ─── Fee Calculator ─────────────────────────────────────────────────────

  const calculateFee = (studentId, durationMinutes) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const baseRate = Number(student.baseRate) || 0;
    const duration = Number(durationMinutes) || 0;
    const standardMin = Number(student.sessionDurationMin) || 90;

    if (student.rateType === 'per_hour') {
      return Math.round((baseRate * duration) / 60);
    } else if (student.rateType === 'custom' || student.rateType === 'per_session') {
      return Math.round((baseRate * duration) / standardMin);
    }
    return Math.round((baseRate * duration) / 90);
  };

  // ─── CRUD: Teacher Info ─────────────────────────────────────────────────

  const updateTeacherInfo = async (info) => {
    try {
      const updated = await api.updateTeacherInfo(info);
      setTeacherInfo(updated);
      showToast('Informasi guru & rekening pembayaran berhasil diperbarui.');
    } catch (err) {
      showToast(`Gagal memperbarui info guru: ${err.message}`, 'error');
    }
  };

  // ─── CRUD: Students ─────────────────────────────────────────────────────

  const addStudent = async (studentData) => {
    try {
      const newStudent = await api.createStudent(studentData);
      setStudents((prev) => [newStudent, ...prev]);
      showToast(`Siswa "${newStudent.name}" berhasil ditambahkan.`);
    } catch (err) {
      showToast(`Gagal menambahkan siswa: ${err.message}`, 'error');
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updated = await api.updateStudent(id, studentData);
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(`Data siswa "${updated.name}" diperbarui.`);
    } catch (err) {
      showToast(`Gagal memperbarui siswa: ${err.message}`, 'error');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const student = students.find((s) => s.id === id);
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast(`Siswa "${student ? student.name : ''}" telah dihapus.`, 'info');
    } catch (err) {
      showToast(`Gagal menghapus siswa: ${err.message}`, 'error');
    }
  };

  // ─── CRUD: Subjects ─────────────────────────────────────────────────────

  const addSubject = async (subjectData) => {
    try {
      const newSubj = await api.createSubject(subjectData);
      setSubjects((prev) => [...prev, newSubj]);
      showToast(`Mata pelajaran "${newSubj.name}" ditambahkan.`);
    } catch (err) {
      showToast(`Gagal menambahkan mapel: ${err.message}`, 'error');
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      const updated = await api.updateSubject(id, subjectData);
      setSubjects((prev) => prev.map((sub) => (sub.id === id ? updated : sub)));
      showToast('Mata pelajaran berhasil diperbarui.');
    } catch (err) {
      showToast(`Gagal memperbarui mapel: ${err.message}`, 'error');
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.deleteSubject(id);
      setSubjects((prev) => prev.filter((sub) => sub.id !== id));
      showToast('Mata pelajaran dihapus.', 'info');
    } catch (err) {
      showToast(`Gagal menghapus mapel: ${err.message}`, 'error');
    }
  };

  // ─── CRUD: Schedules ───────────────────────────────────────────────────

  const addSchedule = async (scheduleData) => {
    // Client-side pre-check for immediate UX feedback
    const conflict = checkScheduleConflict(scheduleData);
    if (conflict.isConflict) {
      showToast(`Peringatan: ${conflict.reason}`, 'error');
      return false;
    }

    try {
      const newSch = await api.createSchedule(scheduleData);
      setSchedules((prev) => [newSch, ...prev]);
      showToast('Jadwal les baru berhasil ditambahkan.');
      return true;
    } catch (err) {
      showToast(`Gagal membuat jadwal: ${err.message}`, 'error');
      return false;
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    const conflict = checkScheduleConflict(scheduleData, id);
    if (conflict.isConflict) {
      showToast(`Peringatan: ${conflict.reason}`, 'error');
      return false;
    }

    try {
      const updated = await api.updateSchedule(id, scheduleData);
      setSchedules((prev) => prev.map((sch) => (sch.id === id ? updated : sch)));
      showToast('Jadwal les berhasil diperbarui.');
      return true;
    } catch (err) {
      showToast(`Gagal memperbarui jadwal: ${err.message}`, 'error');
      return false;
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await api.deleteSchedule(id);
      setSchedules((prev) => prev.filter((sch) => sch.id !== id));
      showToast('Jadwal les dihapus.', 'info');
    } catch (err) {
      showToast(`Gagal menghapus jadwal: ${err.message}`, 'error');
    }
  };

  // ─── Schedule → Attendance Quick Conversion ─────────────────────────────

  const openAttendanceForSchedule = (schedule) => {
    let duration = 90;
    if (schedule.startTime && schedule.endTime) {
      duration = timeToMinutes(schedule.endTime) - timeToMinutes(schedule.startTime);
      if (duration <= 0) duration = 90;
    }

    const calculatedFee = calculateFee(schedule.studentId, duration);

    setPrefilledAttendanceData({
      scheduleId: schedule.id,
      studentId: schedule.studentId,
      subjectId: schedule.subjectId,
      date: schedule.date || new Date().toISOString().split('T')[0],
      startTime: schedule.startTime || '15:00',
      endTime: schedule.endTime || '16:30',
      durationMinutes: duration,
      calculatedFee: calculatedFee,
      additionalFees: [],
      materiNotes: schedule.notes || '',
      progressNotes: '',
    });
    setIsAttendanceModalOpen(true);
  };

  // ─── CRUD: Attendance ──────────────────────────────────────────────────

  const addAttendance = async (attendanceData) => {
    try {
      const newAtt = await api.createAttendance(attendanceData);
      setAttendance((prev) => [newAtt, ...prev]);

      // Mark related schedule as completed in local state
      if (attendanceData.scheduleId) {
        setSchedules((prev) =>
          prev.map((s) => (s.id === attendanceData.scheduleId ? { ...s, status: 'completed' } : s))
        );
      }

      showToast('Kehadiran les berhasil dicatat!');
      return true;
    } catch (err) {
      showToast(`Gagal mencatat absensi: ${err.message}`, 'error');
      return false;
    }
  };

  const updateAttendance = async (id, attendanceData) => {
    try {
      const updated = await api.updateAttendance(id, attendanceData);
      setAttendance((prev) => prev.map((att) => (att.id === id ? updated : att)));
      showToast('Data absensi berhasil diperbarui.');
      return true;
    } catch (err) {
      showToast(`Gagal memperbarui absensi: ${err.message}`, 'error');
      return false;
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await api.deleteAttendance(id);
      setAttendance((prev) => prev.filter((att) => att.id !== id));
      showToast('Data absensi dihapus.', 'info');
    } catch (err) {
      showToast(`Gagal menghapus absensi: ${err.message}`, 'error');
    }
  };

  const togglePaymentStatus = async (id) => {
    try {
      const current = attendance.find(a => a.id === id);
      const newStatus = current.paymentStatus === 'paid' ? 'unpaid' : 'paid';
      const updated = await api.togglePayment(id, newStatus);
      setAttendance((prev) => prev.map((att) => (att.id === id ? updated : att)));
      showToast('Status pembayaran tagihan diperbarui.');
    } catch (err) {
      showToast(`Gagal memperbarui status bayar: ${err.message}`, 'error');
    }
  };

  const markMultipleAsPaid = async (ids) => {
    try {
      await api.batchPayment(ids);
      const today = new Date().toISOString().split('T')[0];
      setAttendance((prev) =>
        prev.map((att) => (ids.includes(att.id) ? { ...att, paymentStatus: 'paid', paymentDate: today } : att))
      );
      showToast(`${ids.length} tagihan berhasil ditandai Lunas.`);
    } catch (err) {
      showToast(`Gagal batch payment: ${err.message}`, 'error');
    }
  };

  // ─── Loading Screen ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)',
        fontFamily: 'var(--font-main)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', animation: 'fadeIn 0.5s ease-out',
            fontSize: '1.5rem',
          }}>📚</div>
          <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>Memuat LesFlow...</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Menghubungkan ke server backend</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        teacherInfo,
        updateTeacherInfo,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        checkScheduleConflict,
        attendance,
        addAttendance,
        updateAttendance,
        deleteAttendance,
        togglePaymentStatus,
        markMultipleAsPaid,
        calculateFee,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        toast,
        showToast,
        isAttendanceModalOpen,
        setIsAttendanceModalOpen,
        prefilledAttendanceData,
        setPrefilledAttendanceData,
        openAttendanceForSchedule,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        prefilledScheduleData,
        setPrefilledScheduleData,
        invoicePreviewData,
        setInvoicePreviewData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
