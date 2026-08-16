import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  Receipt,
  Users,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, attendance, schedules, students } = useApp();

  const unpaidCount = attendance.filter((a) => a.paymentStatus === 'unpaid').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayScheduleCount = schedules.filter((s) => s.date === todayStr && s.status !== 'cancelled').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calendar',
      label: 'Jadwal & Kalender',
      icon: Calendar,
      badge: todayScheduleCount > 0 ? `${todayScheduleCount} Hari Ini` : null,
      badgeColor: 'var(--accent-sky)',
    },
    {
      id: 'attendance',
      label: 'Pencatatan Absensi',
      icon: ClipboardCheck,
      badge: null,
    },
    {
      id: 'billing',
      label: 'Laporan & Tagihan',
      icon: Receipt,
      badge: unpaidCount > 0 ? `${unpaidCount} Belum Lunas` : null,
      badgeColor: 'var(--accent-amber)',
    },
    {
      id: 'masterdata',
      label: 'Data Master & Tarif',
      icon: Users,
      badge: `${students.length} Siswa`,
      badgeColor: 'var(--primary)',
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar btn-no-print">
        <div className="nav-group">
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              letterSpacing: '0.08em',
              padding: '0 0.5rem 0.5rem 0.5rem',
            }}
          >
            Menu Utama
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255,255,255,0.2)' : item.badgeColor || 'var(--primary-light)',
                      color: isActive ? '#fff' : item.badgeColor ? '#fff' : 'var(--primary)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="card"
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.05))',
            borderColor: 'var(--border-highlight)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={18} color="var(--secondary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Penyimpanan Lokal</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Data tersimpan aman di browser Anda. Tidak ada risiko kebocoran data.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav btn-no-print">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
};
