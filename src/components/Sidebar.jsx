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
  const { activeTab, setActiveTab, attendance, students } = useApp();

  const unpaidCount = attendance.filter((a) => a.paymentStatus === 'unpaid').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
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
          <p className="sidebar-title"
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
                title={item.label}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-label" style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>

                {item.badge && (
                  <span
                    className="nav-badge"
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: item.badgeColor || 'var(--primary)',
                      color: '#fff',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
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
