import React, { useRef, useEffect } from 'react';
import { Question } from '../../types/form';

interface ShortTextProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
}

export const ShortText: React.FC<ShortTextProps> = ({
  question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const inputType = question.type === 'email' ? 'email'
    : question.type === 'phone' ? 'tel'
    : question.type === 'url' ? 'url'
    : question.type === 'number' ? 'number'
    : 'text';

  return (
    <div className="ff-question-input">
      <input
        ref={inputRef}
        type={inputType}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={question.placeholder || 'Type your answer here...'}
        className={`ff-input ${error ? 'ff-input--error' : ''}`}
        autoComplete={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'off'}
      />
      {error && <p className="ff-error">{error}</p>}
      <p className="ff-hint">
        Press <strong>Enter ↵</strong> to continue
      </p>
    </div>
  );
};
