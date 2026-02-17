import { useEffect, useCallback } from 'react';
import { Question } from '../types/form';

interface UseKeyboardNavOptions {
  currentQuestion: Question;
  onNext: () => boolean | void;
  onPrev: () => boolean | void;
  onSelect?: (index: number) => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  currentQuestion,
  onNext,
  onPrev,
  onSelect,
  enabled = true,
}: UseKeyboardNavOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't intercept when typing in inputs (unless Enter)
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      switch (e.key) {
        case 'Enter':
          // In textareas, Shift+Enter is newline, Enter alone submits
          if (tag === 'TEXTAREA' && !e.shiftKey) {
            // Let Shift+Enter work normally in textarea
            return;
          }
          if (tag === 'TEXTAREA' && e.shiftKey) {
            return; // Allow newlines
          }
          e.preventDefault();
          onNext();
          break;

        case 'ArrowDown':
          if (!isInput) {
            e.preventDefault();
            onNext();
          }
          break;

        case 'ArrowUp':
          if (!isInput) {
            e.preventDefault();
            onPrev();
          }
          break;

        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            onPrev();
          } else {
            onNext();
          }
          break;

        default:
          // Letter shortcuts for multiple choice (A, B, C, D...)
          if (
            onSelect &&
            currentQuestion.type === 'multiple-choice' &&
            currentQuestion.choices &&
            !isInput
          ) {
            const letterIndex = e.key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
            if (letterIndex >= 0 && letterIndex < currentQuestion.choices.length) {
              e.preventDefault();
              onSelect(letterIndex);
            }
          }
          break;
      }
    },
    [enabled, currentQuestion, onNext, onPrev, onSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
