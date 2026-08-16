import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  PlusCircle,
  Sun,
  Moon,
  Search,
  BookOpen,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { resetToDefaults } from '../utils/storage';

export const Navbar = () => {
  const {
    teacherInfo,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    setIsAttendanceModalOpen,
    setPrefilledAttendanceData,
    setIsScheduleModalOpen,
    setPrefilledScheduleData,
  } = useApp();

  const [theme, setTheme] = useState(
    localStorage.getItem('lesflow_theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lesflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenQuickAttendance = () => {
    setPrefilledAttendanceData(null);
    setIsAttendanceModalOpen(true);
  };

  const handleOpenQuickSchedule = () => {
    setPrefilledScheduleData(null);
    setIsScheduleModalOpen(true);
  };

  return (
    <header className="navbar btn-no-print">
      <div className="nav-brand">
        <div className="brand-icon">
          <BookOpen size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">LesFlow</span>
            <span className="brand-tag">PRO</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Absensi & Penagihan Les Privat
          </p>
        </div>
      </div>

      <div className="search-container" style={{ flex: 1, maxWidth: '400px', margin: '0 1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }}
            placeholder="Cari siswa, materi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleOpenQuickSchedule}
          title="Buat Jadwal Les Baru"
        >
          <Calendar size={16} />
          <span className="hide-mobile">+ Jadwal</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleOpenQuickAttendance}
          title="Catat Kehadiran Sesi Les"
        >
          <PlusCircle size={16} />
          <span className="hide-mobile">+ Absensi</span>
        </button>

        <button
          className="btn btn-secondary btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="btn btn-secondary btn-icon hide-mobile"
          onClick={() => {
            if (window.confirm('Reset data contoh ke default? Data yang Anda buat akan diperbarui ke sampel awal.')) {
              resetToDefaults();
            }
          }}
          title="Reset Data Sampel"
        >
          <RotateCcw size={16} />
        </button>

        <div
          className="user-profile-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-sky), var(--accent-violet))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}
          >
            {teacherInfo.name ? teacherInfo.name.charAt(0) : 'G'}
          </div>
          <div className="hide-mobile">
            <p style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.2 }}>
              {teacherInfo.name}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Pengajar Les
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
