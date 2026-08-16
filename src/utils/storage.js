// Helper utility for localStorage persistence with rich seed data for Indonesian private tutoring app

const STORAGE_KEYS = {
  TEACHER_INFO: 'lesflow_teacher_info',
  STUDENTS: 'lesflow_students',
  SUBJECTS: 'lesflow_subjects',
  SCHEDULES: 'lesflow_schedules',
  ATTENDANCE: 'lesflow_attendance',
};

// Generate relative date string YYYY-MM-DD
export function getRelativeDateStr(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
}

const INITIAL_TEACHER_INFO = {
  name: 'Drs. Ahmad Rifai, S.Pd.',
  title: 'Pengajar Les Privat Matematika & Sains',
  phone: '081234567890',
  email: 'ahmad.rifai@gmail.com',
  bankName: 'Bank BCA',
  bankAccount: '8830192847',
  bankAccountName: 'Ahmad Rifai',
  ewalletName: 'GoPay / OVO / DANA',
  ewalletNumber: '081234567890',
  qrisText: 'NMID: ID10293847561 - Les Privat Pak Ahmad',
  notes: 'Terima kasih atas kepercayaannya. Harap konfirmasi bukti transfer via WhatsApp.',
};

const INITIAL_SUBJECTS = [
  { id: 'subj-1', name: 'Matematika SMA (UTBK)', color: '#4f46e5', icon: 'Calculator' },
  { id: 'subj-2', name: 'Fisika SMA', color: '#0284c7', icon: 'Atom' },
  { id: 'subj-3', name: 'Bahasa Inggris SBMPTN', color: '#0d9488', icon: 'Languages' },
  { id: 'subj-4', name: 'Coding & Algoritma', color: '#7c3aed', icon: 'Code' },
  { id: 'subj-5', name: 'Matematika SMP', color: '#e11d48', icon: 'BookOpen' },
];

const INITIAL_STUDENTS = [
  {
    id: 'std-1',
    name: 'Budi Santoso',
    grade: 'Kelas 12 SMA',
    phone: '081298765432',
    parentName: 'Bpk. Hendra Santoso',
    parentPhone: '081298765000',
    address: 'Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan',
    defaultSubjectId: 'subj-1',
    rateType: 'per_session', // 'per_session' | 'per_hour' | 'custom'
    baseRate: 150000,
    sessionDurationMin: 90,
  },
  {
    id: 'std-2',
    name: 'Anisa Rahmawati',
    grade: 'Kelas 11 SMA',
    phone: '085711223344',
    parentName: 'Ibu Dewi Rahma',
    parentPhone: '085711223000',
    address: 'Komplek Asri Blok B3, Kembangan, Jakarta Barat',
    defaultSubjectId: 'subj-2',
    rateType: 'per_hour',
    baseRate: 100000,
    sessionDurationMin: 60,
  },
  {
    id: 'std-3',
    name: 'Kevin Wijaya',
    grade: 'Kelas 12 SMA',
    phone: '081399887766',
    parentName: 'Bpk. Tan Wijaya',
    parentPhone: '081399887000',
    address: 'Jl. Gajah Mada No. 12, Gambir, Jakarta Pusat',
    defaultSubjectId: 'subj-4',
    rateType: 'custom',
    baseRate: 200000,
    sessionDurationMin: 90,
  },
  {
    id: 'std-4',
    name: 'Siti Nurhaliza',
    grade: 'Kelas 9 SMP',
    phone: '082144556677',
    parentName: 'Ibu Farida',
    parentPhone: '082144556000',
    address: 'Jl. Mawar No. 8, Margonda, Depok',
    defaultSubjectId: 'subj-5',
    rateType: 'per_session',
    baseRate: 120000,
    sessionDurationMin: 90,
  },
];

