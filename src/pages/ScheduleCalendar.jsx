import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
  Edit2,
  Filter,
} from 'lucide-react';

export const ScheduleCalendar = () => {
  const {
    schedules,
    students,
    subjects,
    setIsScheduleModalOpen,
    setPrefilledScheduleData,
    openAttendanceForSchedule,
    deleteSchedule,
  } = useApp();

  const [viewMode, setViewMode] = useState('month'); // 'month' | 'list'
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');

  // Month navigation state
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter schedules
  const filteredSchedules = schedules.filter((s) => {
    if (selectedStudentFilter !== 'all' && s.studentId !== selectedStudentFilter) {
      return false;
    }
    return true;
  });

  // Calendar cells generation
  const calendarDays = [];
  // Padding for previous month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ type: 'empty', id: `empty-${i}` });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySchedules = filteredSchedules.filter((s) => s.date === dayStr);

    calendarDays.push({
      type: 'day',
      dayNumber: day,
      dateStr: dayStr,
      schedules: daySchedules,
      isToday: dayStr === new Date().toISOString().split('T')[0],
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Manajemen Jadwal & Kalender Les</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Pantau ketersediaan slot waktu, cegah jadwal bentrok, dan catat absensi dengan 1-klik.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setPrefilledScheduleData(null);
                setIsScheduleModalOpen(true);
              }}
            >
              <Plus size={16} /> Buat Jadwal Les
            </button>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-icon" onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', minWidth: '180px', textAlign: 'center' }}>
              {monthNames[month]} {year}
            </span>
            <button className="btn btn-secondary btn-icon" onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleToday}>
              Hari Ini
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="form-select"
                style={{ width: '180px', height: '36px', fontSize: '0.85rem', padding: '0 8px' }}
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
              >
                <option value="all">Semua Siswa</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <button
                className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : ''}`}
                style={{ height: '30px', padding: '0 12px', background: viewMode === 'month' ? undefined : 'transparent' }}
                onClick={() => setViewMode('month')}
              >
                Tampilan Kalender
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
                style={{ height: '30px', padding: '0 12px', background: viewMode === 'list' ? undefined : 'transparent' }}
                onClick={() => setViewMode('list')}
              >
                Daftar List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY CALENDAR VIEW */}
      {viewMode === 'month' && (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: '700px' }}>
            {/* Day Names Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div>Minggu</div>
              <div>Senin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Kamis</div>
              <div>Jumat</div>
              <div>Sabtu</div>
            </div>

            {/* Calendar Grid Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {calendarDays.map((cell, idx) => {
                if (cell.type === 'empty') {
                  return (
                    <div
                      key={cell.id}
                      style={{
                        minHeight: '110px',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px dashed rgba(255,255,255,0.03)',
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={cell.dateStr}
                    style={{
                      minHeight: '120px',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      background: cell.isToday ? 'var(--primary-light)' : 'var(--bg-secondary)',
                      border: cell.isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontWeight: cell.isToday ? '800' : '600',
                          fontSize: '0.85rem',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: cell.isToday ? 'var(--primary)' : 'transparent',
                          color: cell.isToday ? '#fff' : 'var(--text-main)',
                        }}
                      >
                        {cell.dayNumber}
                      </span>

                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title="Buat Jadwal Tanggal Ini"
                        onClick={() => {
                          setPrefilledScheduleData({ date: cell.dateStr });
                          setIsScheduleModalOpen(true);
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Daily Schedule Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                      {cell.schedules.map((sch) => {
                        const std = students.find((s) => s.id === sch.studentId);
                        const sub = subjects.find((s) => s.id === sch.subjectId);
                        const isCompleted = sch.status === 'completed';

                        return (
                          <div
                            key={sch.id}
                            style={{
                              padding: '4px 6px',
                              borderRadius: 'var(--radius-sm)',
                              background: sub ? `${sub.color}25` : 'var(--primary-light)',
                              borderLeft: `3px solid ${sub?.color || 'var(--primary)'}`,
                              fontSize: '0.73rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              if (!isCompleted) {
                                openAttendanceForSchedule(sch);
                              }
                            }}
                            title={`Klik untuk konversi ke absensi: ${std?.name} (${sch.startTime}-${sch.endTime})`}
                          >
                            <div style={{ fontWeight: '700', color: sub?.color || 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {std ? std.name.split(' ')[0] : 'Siswa'}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              {sch.startTime} • {isCompleted ? '✓ Absen' : 'Jadwal'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
            })}
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daftar Jadwal Mengajar Terjadwal</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tanggal & Jam</th>
                  <th>Siswa</th>
                  <th>Mata Pelajaran</th>
                  <th>Catatan Pertemuan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((sch) => {
                  const std = students.find((s) => s.id === sch.studentId);
                  const sub = subjects.find((s) => s.id === sch.subjectId);
                  const isCompleted = sch.status === 'completed';

                  return (
                    <tr key={sch.id}>
                      <td style={{ fontWeight: '600' }}>
                        <div>{sch.date}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {sch.startTime} - {sch.endTime}
                        </div>
                      </td>
                      <td style={{ fontWeight: '700' }}>{std ? std.name : '-'}</td>
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
                      <td style={{ fontSize: '0.85rem' }}>{sch.notes || '-'}</td>
                      <td>
                        {isCompleted ? (
                          <span className="badge badge-paid">
                            <CheckCircle2 size={12} /> Absen Selesai
                          </span>
                        ) : (
                          <span className="badge badge-scheduled">Terjadwal</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {!isCompleted && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => openAttendanceForSchedule(sch)}
                              title="Konversi Langsung Jadi Data Absensi"
                            >
                              <PlusCircle size={14} /> Absen Sesi Ini
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              setPrefilledScheduleData(sch);
                              setIsScheduleModalOpen(true);
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => {
                              if (window.confirm('Hapus jadwal ini?')) {
                                deleteSchedule(sch.id);
                              }
                            }}
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
    </div>
  );
};
