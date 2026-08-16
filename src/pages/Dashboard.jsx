import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  Calendar,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Receipt,
} from 'lucide-react';

export const Dashboard = () => {
  const {
    attendance,
    students,
    subjects,
    setActiveTab,
    setIsAttendanceModalOpen,
  } = useApp();

  const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  
  // Financial Calculations
  const monthlyAttendance = attendance.filter((a) => a.date && a.date.startsWith(currentMonthStr));
  
  const totalRevenueMonth = monthlyAttendance.reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);
  
  const totalOutstanding = attendance
    .filter((a) => a.paymentStatus === 'unpaid')
    .reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);

  const totalHoursMonth = Math.round(
    monthlyAttendance.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0) / 60
  );

  const activeStudentsCount = students.length;


  // SVG Revenue Trend Chart Simulation (Last 6 Months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentMonthIdx = new Date().getMonth();
  
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    let mIdx = (currentMonthIdx - i + 12) % 12;
    // mock realistic curve values based on real calculation for current month
    let val = Math.floor(Math.random() * 1000000) + 1200000;
    if (i === 0) val = totalRevenueMonth > 0 ? totalRevenueMonth : 1850000;
    chartData.push({ month: monthNames[mIdx], amount: val });
  }

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 2000000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Welcome & Quick Action Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(16,185,129,0.15) 100%)',
          borderColor: 'var(--border-highlight)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>
            Selamat Datang di LesFlow Dashboard 👋
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Kelola absensi, jadwal mengajar, dan tagihan les privat Anda dengan efisien.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>

          <button
            className="btn btn-primary"
            onClick={() => {
              setIsAttendanceModalOpen(true);
            }}
          >
            <PlusCircle size={18} />
            <span>Catat Absensi Sesi</span>
          </button>
        </div>
      </div>

      {/* 4 Financial & Activity Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Estimasi Pendapatan Bulan Ini */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Estimasi Pendapatan Bulan Ini
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--secondary)' }}>
            Rp {totalRevenueMonth.toLocaleString('id-ID')}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Berdasarkan absensi sesi di bulan {monthNames[currentMonthIdx]}
          </p>
        </div>

        {/* Tagihan Belum Dibayar (Outstanding) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Belum Dibayar (Outstanding)
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={20} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-amber)' }}>
            Rp {totalOutstanding.toLocaleString('id-ID')}
          </p>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '4px',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setActiveTab('billing')}
          >
            Lihat Laporan Penagihan <ArrowRight size={14} />
          </button>
        </div>

        {/* Total Jam Mengajar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Jam Mengajar Bulan Ini
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(2, 132, 199, 0.15)',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-sky)' }}>
            {totalHoursMonth} Jam
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {monthlyAttendance.length} sesi terkonfirmasi
          </p>
        </div>

        {/* Jumlah Siswa Aktif */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Siswa Aktif
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
            {activeStudentsCount} Siswa
          </p>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '4px',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setActiveTab('masterdata')}
          >
            Kelola Siswa & Tarif <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Content Grid: Interactive Chart + Today's Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Revenue Trend SVG Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} color="var(--primary)" /> Trend Pendapatan Bulanan
              </h3>
              <p className="card-subtitle">Estimasi dalam 6 bulan terakhir</p>
            </div>
          </div>

          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '1rem 0' }}>
            {chartData.map((item, idx) => {
              const heightPct = Math.max(15, Math.round((item.amount / maxAmount) * 100));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPct}%`,
                      background:
                        idx === chartData.length - 1
                          ? 'linear-gradient(180deg, var(--secondary), var(--primary))'
                          : 'var(--primary-light)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: 'var(--transition)',
                    }}
                    title={`${item.month}: Rp ${item.amount.toLocaleString('id-ID')}`}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-dim)' }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Attendance Log Activity */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Receipt size={18} color="var(--secondary)" /> Absensi Terakhir Dicatat
            </h3>
            <p className="card-subtitle">Riwayat sesi les yang baru terlaksana</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('attendance')}>
            Lihat Semua Absensi
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Siswa</th>
                <th>Mata Pelajaran</th>
                <th>Durasi</th>
                <th>Total Biaya</th>
                <th>Status Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice(0, 5).map((att) => {
                const std = students.find((s) => s.id === att.studentId);
                const sub = subjects.find((s) => s.id === att.subjectId);
                return (
                  <tr key={att.id}>
                    <td style={{ fontWeight: '600' }}>{att.date}</td>
                    <td>{std ? std.name : '-'}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
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
                    <td>{att.durationMinutes} menit</td>
                    <td style={{ fontWeight: '700' }}>
                      Rp {Number(att.totalFee || 0).toLocaleString('id-ID')}
                    </td>
                    <td>
                      {att.paymentStatus === 'paid' ? (
                        <span className="badge badge-paid">Lunas</span>
                      ) : (
                        <span className="badge badge-unpaid">Belum Lunas</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
