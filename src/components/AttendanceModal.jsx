import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ClipboardCheck, Plus, Trash2, Calculator, CheckCircle2, DollarSign } from 'lucide-react';

export const AttendanceModal = () => {
  const {
    isAttendanceModalOpen,
    setIsAttendanceModalOpen,
    prefilledAttendanceData,
    setPrefilledAttendanceData,
    students,
    subjects,
    calculateFee,
    addAttendance,
    updateAttendance,
  } = useApp();

  const [formData, setFormData] = useState({
    scheduleId: null,
    studentId: '',
    subjectId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '15:30',
    endTime: '17:00',
    durationMinutes: 90,
    calculatedFee: 0,
    additionalFees: [],
    materiNotes: '',
    progressNotes: '',
  });

  const [newAddFeeDesc, setNewAddFeeDesc] = useState('');
  const [newAddFeeAmount, setNewAddFeeAmount] = useState('');

  useEffect(() => {
    if (prefilledAttendanceData) {
      setFormData({
        ...prefilledAttendanceData,
        additionalFees: prefilledAttendanceData.additionalFees || [],
      });
    } else if (students.length > 0 && subjects.length > 0) {
      const firstStd = students[0];
      const initialDuration = 90;
      const initialFee = calculateFee(firstStd.id, initialDuration);
      setFormData({
        scheduleId: null,
        studentId: firstStd.id,
        subjectId: firstStd.defaultSubjectId || subjects[0].id,
        date: new Date().toISOString().split('T')[0],
        startTime: '15:30',
        endTime: '17:00',
        durationMinutes: initialDuration,
        calculatedFee: initialFee,
        additionalFees: [],
        materiNotes: '',
        progressNotes: '',
      });
    }
  }, [prefilledAttendanceData, isAttendanceModalOpen, students, subjects]);

  // Recalculate fee whenever student or duration changes
  useEffect(() => {
    if (formData.studentId && formData.durationMinutes) {
      const fee = calculateFee(formData.studentId, formData.durationMinutes);
      setFormData((prev) => ({ ...prev, calculatedFee: fee }));
    }
  }, [formData.studentId, formData.durationMinutes]);

  if (!isAttendanceModalOpen) return null;

  const handleStudentSelect = (stdId) => {
    const student = students.find((s) => s.id === stdId);
    const fee = calculateFee(stdId, formData.durationMinutes);
    setFormData((prev) => ({
      ...prev,
      studentId: stdId,
      subjectId: student?.defaultSubjectId || prev.subjectId,
      calculatedFee: fee,
    }));
  };

  const handleAddAdditionalFee = () => {
    if (!newAddFeeDesc.trim() || !newAddFeeAmount) return;
    const amount = Number(newAddFeeAmount) || 0;
    const newItem = {
      id: `add-${Date.now()}`,
      description: newAddFeeDesc.trim(),
      amount: amount,
    };
    setFormData((prev) => ({
      ...prev,
      additionalFees: [...prev.additionalFees, newItem],
    }));
    setNewAddFeeDesc('');
    setNewAddFeeAmount('');
  };

  const handleRemoveAdditionalFee = (addId) => {
    setFormData((prev) => ({
      ...prev,
      additionalFees: prev.additionalFees.filter((item) => item.id !== addId),
    }));
  };

  const sumAdditionalFees = formData.additionalFees.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalFee = (Number(formData.calculatedFee) || 0) + sumAdditionalFees;

  const selectedStudent = students.find((s) => s.id === formData.studentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      calculatedFee: Number(formData.calculatedFee) || 0,
      totalFee: totalFee,
    };

    let ok = false;
    if (prefilledAttendanceData && prefilledAttendanceData.id) {
      ok = updateAttendance(prefilledAttendanceData.id, finalData);
    } else {
      ok = addAttendance(finalData);
    }

    if (ok) {
      setIsAttendanceModalOpen(false);
      setPrefilledAttendanceData(null);
    }
  };

  return (
    <div className="modal-overlay btn-no-print">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ClipboardCheck size={20} />
            </div>
            <h3 className="modal-title">
              {prefilledAttendanceData?.id ? 'Edit Absensi Les' : 'Pencatatan Kehadiran (Absensi Harian)'}
            </h3>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              setIsAttendanceModalOpen(false);
              setPrefilledAttendanceData(null);
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Siswa</label>
            <select
              className="form-select"
              value={formData.studentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
            {selectedStudent && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Tarif dasar:{' '}
                {selectedStudent.rateType === 'per_session' && `Rp ${selectedStudent.baseRate?.toLocaleString('id-ID')} / ${selectedStudent.sessionDurationMin} menit`}
                {selectedStudent.rateType === 'per_hour' && `Rp ${selectedStudent.baseRate?.toLocaleString('id-ID')} / jam`}
                {selectedStudent.rateType === 'custom' && `Rp ${selectedStudent.baseRate?.toLocaleString('id-ID')} (Kustom Sesi)`}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mata Pelajaran</label>
            <select
              className="form-select"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tanggal Mengajar</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Durasi Mengajar Aktual (Menit)</label>
              <input
                type="number"
                min="15"
                step="15"
                className="form-input"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Fee Breakdown Box */}
          <div
            className="card"
            style={{
              padding: '1rem',
              marginBottom: '1.25rem',
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-highlight)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calculator size={16} /> Biaya Sesi Dasar (Otomatis)
              </span>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary)' }}>
                Rp {Number(formData.calculatedFee || 0).toLocaleString('id-ID')}
              </span>
            </div>

            {/* Additional Expenses Section */}
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
              <label className="form-label" style={{ marginBottom: '6px' }}>
                Biaya Tambahan (Opsional: Transport, Buku Modul, Fotokopi)
              </label>

              {formData.additionalFees.map((fee) => (
                <div
                  key={fee.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{fee.description}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600' }}>+ Rp {Number(fee.amount).toLocaleString('id-ID')}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                      onClick={() => handleRemoveAdditionalFee(fee.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.8rem', height: '34px' }}
                  placeholder="Keterangan (mis: Uang Transport)"
                  value={newAddFeeDesc}
                  onChange={(e) => setNewAddFeeDesc(e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: '0.8rem', height: '34px', width: '130px' }}
                  placeholder="Biaya (Rp)"
                  value={newAddFeeAmount}
                  onChange={(e) => setNewAddFeeAmount(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ height: '34px', padding: '0 10px' }}
                  onClick={handleAddAdditionalFee}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Total Tagihan Sesi Ini:</span>
              <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--secondary)' }}>
                Rp {totalFee.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Materi yang Diajarkan</label>
            <input
              type="text"
              className="form-input"
              placeholder="Misal: Pembahasan Soal Vektor & Matriks 3x3"
              value={formData.materiNotes}
              onChange={(e) => setFormData({ ...formData, materiNotes: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Perkembangan Siswa (Opsional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Misal: Siswa sudah paham materi dasar, perlu penajaman di soal cerita."
              value={formData.progressNotes}
              onChange={(e) => setFormData({ ...formData, progressNotes: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAttendanceModalOpen(false);
                setPrefilledAttendanceData(null);
              }}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-success">
              <CheckCircle2 size={16} />
              <span>Simpan Absensi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
