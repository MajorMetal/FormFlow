import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types/form';
import { MediaRenderer } from './media/MediaRenderer';

interface WelcomeScreenProps {
  question: Question;
  onStart: () => void;
  branding?: { logoUrl?: string };
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  question,
  onStart,
  branding,
}) => {
  return (
    <div className="ff-welcome">
      {question.media?.placement === 'background' && (
        <MediaRenderer media={question.media} />
      )}

      <div className="ff-welcome-content" style={{ position: 'relative', zIndex: 1 }}>
        {branding?.logoUrl && (
          <motion.img
            src={branding.logoUrl}
            alt="Logo"
            className="ff-welcome-logo"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {question.media && question.media.placement !== 'background' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MediaRenderer media={question.media} />
          </motion.div>
        )}

        <motion.h1
          className="ff-welcome-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {question.title}
        </motion.h1>

        {question.subtitle && (
          <motion.p
            className="ff-welcome-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {question.subtitle}
          </motion.p>
        )}

        {question.description && (
          <motion.p
            className="ff-welcome-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {question.description}
          </motion.p>
        )}

        <motion.button
          type="button"
          className="ff-btn ff-btn--start"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {question.buttonText || 'Start'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>

        <motion.p
          className="ff-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Press <strong>Enter ↵</strong> to start
        </motion.p>
      </div>
    </div>
  );
};
