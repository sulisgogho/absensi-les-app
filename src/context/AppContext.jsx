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
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modal control states
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [prefilledAttendanceData, setPrefilledAttendanceData] = useState(null);

  const [invoicePreviewData, setInvoicePreviewData] = useState(null);

  // ─── Initial Data Load from Backend ─────────────────────────────────────

  useEffect(() => {
    async function loadAll() {
      try {
        const [ti, subj, stud, att] = await Promise.all([
          api.getTeacherInfo(),
          api.getSubjects(),
          api.getStudents(),
          api.getAttendance(),
        ]);
        setTeacherInfo(ti);
        setSubjects(subj);
        setStudents(stud);
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


  // ─── Fee Calculator ─────────────────────────────────────────────────────

  const calculateFee = (studentId, durationMinutes) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;

    const baseRate = Number(student.baseRate) || 0;
    const duration = Number(durationMinutes) || 0;
    const standardMin = Number(student.sessionDurationMin) || 90;

    if (student.rateType === 'per_hour') {
      return Math.round((baseRate / 60) * duration);
    } else if (student.rateType === 'per_session') {
      // Prorate if actual duration differs from standard duration
      if (standardMin > 0 && duration !== standardMin) {
        return Math.round((baseRate / standardMin) * duration);
      }
      return baseRate;
    } else if (student.rateType === 'custom') {
      return baseRate; // Fixed for custom
    }
    return baseRate;
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


  // ─── CRUD: Attendance ──────────────────────────────────────────────────

  const addAttendance = async (attendanceData) => {
    try {
      const newAtt = await api.createAttendance(attendanceData);
      setAttendance((prev) => [newAtt, ...prev]);

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
        invoicePreviewData,
        setInvoicePreviewData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
