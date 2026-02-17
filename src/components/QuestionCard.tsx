import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types/form';
import { MediaRenderer } from './media/MediaRenderer';
import { ShortText, LongText, MultipleChoice, YesNo, Rating, OpinionScale } from './questions';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  value: string | string[] | number | undefined;
  error?: string;
  onChange: (value: string | string[] | number) => void;
  onSubmit: () => void;
  direction: 1 | -1;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  value,
  error,
  onChange,
  onSubmit,
  direction,
}) => {
  const isSplit = question.layout === 'split' && question.media;

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  const renderInput = () => {
    const commonProps = {
      question,
      error,
      onSubmit,
    };

    switch (question.type) {
      case 'short-text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
      case 'date':
        return (
          <ShortText
            {...commonProps}
            value={(value as string) || ''}
            onChange={v => onChange(v)}
          />
        );

      case 'long-text':
        return (
          <LongText
            {...commonProps}
            value={(value as string) || ''}
            onChange={v => onChange(v)}
          />
        );

      case 'multiple-choice':
        return (
          <MultipleChoice
            {...commonProps}
            value={(value as string | string[]) || (question.multiSelect ? [] : '')}
            onChange={v => onChange(v)}
          />
        );

      case 'yes-no':
        return (
          <YesNo
            {...commonProps}
            value={(value as string) || ''}
            onChange={v => onChange(v)}
          />
        );

      case 'rating':
        return (
          <Rating
            {...commonProps}
            value={(value as number) || 0}
            onChange={v => onChange(v)}
          />
        );

      case 'opinion-scale':
        return (
          <OpinionScale
            {...commonProps}
            value={(value as number) || 0}
            onChange={v => onChange(v)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`ff-card ${isSplit ? 'ff-card--split' : ''}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      key={question.id}
    >
      {question.media?.placement === 'background' && (
        <MediaRenderer media={question.media} />
      )}

      {isSplit && question.media && (
        <div className="ff-card-media-side">
          <MediaRenderer media={question.media} />
        </div>
      )}

      <div className="ff-card-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ff-card-header">
          <span className="ff-question-number">
            {questionNumber}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
          <h2 className="ff-question-title">{question.title}</h2>
          {question.subtitle && (
            <p className="ff-question-subtitle">{question.subtitle}</p>
          )}
          {question.description && (
            <p className="ff-question-description">{question.description}</p>
          )}
        </div>

        {question.media && question.media.placement === 'inline' && !isSplit && (
          <div className="ff-card-media-inline">
            <MediaRenderer media={question.media} />
          </div>
        )}

        {renderInput()}
      </div>
    </motion.div>
  );
};
