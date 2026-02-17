import React from 'react';
import { motion } from 'framer-motion';
import { Question, FormBranding } from '../types/form';
import { MediaRenderer } from './media/MediaRenderer';

interface EndScreenProps {
  question: Question;
  branding: FormBranding;
}

export const EndScreen: React.FC<EndScreenProps> = ({ question, branding }) => {
  return (
    <div className="ff-end">
      {question.media?.placement === 'background' && (
        <MediaRenderer media={question.media} />
      )}

      <div className="ff-end-content" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="ff-end-checkmark"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ff-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </motion.div>

        {question.media && question.media.placement !== 'background' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MediaRenderer media={question.media} />
          </motion.div>
        )}

        <motion.h1
          className="ff-end-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {question.title}
        </motion.h1>

        {question.subtitle && (
          <motion.p
            className="ff-end-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {question.subtitle}
          </motion.p>
        )}

        {question.description && (
          <motion.p
            className="ff-end-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {question.description}
          </motion.p>
        )}

        {branding.showPoweredBy && (
          <motion.p
            className="ff-powered-by"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {branding.poweredByText || 'Powered by FormFlow'}
          </motion.p>
        )}
      </div>
    </div>
  );
};
