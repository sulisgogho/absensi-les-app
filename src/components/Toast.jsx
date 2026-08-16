import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast || !toast.show) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#f43f5e" />,
    info: <Info size={18} color="#0284c7" />,
  };

  return (
    <div className="toast-container btn-no-print">
      <div className={`toast toast-${toast.type || 'success'}`}>
        {icons[toast.type] || icons.success}
        <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>{toast.message}</span>
      </div>
    </div>
  );
};