const INITIAL_SCHEDULES = [
  {
    id: 'sch-1',
    studentId: 'std-1',
    subjectId: 'subj-1',
    date: getRelativeDateStr(0), // Today
    startTime: '15:30',
    endTime: '17:00',
    status: 'scheduled',
    notes: 'Persiapan Tryout Kalkulus & Integrasi',
  },
  {
    id: 'sch-2',
    studentId: 'std-2',
    subjectId: 'subj-2',
    date: getRelativeDateStr(0), // Today
    startTime: '18:30',
    endTime: '20:00',
    status: 'scheduled',
    notes: 'Hukum Newton & Dinamika Gerak',
  },
  {
    id: 'sch-3',
    studentId: 'std-3',
    subjectId: 'subj-4',
    date: getRelativeDateStr(1), // Tomorrow
    startTime: '16:00',
    endTime: '17:30',
    status: 'scheduled',
    notes: 'Struktur Data Array & Object JavaScript',
  },
  {
    id: 'sch-4',
    studentId: 'std-4',
    subjectId: 'subj-5',
    date: getRelativeDateStr(2),
    startTime: '14:00',
    endTime: '15:30',
    status: 'scheduled',
    notes: 'Persamaan Kuadrat & Aljabar',
  },
  {
    id: 'sch-5',
    studentId: 'std-1',
    subjectId: 'subj-1',
    date: getRelativeDateStr(-2),
    startTime: '15:30',
    endTime: '17:00',
    status: 'completed',
    notes: 'Matriks & Transformasi Geometri',
  },
];

const INITIAL_ATTENDANCE = [
  {
    id: 'att-1',
    scheduleId: 'sch-5',
    studentId: 'std-1',
    subjectId: 'subj-1',
    date: getRelativeDateStr(-2),
    startTime: '15:30',
    endTime: '17:00',
    durationMinutes: 90,
    calculatedFee: 150000,
    additionalFees: [
      { id: 'add-1', description: 'Uang Transport Bensin', amount: 25000 },
    ],
    totalFee: 175000,
    materiNotes: 'Pembahasan Soal Matriks 3x3 dan Determinant',
    progressNotes: 'Budi sudah memahami rumus inersia & determinan dengan baik',
    paymentStatus: 'unpaid', // 'unpaid' | 'paid'
    paymentDate: null,
  },
  {
    id: 'att-2',
    scheduleId: null,
    studentId: 'std-2',
    subjectId: 'subj-2',
    date: getRelativeDateStr(-5),
    startTime: '18:30',
    endTime: '20:00',
    durationMinutes: 90,
    calculatedFee: 150000,
    additionalFees: [
      { id: 'add-2', description: 'Modul Soal Fisika Erlangga', amount: 45000 },
      { id: 'add-3', description: 'Transport', amount: 20000 },
    ],
    totalFee: 215000,
    materiNotes: 'Latihan Soal Dinamika Gerak Melingkar',
    progressNotes: 'Anisa perlu memperbanyak latihan rumus gaya sentripetal',
    paymentStatus: 'paid',
    paymentDate: getRelativeDateStr(-3),
  },
  {
    id: 'att-3',
    scheduleId: null,
    studentId: 'std-3',
    subjectId: 'subj-4',
    date: getRelativeDateStr(-7),
    startTime: '16:00',
    endTime: '18:00',
    durationMinutes: 120,
    calculatedFee: 266667, // Pro-rated for 120 min on 200k/90min
    additionalFees: [
      { id: 'add-4', description: 'Transport Khusus PP', amount: 30000 },
    ],
    totalFee: 296667,
    materiNotes: 'Pengenalan React Components & Props',
    progressNotes: 'Kevin sangat cepat paham logika asynchronous JS',
    paymentStatus: 'unpaid',
    paymentDate: null,
  },
  {
    id: 'att-4',
    scheduleId: null,
    studentId: 'std-4',
    subjectId: 'subj-5',
    date: getRelativeDateStr(-10),
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    calculatedFee: 120000,
    additionalFees: [],
    totalFee: 120000,
    materiNotes: 'Faktorisasi Suku Banyak & Aljabar Dasar',
    progressNotes: 'Siti konsisten dan sudah teliti dalam berhitung',
    paymentStatus: 'paid',
    paymentDate: getRelativeDateStr(-8),
  },
];

export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error loading key ${key} from localStorage`, e);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage`, e);
  }
}

export function getInitialData() {
  return {
    teacherInfo: loadFromStorage(STORAGE_KEYS.TEACHER_INFO, INITIAL_TEACHER_INFO),
    students: loadFromStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
    subjects: loadFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
    schedules: loadFromStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES),
    attendance: loadFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  };
}

export function resetToDefaults() {
  localStorage.setItem(STORAGE_KEYS.TEACHER_INFO, JSON.stringify(INITIAL_TEACHER_INFO));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  window.location.reload();
}
