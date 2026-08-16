import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  BookOpen,
  DollarSign,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Check,
  Save,
  QrCode,
  Building,
  Phone,
  MapPin,
  X,
} from 'lucide-react';

export const MasterData = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    teacherInfo,
    updateTeacherInfo,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('students'); // 'students' | 'subjects' | 'payment'

  // Student Form Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    grade: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: '',
    defaultSubjectId: '',
    rateType: 'per_session', // 'per_session' | 'per_hour' | 'custom'
    baseRate: 150000,
    sessionDurationMin: 90,
  });

  // Subject Form Modal State
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    color: '#4f46e5',
  });

  // Teacher Payment Form State
  const [teacherForm, setTeacherForm] = useState(teacherInfo);

  // --- Student Handlers ---
  const handleOpenStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm(student);
    } else {
      setEditingStudent(null);
      setStudentForm({
        name: '',
        grade: 'Kelas 12 SMA',
        phone: '',
        parentName: '',
        parentPhone: '',
        address: '',
        defaultSubjectId: subjects[0]?.id || '',
        rateType: 'per_session',
        baseRate: 150000,
        sessionDurationMin: 90,
      });
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, studentForm);
    } else {
      addStudent(studentForm);
    }
    setIsStudentModalOpen(false);
  };

  // --- Subject Handlers ---
  const handleOpenSubjectModal = (subj = null) => {
    if (subj) {
      setEditingSubject(subj);
      setSubjectForm(subj);
    } else {
      setEditingSubject(null);
      setSubjectForm({
        name: '',
        color: '#4f46e5',
      });
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm);
    } else {
      addSubject(subjectForm);
    }
    setIsSubjectModalOpen(false);
  };

  // --- Teacher Info Handlers ---
  const handleSaveTeacherInfo = (e) => {
    e.preventDefault();
    updateTeacherInfo(teacherForm);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Manajemen Data Master & Tarif</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Kelola daftar siswa, mata pelajaran yang diajarkan, skema tarif les, dan rekening pembayaran guru.
        </p>

        {/* Subtab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('students')}
          >
            <Users size={16} /> Data Siswa ({students.length})
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'subjects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('subjects')}
          >
            <BookOpen size={16} /> Mata Pelajaran ({subjects.length})
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'payment' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('payment')}
          >
            <CreditCard size={16} /> Informasi Pembayaran Guru
          </button>
        </div>
      </div>

      {/* --- TAB 1: DATA SISWA & TARIF --- */}
      {activeSubTab === 'students' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Users size={18} color="var(--primary)" /> Daftar Siswa & Tarif Les
              </h3>
              <p className="card-subtitle">Atur data kontak dan biaya les per sesi/jam untuk tiap siswa</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenStudentModal(null)}>
              <Plus size={16} /> Tambah Siswa Baru
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nama Siswa & Kelas</th>
                  <th>Kontak Siswa / Ortu</th>
                  <th>Alamat Domisili</th>
                  <th>Pengaturan Tarif</th>
                  <th>Tarif Dasar</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const defaultSubj = subjects.find((sub) => sub.id === s.defaultSubjectId);
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.grade}</div>
                        {defaultSubj && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: `${defaultSubj.color}22`,
                              color: defaultSubj.color,
                              fontWeight: '600',
                              marginTop: '2px',
                              display: 'inline-block',
                            }}
                          >
                            {defaultSubj.name}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>Siswa: {s.phone || '-'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Ortu: {s.parentName || '-'} ({s.parentPhone || '-'})
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', maxWidth: '200px' }}>{s.address || '-'}</td>
                      <td>
                        <span className="badge badge-scheduled">
                          {s.rateType === 'per_session' && `Per Sesi (${s.sessionDurationMin}m)`}
                          {s.rateType === 'per_hour' && 'Per Jam (60m)'}
                          {s.rateType === 'custom' && 'Tarif Kustom Sesi'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                        Rp {Number(s.baseRate || 0).toLocaleString('id-ID')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleOpenStudentModal(s)}
                            title="Edit Data Siswa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              if (window.confirm(`Hapus data siswa "${s.name}"?`)) {
                                deleteStudent(s.id);
                              }
                            }}
                            title="Hapus Siswa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: MATA PELAJARAN --- */}
      {activeSubTab === 'subjects' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BookOpen size={18} color="var(--accent-sky)" /> Daftar Mata Pelajaran
              </h3>
              <p className="card-subtitle">Mata pelajaran yang Anda ajarkan dengan label warna visual</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenSubjectModal(null)}>
              <Plus size={16} /> Tambah Mapel Baru
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {subjects.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  borderLeft: `5px solid ${sub.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{sub.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Warna Kalender: {sub.color}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => handleOpenSubjectModal(sub)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => {
                      if (window.confirm(`Hapus mata pelajaran "${sub.name}"?`)) {
                        deleteSubject(sub.id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: INFORMASI PEMBAYARAN GURU --- */}
      {activeSubTab === 'payment' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CreditCard size={18} color="var(--secondary)" /> Rekening & Metode Pembayaran Guru
              </h3>
              <p className="card-subtitle">
                Detail pembayaran ini akan otomatis tercetak di footer invoice PDF & pesan WhatsApp
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveTeacherInfo}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Lengkap Guru / Pengajar</label>
                <input
                  type="text"
                  className="form-input"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gelar / Spesialisasi</label>
                <input
                  type="text"
                  className="form-input"
                  value={teacherForm.title}
                  onChange={(e) => setTeacherForm({ ...teacherForm, title: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">No. WhatsApp</label>
                <input
                  type="text"
                  className="form-input"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Guru</label>
                <input
                  type="email"
                  className="form-input"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ margin: '1.5rem 0 1rem 0', borderTop: '1px solid var(--border-color)', pt: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>
                Detail Transfer Bank & E-Wallet
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nama Bank (misal: BCA, Mandiri, BRI)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherForm.bankName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, bankName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Rekening Bank</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherForm.bankAccount}
                    onChange={(e) => setTeacherForm({ ...teacherForm, bankAccount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Atas Nama Rekening</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherForm.bankAccountName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, bankAccountName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pilihan E-Wallet (OVO / GoPay / DANA)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherForm.ewalletName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, ewalletName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor E-Wallet</label>
                  <input
                    type="text"
                    className="form-input"
                    value={teacherForm.ewalletNumber}
                    onChange={(e) => setTeacherForm({ ...teacherForm, ewalletNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Info QRIS / Keterangan Pembayaran Tambahan</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={teacherForm.qrisText}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qrisText: e.target.value })}
                  placeholder="Misal: NMID ID10293847561 atau Catatan Transfer"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Simpan Pengaturan Pembayaran
            </button>
          </form>
        </div>
      )}

      {/* --- STUDENT MODAL --- */}
      {isStudentModalOpen && (
        <div className="modal-overlay btn-no-print">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setIsStudentModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nama Siswa</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tingkat Kelas</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.grade}
                    onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                    placeholder="misal: Kelas 12 SMA"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">No. Telepon/WA Siswa</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Orang Tua</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">No. WA Orang Tua</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mata Pelajaran Utama</label>
                  <select
                    className="form-select"
                    value={studentForm.defaultSubjectId}
                    onChange={(e) => setStudentForm({ ...studentForm, defaultSubjectId: e.target.value })}
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap Siswa</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                />
              </div>

              {/* Rate Configuration Box */}
              <div
                className="card"
                style={{ padding: '1rem', background: 'var(--bg-secondary)', marginBottom: '1.25rem' }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                  Skema Tarif Les Siswa
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tipe Tarif</label>
                    <select
                      className="form-select"
                      value={studentForm.rateType}
                      onChange={(e) => setStudentForm({ ...studentForm, rateType: e.target.value })}
                    >
                      <option value="per_session">Per Sesi Standard (e.g. 90 Menit)</option>
                      <option value="per_hour">Per Jam (60 Menit)</option>
                      <option value="custom">Per Sesi Kustom</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nominal Tarif Dasar (Rp)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={studentForm.baseRate}
                      onChange={(e) => setStudentForm({ ...studentForm, baseRate: Number(e.target.value) })}
                      required
                    />
                  </div>

                  {studentForm.rateType !== 'per_hour' && (
                    <div className="form-group">
                      <label className="form-label">Durasi Standard (Menit)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={studentForm.sessionDurationMin}
                        onChange={(e) => setStudentForm({ ...studentForm, sessionDurationMin: Number(e.target.value) })}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsStudentModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUBJECT MODAL --- */}
      {isSubjectModalOpen && (
        <div className="modal-overlay btn-no-print">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
              </h3>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setIsSubjectModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubject}>
              <div className="form-group">
                <label className="form-label">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  className="form-input"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="misal: Matematika SMA"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Warna Kalender</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    style={{ width: '45px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                    value={subjectForm.color}
                    onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{subjectForm.color}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsSubjectModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
