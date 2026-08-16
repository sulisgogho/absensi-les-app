import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardCheck,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';

export const AttendanceLog = () => {
  const {
    attendance,
    students,
    subjects,
    setIsAttendanceModalOpen,
    setPrefilledAttendanceData,
    deleteAttendance,
    togglePaymentStatus,
  } = useApp();

  const [studentFilter, setStudentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'paid' | 'unpaid'

  const filteredAttendance = attendance.filter((att) => {
    if (studentFilter !== 'all' && att.studentId !== studentFilter) return false;
    if (statusFilter !== 'all' && att.paymentStatus !== statusFilter) return false;
    return true;
  });

  const totalCalculatedFees = filteredAttendance.reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);
  const totalMinutes = filteredAttendance.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Pencatatan Kehadiran (Absensi Harian)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Riwayat pelaksanaan les, durasi aktual, & kalkulasi biaya otomatis.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setPrefilledAttendanceData(null);
              setIsAttendanceModalOpen(true);
            }}
          >
            <PlusCircle size={18} /> Catat Absensi Baru
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: '180px', height: '36px', fontSize: '0.85rem', padding: '0 8px' }}
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              <option value="all">Semua Siswa</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              className="form-select"
              style={{ width: '180px', height: '36px', fontSize: '0.85rem', padding: '0 8px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status Pembayaran</option>
              <option value="paid">Hanya Lunas</option>
              <option value="unpaid">Hanya Belum Lunas</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Terpilih: <strong>{filteredAttendance.length} Sesi</strong> ({Math.round(totalMinutes / 60)} Jam)
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--secondary)' }}>
              Rp {totalCalculatedFees.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tanggal Pertemuan</th>
                <th>Siswa & Grade</th>
                <th>Mata Pelajaran</th>
                <th>Durasi Aktual</th>
                <th>Total Biaya</th>
                <th>Status Pembayaran</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Belum ada data absensi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((att) => {
                  const std = students.find((s) => s.id === att.studentId);
                  const sub = subjects.find((s) => s.id === att.subjectId);

                  return (
                    <tr key={att.id}>
                      <td style={{ fontWeight: '700' }}>{att.date}</td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{std ? std.name : '-'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{std?.grade}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: sub ? `${sub.color}22` : 'var(--primary-light)',
                            color: sub?.color || 'var(--primary)',
                            fontWeight: '700',
                            fontSize: '0.78rem',
                          }}
                        >
                          {sub ? sub.name : '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                          <Clock size={14} color="var(--accent-sky)" /> {att.durationMinutes} Menit
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '800', color: 'var(--secondary)' }}>
                          Rp {Number(att.totalFee || 0).toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          onClick={() => togglePaymentStatus(att.id)}
                          title="Klik untuk ubah status Lunas / Belum Lunas"
                        >
                          {att.paymentStatus === 'paid' ? (
                            <span className="badge badge-paid">✓ Lunas</span>
                          ) : (
                            <span className="badge badge-unpaid">! Belum Lunas</span>
                          )}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              setPrefilledAttendanceData(att);
                              setIsAttendanceModalOpen(true);
                            }}
                            title="Edit Data Absensi"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              if (window.confirm('Hapus data absensi ini?')) {
                                deleteAttendance(att.id);
                              }
                            }}
                            title="Hapus Absensi"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
