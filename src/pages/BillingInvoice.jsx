import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Filter,
  DollarSign,
  Calendar,
  Send,
  Download,
  Building,
  UserCheck,
  X,
  CreditCard,
} from 'lucide-react';

export const BillingInvoice = () => {
  const {
    attendance,
    students,
    subjects,
    teacherInfo,
    togglePaymentStatus,
    markMultipleAsPaid,
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'paid' | 'unpaid'
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Active Invoice Modal State for Previewing & Printing
  const [invoiceModalStudent, setInvoiceModalStudent] = useState(null);

  // Filter attendance items
  const filteredItems = attendance.filter((att) => {
    if (selectedStudentId !== 'all' && att.studentId !== selectedStudentId) return false;
    if (selectedStatus !== 'all' && att.paymentStatus !== selectedStatus) return false;
    if (dateStart && att.date < dateStart) return false;
    if (dateEnd && att.date > dateEnd) return false;
    return true;
  });

  const totalOutstanding = filteredItems
    .filter((a) => a.paymentStatus === 'unpaid')
    .reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);

  const totalPaid = filteredItems
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);

  const grandTotal = totalOutstanding + totalPaid;

  // Generate WhatsApp Share Message Link
  const handleShareWhatsApp = (student, items) => {
    if (!student || items.length === 0) return;

    const studentUnpaidItems = items.filter((i) => i.paymentStatus === 'unpaid');
    const targetItems = studentUnpaidItems.length > 0 ? studentUnpaidItems : items;

    const studentTotal = targetItems.reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);

    let msg = `*TAGIHAN LES PRIVAT - ${teacherInfo.name.toUpperCase()}*\n`;
    msg += `----------------------------------------\n`;
    msg += `*Kepada Yth:* ${student.parentName || student.name}\n`;
    msg += `*Siswa:* ${student.name} (${student.grade})\n`;
    msg += `*Periode Tagihan:* ${targetItems[targetItems.length - 1]?.date} s/d ${targetItems[0]?.date}\n\n`;
    msg += `*Rincian Sesi Les:*\n`;

    targetItems.forEach((att, idx) => {
      const sub = subjects.find((s) => s.id === att.subjectId);
      msg += `${idx + 1}. ${att.date} (${att.durationMinutes}m) - ${sub?.name || 'Les'}\n`;
      msg += `   • Biaya: Rp ${Number(att.totalFee).toLocaleString('id-ID')}\n`;
    });

    msg += `\n*TOTAL TAGIHAN: Rp ${studentTotal.toLocaleString('id-ID')}*\n`;
    msg += `----------------------------------------\n`;
    msg += `*Informasi Pembayaran / Transfer:*\n`;
    if (teacherInfo.bankName && teacherInfo.bankAccount) {
      msg += `🏦 ${teacherInfo.bankName}: *${teacherInfo.bankAccount}* a.n. ${teacherInfo.bankAccountName}\n`;
    }
    if (teacherInfo.ewalletName && teacherInfo.ewalletNumber) {
      msg += `📱 ${teacherInfo.ewalletName}: *${teacherInfo.ewalletNumber}*\n`;
    }
    if (teacherInfo.qrisText) {
      msg += `📌 QRIS: ${teacherInfo.qrisText}\n`;
    }
    msg += `\nMohon konfirmasi jika sudah melakukan pembayaran. Terima kasih banyak! 🙏`;

    const phoneNum = student.parentPhone || student.phone || '';
    const cleanPhone = phoneNum.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Open Printable Invoice Modal
  const handleOpenInvoiceModal = (student) => {
    setInvoiceModalStudent(student);
  };

  const invoiceStudentItems = invoiceModalStudent
    ? attendance.filter((a) => a.studentId === invoiceModalStudent.id)
    : [];

  const invoiceTotal = invoiceStudentItems.reduce((acc, curr) => acc + (Number(curr.totalFee) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="card btn-no-print" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Laporan Tagihan & Invoicing</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Kelola penagihan les privat, cetak kwitansi invoice PDF, dan bagikan rincian via WhatsApp.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: '180px', height: '36px', fontSize: '0.85rem', padding: '0 8px' }}
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
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
              style={{ width: '170px', height: '36px', fontSize: '0.85rem', padding: '0 8px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="unpaid">Belum Lunas</option>
              <option value="paid">Sudah Lunas</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dari:</span>
            <input
              type="date"
              className="form-input"
              style={{ width: '140px', height: '36px', fontSize: '0.8rem', padding: '0 6px' }}
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>s/d:</span>
            <input
              type="date"
              className="form-input"
              style={{ width: '140px', height: '36px', fontSize: '0.8rem', padding: '0 6px' }}
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Financial Summary Strip */}
      <div className="btn-no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Belum Lunas (Outstanding)</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '4px' }}>
            Rp {totalOutstanding.toLocaleString('id-ID')}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Terbayar Lunas</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
            Rp {totalPaid.toLocaleString('id-ID')}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Keseluruhan Tagihan</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            Rp {grandTotal.toLocaleString('id-ID')}
          </h3>
        </div>
      </div>

      {/* Student Billing Cards & Invoice Action Bar */}
      <div className="btn-no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {students
          .filter((s) => selectedStudentId === 'all' || s.id === selectedStudentId)
          .map((std) => {
            const stdItems = filteredItems.filter((item) => item.studentId === std.id);
            if (stdItems.length === 0) return null;

            const stdUnpaid = stdItems
              .filter((i) => i.paymentStatus === 'unpaid')
              .reduce((a, c) => a + (Number(c.totalFee) || 0), 0);

            const stdPaid = stdItems
              .filter((i) => i.paymentStatus === 'paid')
              .reduce((a, c) => a + (Number(c.totalFee) || 0), 0);

            return (
              <div key={std.id} className="card">
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 className="card-title" style={{ fontSize: '1.2rem' }}>
                        {std.name}
                      </h3>
                      <span className="badge badge-scheduled">{std.grade}</span>
                      {stdUnpaid > 0 ? (
                        <span className="badge badge-unpaid">Outstanding: Rp {stdUnpaid.toLocaleString('id-ID')}</span>
                      ) : (
                        <span className="badge badge-paid">Semua Lunas</span>
                      )}
                    </div>
                    <p className="card-subtitle" style={{ marginTop: '2px' }}>
                      Orang Tua: {std.parentName || '-'} ({std.parentPhone || std.phone || '-'})
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {stdUnpaid > 0 && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          const unpaidIds = stdItems.filter((i) => i.paymentStatus === 'unpaid').map((i) => i.id);
                          markMultipleAsPaid(unpaidIds);
                        }}
                      >
                        <CheckCircle2 size={14} /> Tandai Semua Lunas
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleShareWhatsApp(std, stdItems)}
                      title="Kirim Penagihan ke WA Orang Tua"
                    >
                      <Send size={14} /> Kirim Tagihan WA
                    </button>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleOpenInvoiceModal(std)}
                      title="Preview & Cetak Kwitansi Invoice PDF"
                    >
                      <Printer size={14} /> Lihat Invoice / Cetak PDF
                    </button>
                  </div>
                </div>

                {/* Session Breakdown Table for Student */}
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Mata Pelajaran</th>
                        <th>Durasi</th>
                        <th>Rincian Biaya Sesi</th>
                        <th>Status Pembayaran</th>
                        <th style={{ textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stdItems.map((att) => {
                        const sub = subjects.find((s) => s.id === att.subjectId);
                        return (
                          <tr key={att.id}>
                            <td style={{ fontWeight: '600' }}>{att.date}</td>
                            <td>{sub ? sub.name : '-'}</td>
                            <td>{att.durationMinutes}m</td>
                            <td>
                              <span style={{ fontWeight: '700' }}>
                                Rp {Number(att.totalFee).toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td>
                              {att.paymentStatus === 'paid' ? (
                                <span className="badge badge-paid">Lunas</span>
                              ) : (
                                <span className="badge badge-unpaid">Belum Lunas</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => togglePaymentStatus(att.id)}
                              >
                                {att.paymentStatus === 'paid' ? 'Batal Lunas' : 'Tandai Lunas'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>

      {/* --- INVOICE PRINT / PDF MODAL --- */}
      {invoiceModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', background: '#ffffff', color: '#0f172a' }}>
            <div className="modal-header btn-no-print" style={{ borderColor: '#e2e8f0' }}>
              <h3 className="modal-title" style={{ color: '#0f172a' }}>
                Preview Invoice Tagihan - {invoiceModalStudent.name}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={16} /> Cetak / Simpan PDF
                </button>
                <button
                  className="btn btn-secondary btn-icon btn-sm"
                  onClick={() => setInvoiceModalStudent(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="invoice-printable" style={{ padding: '1.5rem', background: '#fff', color: '#000' }}>
              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5' }}>
                    {teacherInfo.name}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>{teacherInfo.title}</p>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>WhatsApp: {teacherInfo.phone} | Email: {teacherInfo.email}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>INVOICE TAGIHAN</h3>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>No: INV/{new Date().getFullYear()}/{invoiceModalStudent.id.toUpperCase()}</p>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Student & Bill Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Tagihan Kepada:</p>
                  <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>{invoiceModalStudent.name}</p>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>Kelas: {invoiceModalStudent.grade}</p>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>Orang Tua: {invoiceModalStudent.parentName || '-'}</p>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>Alamat: {invoiceModalStudent.address || '-'}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Status Pembayaran:</p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      background: invoiceStudentItems.some((i) => i.paymentStatus === 'unpaid') ? '#fef3c7' : '#d1fae5',
                      color: invoiceStudentItems.some((i) => i.paymentStatus === 'unpaid') ? '#d97706' : '#059669',
                      marginTop: '4px',
                    }}
                  >
                    {invoiceStudentItems.some((i) => i.paymentStatus === 'unpaid') ? 'BELUM LUNAS' : 'LUNAS'}
                  </span>
                </div>
              </div>

              {/* Invoice Breakdown Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>No</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Tanggal</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Mata Pelajaran</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Durasi</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Biaya Sesi</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceStudentItems.map((item, idx) => {
                    const sub = subjects.find((s) => s.id === item.subjectId);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px' }}>{idx + 1}</td>
                        <td style={{ padding: '8px 10px' }}>{item.date}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <strong style={{ color: '#0f172a' }}>{sub?.name || 'Les'}</strong>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>{item.durationMinutes}m</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '700' }}>
                          Rp {Number(item.totalFee).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total & Payment Method Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '1rem', borderTop: '2px solid #0f172a' }}>
                <div style={{ maxWidth: '400px', fontSize: '0.82rem', color: '#334155' }}>
                  <p style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px', color: '#0f172a' }}>
                    Informasi Rekening Pembayaran:
                  </p>
                  {teacherInfo.bankName && <p>• <strong>{teacherInfo.bankName}:</strong> {teacherInfo.bankAccount} a.n. {teacherInfo.bankAccountName}</p>}
                  {teacherInfo.ewalletName && <p>• <strong>{teacherInfo.ewalletName}:</strong> {teacherInfo.ewalletNumber}</p>}
                  {teacherInfo.qrisText && <p>• <strong>QRIS:</strong> {teacherInfo.qrisText}</p>}
                  <p style={{ marginTop: '6px', fontStyle: 'italic', color: '#64748b' }}>
                    {teacherInfo.notes}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', color: '#475569' }}>Total Sesi Les: {invoiceStudentItems.length} Pertemuan</p>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#4f46e5', marginTop: '6px' }}>
                    TOTAL: Rp {invoiceTotal.toLocaleString('id-ID')}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
