import React from 'react';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  showPrev: boolean;
  showNext: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  showPrev,
  showNext,
}) => {
  return (
    <div className="ff-nav">
      {showPrev && (
        <button
          type="button"
          className="ff-nav-btn"
          onClick={onPrev}
          aria-label="Previous question"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
      {showNext && (
        <button
          type="button"
          className="ff-nav-btn"
          onClick={onNext}
          aria-label="Next question"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
};
