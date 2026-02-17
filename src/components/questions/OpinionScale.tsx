import React from 'react';
import { Question } from '../../types/form';

interface OpinionScaleProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
  error?: string;
}

export const OpinionScale: React.FC<OpinionScaleProps> = ({
  question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  const min = question.scaleMin ?? 1;
  const max = question.scaleMax ?? 10;
  const minLabel = question.scaleMinLabel || '';
  const maxLabel = question.scaleMaxLabel || '';

  const handleSelect = (n: number) => {
    onChange(n);
    setTimeout(() => onSubmit(), 400);
  };

  return (
    <div className="ff-question-input">
      <div className="ff-scale">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(n => (
          <button
            key={n}
            type="button"
            className={`ff-scale-btn ${value === n ? 'ff-scale-btn--selected' : ''}`}
            onClick={() => handleSelect(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="ff-scale-labels">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
      {error && <p className="ff-error">{error}</p>}
    </div>
  );
};
