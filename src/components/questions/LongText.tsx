import React, { useRef, useEffect } from 'react';
import { Question } from '../../types/form';

interface LongTextProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
}

export const LongText: React.FC<LongTextProps> = ({
  question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="ff-question-input">
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={question.placeholder || 'Type your answer here...'}
        className={`ff-textarea ${error ? 'ff-input--error' : ''}`}
        rows={3}
      />
      {error && <p className="ff-error">{error}</p>}
      <p className="ff-hint">
        <strong>Shift + Enter ↵</strong> for new line, <strong>Enter ↵</strong> to continue
      </p>
    </div>
  );
};
