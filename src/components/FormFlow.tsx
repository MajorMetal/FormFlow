import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormConfig } from '../types/form';
import { ThemeProvider } from '../theme/ThemeProvider';
import { useFormState } from '../hooks/useFormState';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { ProgressBar } from './ProgressBar';
import { NavigationButtons } from './NavigationButtons';
import { WelcomeScreen } from './WelcomeScreen';
import { EndScreen } from './EndScreen';
import { QuestionCard } from './QuestionCard';
import '../styles/global.css';
import '../styles/formflow.css';

interface FormFlowProps {
  config: FormConfig;
  onSubmit?: (answers: Record<string, string | string[] | number>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FormFlow: React.FC<FormFlowProps> = ({
  config,
  onSubmit,
  className,
  style,
}) => {
  const form = useFormState(config);
  const { currentQuestion } = form;

  const handleNext = useCallback(() => {
    const isLastAnswerable =
      form.currentIndex === config.questions.length - 1 ||
      (form.currentIndex === config.questions.length - 2 &&
        config.questions[config.questions.length - 1].type === 'end');

    if (isLastAnswerable && currentQuestion.type !== 'end' && currentQuestion.type !== 'welcome') {
      // Validate before submitting
      const success = form.goNext();
      if (success || config.questions[config.questions.length - 1].type === 'end') {
        form.submit().then(result => {
          if (result && onSubmit) {
            onSubmit(result.answers);
          }
        });
        // If there's an end screen, navigate to it
        if (config.questions[config.questions.length - 1].type === 'end') {
          return true;
        }
      }
      return success;
    }

    return form.goNext();
  }, [form, config.questions, currentQuestion, onSubmit]);

  const handleChoiceSelect = useCallback(
    (index: number) => {
      if (currentQuestion.choices && currentQuestion.choices[index]) {
        const choice = currentQuestion.choices[index];
        if (currentQuestion.multiSelect) {
          const current = (form.answers[currentQuestion.id] as string[]) || [];
          const next = current.includes(choice.id)
            ? current.filter(id => id !== choice.id)
            : [...current, choice.id];
          form.setAnswer(currentQuestion.id, next);
        } else {
          form.setAnswer(currentQuestion.id, choice.id);
          setTimeout(() => handleNext(), 400);
        }
      }
    },
    [currentQuestion, form, handleNext]
  );

  useKeyboardNav({
    currentQuestion,
    onNext: handleNext,
    onPrev: form.goPrev,
    onSelect: handleChoiceSelect,
    enabled: config.settings?.keyboardNav !== false,
  });

  const showProgress = config.settings?.progressBar !== false && currentQuestion.type !== 'welcome' && currentQuestion.type !== 'end';

  return (
    <ThemeProvider branding={config.branding}>
      <div
        className={`ff-container ${className || ''}`}
        style={style}
      >
        {/* Logo */}
        {config.branding.logoUrl && currentQuestion.type !== 'welcome' && (
          <div className={`ff-logo ff-logo--${config.branding.logoPosition || 'top-left'}`}>
            <img src={config.branding.logoUrl} alt="Logo" />
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && <ProgressBar progress={form.progress} />}

        {/* Background image/video for entire form */}
        {config.branding.backgroundImage && (
          <div
            className="ff-bg-image"
            style={{ backgroundImage: `url(${config.branding.backgroundImage})` }}
          />
        )}
        {config.branding.backgroundVideo && (
          <video
            className="ff-bg-video"
            src={config.branding.backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Question slides */}
        <div className="ff-slides">
          <AnimatePresence mode="wait" custom={form.direction}>
            {currentQuestion.type === 'welcome' ? (
              <WelcomeScreen
                key="welcome"
                question={currentQuestion}
                onStart={form.goNext}
                branding={config.branding}
              />
            ) : currentQuestion.type === 'end' ? (
              <EndScreen
                key="end"
                question={currentQuestion}
                branding={config.branding}
              />
            ) : (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={form.questionNumber}
                value={form.answers[currentQuestion.id]}
                error={form.errors[currentQuestion.id]}
                onChange={(v) => form.setAnswer(currentQuestion.id, v)}
                onSubmit={handleNext}
                direction={form.direction}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentQuestion.type !== 'welcome' && currentQuestion.type !== 'end' && (
          <NavigationButtons
            onPrev={form.goPrev}
            onNext={handleNext}
            showPrev={form.currentIndex > (config.questions[0]?.type === 'welcome' ? 1 : 0)}
            showNext={true}
          />
        )}

        {/* Powered by */}
        {config.branding.showPoweredBy && currentQuestion.type !== 'end' && (
          <div className="ff-footer">
            {config.branding.poweredByText || 'Powered by FormFlow'}
          </div>
        )}

        {/* Submitting overlay */}
        {form.status === 'submitting' && (
          <div className="ff-loading-overlay">
            <div className="ff-spinner" />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};
