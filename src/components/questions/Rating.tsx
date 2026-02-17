import React, { useState } from 'react';
import { Question } from '../../types/form';

interface RatingProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
  error?: string;
}

export const Rating: React.FC<RatingProps> = ({
  question,
  value,
  onChange,
  onSubmit,
  error,
}) => {
  const max = question.ratingMax || 5;
  const [hovered, setHovered] = useState<number | null>(null);

  const handleSelect = (rating: number) => {
    onChange(rating);
    setTimeout(() => onSubmit(), 500);
  };

  return (
    <div className="ff-question-input">
      <div className="ff-rating">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => {
          const isActive = (hovered !== null ? n <= hovered : n <= (value || 0));
          return (
            <button
              key={n}
              type="button"
              className={`ff-rating-star ${isActive ? 'ff-rating-star--active' : ''}`}
              onClick={() => handleSelect(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Rate ${n} out of ${max}`}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={isActive ? 'var(--ff-accent)' : 'none'}
                stroke={isActive ? 'var(--ff-accent)' : 'var(--ff-text-secondary)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          );
        })}
      </div>
      {error && <p className="ff-error">{error}</p>}
    </div>
  );
};
