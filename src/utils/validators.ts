import { Question } from '../types/form';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const URL_RE = /^https?:\/\/.+\..+/;

export function validateAnswer(
  question: Question,
  value: string | string[] | number | undefined
): string | null {
  const v = question.validation;

  // Check required
  if (v?.required !== false) {
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      if (question.type === 'welcome' || question.type === 'end') return null;
      return 'This field is required';
    }
  } else if (value === undefined || value === '') {
    return null;
  }

  const strVal = typeof value === 'string' ? value : String(value);

  // Type-specific validation
  switch (question.type) {
    case 'email':
      if (!EMAIL_RE.test(strVal)) return 'Please enter a valid email address';
      break;
    case 'phone':
      if (!PHONE_RE.test(strVal)) return 'Please enter a valid phone number';
      break;
    case 'url':
      if (!URL_RE.test(strVal)) return 'Please enter a valid URL';
      break;
    case 'number':
      if (isNaN(Number(strVal))) return 'Please enter a valid number';
      if (v?.min !== undefined && Number(strVal) < v.min) return `Minimum value is ${v.min}`;
      if (v?.max !== undefined && Number(strVal) > v.max) return `Maximum value is ${v.max}`;
      break;
  }

  // Length validation
  if (v?.minLength && strVal.length < v.minLength) {
    return `Please enter at least ${v.minLength} characters`;
  }
  if (v?.maxLength && strVal.length > v.maxLength) {
    return `Please enter no more than ${v.maxLength} characters`;
  }

  // Pattern validation
  if (v?.pattern) {
    const re = new RegExp(v.pattern);
    if (!re.test(strVal)) return v.patternMessage || 'Please enter a valid value';
  }

  return null;
}
