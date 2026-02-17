import { useState, useCallback, useMemo } from 'react';
import { FormConfig, FormStatus } from '../types/form';
import { validateAnswer } from '../utils/validators';

export interface FormState {
  currentIndex: number;
  answers: Record<string, string | string[] | number>;
  errors: Record<string, string>;
  status: FormStatus;
  direction: 1 | -1;
}

export function useFormState(config: FormConfig) {
  const [state, setState] = useState<FormState>({
    currentIndex: 0,
    answers: {},
    errors: {},
    status: 'idle',
    direction: 1,
  });

  const totalQuestions = config.questions.length;
  const currentQuestion = config.questions[state.currentIndex];

  const progress = useMemo(() => {
    const answerable = config.questions.filter(
      q => q.type !== 'welcome' && q.type !== 'end'
    ).length;
    const answered = config.questions.filter(
      q => q.type !== 'welcome' && q.type !== 'end' && state.answers[q.id] !== undefined
    ).length;
    return answerable > 0 ? answered / answerable : 0;
  }, [config.questions, state.answers]);

  const setAnswer = useCallback((questionId: string, value: string | string[] | number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
      errors: { ...prev.errors, [questionId]: '' },
    }));
  }, []);

  const goNext = useCallback(() => {
    const q = config.questions[state.currentIndex];

    // Validate current answer (skip for welcome/end screens)
    if (q.type !== 'welcome' && q.type !== 'end') {
      const error = validateAnswer(q, state.answers[q.id]);
      if (error) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [q.id]: error },
        }));
        return false;
      }
    }

    if (state.currentIndex < totalQuestions - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        direction: 1,
      }));
      return true;
    }
    return false;
  }, [config.questions, state.currentIndex, state.answers, totalQuestions]);

  const goPrev = useCallback(() => {
    if (state.currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        direction: -1,
      }));
      return true;
    }
    return false;
  }, [state.currentIndex]);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setState(prev => ({
        ...prev,
        currentIndex: index,
        direction: index > prev.currentIndex ? 1 : -1,
      }));
    }
  }, [totalQuestions]);

  const setStatus = useCallback((status: FormStatus) => {
    setState(prev => ({ ...prev, status }));
  }, []);

  const submit = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'submitting' }));

    const payload = {
      formId: config.id,
      answers: state.answers,
      submittedAt: new Date().toISOString(),
    };

    try {
      if (config.settings?.submitUrl) {
        const res = await fetch(config.settings.submitUrl, {
          method: config.settings.submitMethod || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      }
      setState(prev => ({ ...prev, status: 'submitted' }));

      // Navigate to end screen if there is one
      const endIdx = config.questions.findIndex(q => q.type === 'end');
      if (endIdx !== -1) {
        setState(prev => ({
          ...prev,
          currentIndex: endIdx,
          direction: 1,
          status: 'submitted',
        }));
      }

      if (config.settings?.redirectUrl) {
        setTimeout(() => {
          window.location.href = config.settings!.redirectUrl!;
        }, 2000);
      }

      return payload;
    } catch {
      setState(prev => ({ ...prev, status: 'error' }));
      return null;
    }
  }, [config, state.answers]);

  // Calculate the question number (excluding welcome/end screens)
  const questionNumber = useMemo(() => {
    let num = 0;
    for (let i = 0; i <= state.currentIndex; i++) {
      const q = config.questions[i];
      if (q.type !== 'welcome' && q.type !== 'end') num++;
    }
    return num;
  }, [config.questions, state.currentIndex]);

  const totalAnswerable = useMemo(
    () => config.questions.filter(q => q.type !== 'welcome' && q.type !== 'end').length,
    [config.questions]
  );

  return {
    ...state,
    currentQuestion,
    progress,
    questionNumber,
    totalAnswerable,
    setAnswer,
    goNext,
    goPrev,
    goTo,
    setStatus,
    submit,
  };
}
