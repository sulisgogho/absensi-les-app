import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const ScheduleModal = () => {
  const {
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    prefilledScheduleData,
    setPrefilledScheduleData,
    students,
    subjects,
    addSchedule,
    updateSchedule,
    checkScheduleConflict,
  } = useApp();

  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '15:30',
    endTime: '17:00',
    notes: '',
  });

  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    if (prefilledScheduleData) {
      setFormData({
        studentId: prefilledScheduleData.studentId || (students[0]?.id || ''),
        subjectId: prefilledScheduleData.subjectId || (subjects[0]?.id || ''),
        date: prefilledScheduleData.date || new Date().toISOString().split('T')[0],
        startTime: prefilledScheduleData.startTime || '15:30',
        endTime: prefilledScheduleData.endTime || '17:00',
        notes: prefilledScheduleData.notes || '',
      });
    } else if (students.length > 0 && subjects.length > 0) {
      setFormData((prev) => ({
        ...prev,
        studentId: prev.studentId || students[0].id,
        subjectId: prev.subjectId || subjects[0].id,
      }));
    }
  }, [prefilledScheduleData, isScheduleModalOpen, students, subjects]);

  // Real-time conflict checking when form values change
  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      const conflictResult = checkScheduleConflict(
        formData,
        prefilledScheduleData ? prefilledScheduleData.id : null
      );
      if (conflictResult.isConflict) {
        setConflictWarning(conflictResult);
      } else {
        setConflictWarning(null);
      }
    } else {
      setConflictWarning(null);
    }
  }, [formData.date, formData.startTime, formData.endTime, formData.studentId]);

  if (!isScheduleModalOpen) return null;

  const handleStudentChange = (stdId) => {
    const student = students.find((s) => s.id === stdId);
    setFormData((prev) => ({
      ...prev,
      studentId: stdId,
      subjectId: student ? student.defaultSubjectId : prev.subjectId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let success = false;
    if (prefilledScheduleData && prefilledScheduleData.id) {
      success = updateSchedule(prefilledScheduleData.id, formData);
    } else {
      success = addSchedule(formData);
    }

    if (success !== false) {
      setIsScheduleModalOpen(false);
      setPrefilledScheduleData(null);
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
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} />
            </div>
            <h3 className="modal-title">
              {prefilledScheduleData?.id ? 'Edit Jadwal Les' : 'Buat Jadwal Les Baru'}
            </h3>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              setIsScheduleModalOpen(false);
              setPrefilledScheduleData(null);
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Conflict Warning Alert */}
          {conflictWarning && (
            <div className="alert alert-warning">
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontWeight: '700', marginBottom: '2px' }}>
                  Peringatan: Potensi Jadwal Bentrok!
                </p>
                <p style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                  {conflictWarning.reason}
                </p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Pilih Siswa</label>
            <select
              className="form-select"
              value={formData.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
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
              <label className="form-label">Tanggal Pertemuan</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jam Mulai</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jam Selesai</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Rencana Materi (Opsional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Misal: Pembahasan Bab 4 Integral & Turunan"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsScheduleModalOpen(false);
                setPrefilledScheduleData(null);
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={conflictWarning && conflictWarning.isConflict}
            >
              <CheckCircle size={16} />
              <span>Simpan Jadwal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
