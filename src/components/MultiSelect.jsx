import React, { useState, useRef, useEffect } from 'react';

export const MultiSelect = ({ options, selectedValues, onChange, placeholder = "Pilih..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map(opt => opt.value));
    }
  };

  const selectedCount = selectedValues.length;
  let displayText = placeholder;
  
  if (selectedCount > 0) {
    if (selectedCount === options.length) {
      displayText = "Semua Terpilih";
    } else if (selectedCount === 1) {
      const selectedOpt = options.find(o => o.value === selectedValues[0]);
      displayText = selectedOpt ? selectedOpt.label : placeholder;
    } else {
      displayText = `${selectedCount} Terpilih`;
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '220px' }}>
      <div 
        className="form-select" 
        style={{ 
          height: '36px', 
          fontSize: '0.85rem', 
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayText}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', flexShrink: 0 }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          maxHeight: '250px',
          overflowY: 'auto',
          padding: '8px 0'
        }}>
          <div 
            style={{ 
              padding: '6px 12px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderBottom: '1px solid var(--border-color)'
            }}
            onClick={handleSelectAll}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <input 
              type="checkbox" 
              checked={selectedValues.length === options.length && options.length > 0} 
              onChange={() => {}}
              style={{ cursor: 'pointer' }}
            />
            Pilih Semua
          </div>
          
          {options.map((opt) => (
            <div 
              key={opt.value}
              style={{ 
                padding: '6px 12px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
              }}
              onClick={() => toggleOption(opt.value)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <input 
                type="checkbox" 
                checked={selectedValues.includes(opt.value)}
                onChange={() => {}}
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
