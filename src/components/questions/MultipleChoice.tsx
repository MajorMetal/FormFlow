import React, { useCallback } from 'react';
import { Question } from '../../types/form';

interface MultipleChoiceProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onSubmit: () => void;
  error?: string;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  const choices = question.choices || [];
  const isMulti = question.multiSelect;

  const selectedArray: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = useCallback(
    (choiceId: string) => {
      if (isMulti) {
        const next = selectedArray.includes(choiceId)
          ? selectedArray.filter(id => id !== choiceId)
          : [...selectedArray, choiceId];
        onChange(next);
      } else {
        onChange(choiceId);
        // Auto-advance after single select (slight delay for visual feedback)
        setTimeout(() => onSubmit(), 400);
      }
    },
    [isMulti, selectedArray, onChange, onSubmit]
  );

  const getLetter = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="ff-question-input">
      <div className="ff-choices">
        {choices.map((choice, index) => {
          const isSelected = selectedArray.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              className={`ff-choice ${isSelected ? 'ff-choice--selected' : ''}`}
              onClick={() => handleSelect(choice.id)}
            >
              <span className="ff-choice-letter">{getLetter(index)}</span>
              <span className="ff-choice-label">{choice.label}</span>
              {isSelected && (
                <span className="ff-choice-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="ff-error">{error}</p>}
      {isMulti && selectedArray.length > 0 && (
        <button type="button" className="ff-btn ff-btn--primary" onClick={onSubmit} style={{ marginTop: '16px' }}>
          OK
          <span className="ff-btn-hint">press Enter ↵</span>
        </button>
      )}
      {!isMulti && (
        <p className="ff-hint" style={{ marginTop: '12px' }}>
          Press <strong>A</strong>, <strong>B</strong>, <strong>C</strong>... or click to select
        </p>
      )}
    </div>
  );
};
