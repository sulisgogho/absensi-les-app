-- ==========================================
-- LESFLOW - SUPABASE MIGRATION SCRIPT
-- ==========================================
-- Jalankan seluruh script ini di SQL Editor Supabase Anda.
-- Ini akan membuat tabel-tabel yang dibutuhkan dan mengisi data sampel awal.

-- 1. Create Tables
CREATE TABLE teacher_info (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  title TEXT,
  phone TEXT,
  email TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_account_name TEXT,
  ewallet_name TEXT,
  ewallet_number TEXT,
  qris_text TEXT,
  notes TEXT
);

CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#4f46e5',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  address TEXT,
  default_subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,
  rate_type TEXT DEFAULT 'per_session',
  base_rate INTEGER DEFAULT 150000,
  session_duration_min INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedules (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  schedule_id TEXT REFERENCES schedules(id) ON DELETE SET NULL,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  duration_minutes INTEGER,
  calculated_fee INTEGER DEFAULT 0,
  total_fee INTEGER DEFAULT 0,
  materi_notes TEXT,
  progress_notes TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  payment_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE additional_fees (
  id TEXT PRIMARY KEY,
  attendance_id TEXT REFERENCES attendance(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0
);


-- 2. Insert Initial Seed Data (Data Sampel)
INSERT INTO teacher_info (id, name, title, phone, email, bank_name, bank_account, bank_account_name, ewallet_name, ewallet_number, qris_text)
VALUES (
  1, 
  'Andi Pratama', 
  'S.Pd., M.Si.', 
  '081234567890', 
  'andi.pratama@email.com',
  'BCA', 
  '1234567890', 
  'Andi Pratama',
  'GoPay / OVO', 
  '081234567890',
  'Transfer dengan berita acara "Nama Siswa - Bulan"'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO subjects (id, name, color)
VALUES
  ('subj-1', 'Matematika SMA', '#4f46e5'),
  ('subj-2', 'Fisika SMA', '#e11d48'),
  ('subj-3', 'Kimia SMA', '#059669'),
  ('subj-4', 'Bahasa Inggris', '#d97706'),
  ('subj-5', 'IPA Terpadu SMP', '#0891b2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO students (id, name, grade, phone, parent_name, parent_phone, address, default_subject_id, rate_type, base_rate, session_duration_min)
VALUES
  ('std-1', 'Budi Santoso', 'Kelas 12 SMA', '081298765432', 'Bpk. Hendra Santoso', '081298765000', 'Jl. Melati No. 45, Kebayoran Baru, Jakarta Selatan', 'subj-1', 'per_session', 150000, 90),
  ('std-2', 'Anisa Rahmawati', 'Kelas 11 SMA', '085711223344', 'Ibu Dewi Rahma', '085711223000', 'Komplek Asri Blok B3, Kembangan, Jakarta Barat', 'subj-2', 'per_hour', 100000, 60),
  ('std-3', 'Kevin Wijaya', 'Kelas 12 SMA', '081399887766', 'Bpk. Tan Wijaya', '081399887000', 'Jl. Gajah Mada No. 12, Gambir, Jakarta Pusat', 'subj-4', 'custom', 200000, 90),
  ('std-4', 'Siti Nurhaliza', 'Kelas 9 SMP', '082144556677', 'Ibu Farida', '082144556000', 'Jl. Mawar No. 8, Margonda, Depok', 'subj-5', 'per_session', 120000, 90)
ON CONFLICT (id) DO NOTHING;

-- 3. Set Row Level Security (RLS) to PUBLIC (Since this is a private personal app without auth for now)
-- Karena ini aplikasi milik pribadi (single user) dan kita tidak mengimplementasikan auth supabase untuk saat ini,
-- kita izinkan akses publik dari anon key. 
-- JIKA NANTI DIPERLUKAN KEAMANAN LEBIH, BISA DITAMBAHKAN AUTHENTICATION.

ALTER TABLE teacher_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon" ON teacher_info FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON schedules FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon" ON additional_fees FOR ALL USING (true);
