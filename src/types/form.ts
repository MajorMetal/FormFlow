export type QuestionType =
  | 'welcome'
  | 'short-text'
  | 'long-text'
  | 'email'
  | 'phone'
  | 'url'
  | 'multiple-choice'
  | 'yes-no'
  | 'rating'
  | 'opinion-scale'
  | 'number'
  | 'date'
  | 'end';

export interface Choice {
  id: string;
  label: string;
  icon?: string;
}

export interface MediaItem {
  type: 'image' | 'gif' | 'video';
  url: string;
  alt?: string;
  placement?: 'background' | 'inline' | 'side';
  opacity?: number;
  fit?: 'cover' | 'contain' | 'fill';
}

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  min?: number;
  max?: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  description?: string;
  placeholder?: string;
  choices?: Choice[];
  media?: MediaItem;
  validation?: Validation;
  multiSelect?: boolean;
  ratingMax?: number;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  buttonText?: string;
  layout?: 'default' | 'split';
}

export interface FormBranding {
  logoUrl?: string;
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  primaryColor: string;
  primaryContrast?: string;
  accentColor?: string;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  textColor: string;
  textSecondaryColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  borderRadius?: number;
  poweredByText?: string;
  showPoweredBy?: boolean;
}

export interface FormConfig {
  id: string;
  title: string;
  branding: FormBranding;
  questions: Question[];
  settings?: {
    progressBar?: boolean;
    keyboardNav?: boolean;
    animationDuration?: number;
    showQuestionNumbers?: boolean;
    submitUrl?: string;
    submitMethod?: 'POST' | 'PUT';
    redirectUrl?: string;
    googleFonts?: string[];
  };
}

export interface FormResponse {
  formId: string;
  answers: Record<string, string | string[] | number>;
  submittedAt: string;
  metadata?: Record<string, string>;
}

export type FormStatus = 'idle' | 'active' | 'submitting' | 'submitted' | 'error';
