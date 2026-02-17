import React from 'react';
import { Question } from '../../types/form';

interface YesNoProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
}

export const YesNo: React.FC<YesNoProps> = ({
  question: _question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  void _question;
  const handleSelect = (answer: string) => {
    onChange(answer);
    setTimeout(() => onSubmit(), 400);
  };

  return (
    <div className="ff-question-input">
      <div className="ff-choices ff-choices--horizontal">
        <button
          type="button"
          className={`ff-choice ff-choice--yesno ${value === 'yes' ? 'ff-choice--selected' : ''}`}
          onClick={() => handleSelect('yes')}
        >
          <span className="ff-choice-letter">Y</span>
          <span className="ff-choice-label">Yes</span>
        </button>
        <button
          type="button"
          className={`ff-choice ff-choice--yesno ${value === 'no' ? 'ff-choice--selected' : ''}`}
          onClick={() => handleSelect('no')}
        >
          <span className="ff-choice-letter">N</span>
          <span className="ff-choice-label">No</span>
        </button>
      </div>
      {error && <p className="ff-error">{error}</p>}
      <p className="ff-hint">
        Press <strong>Y</strong> for Yes, <strong>N</strong> for No
      </p>
    </div>
  );
};
