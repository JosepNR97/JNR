import { assetPath } from './assetPath';
import type { Language } from './types';

export const CV_FILENAMES = {
  ca: 'Josep_Nunez_Riba_CV_CA.pdf',
  es: 'Josep_Nunez_Riba_CV_ES.pdf',
  en: 'Josep_Nunez_Riba_CV_EN.pdf',
} satisfies Record<Language, string>;

export const CV_FILES = {
  ca: assetPath(`documents/${CV_FILENAMES.ca}`),
  es: assetPath(`documents/${CV_FILENAMES.es}`),
  en: assetPath(`documents/${CV_FILENAMES.en}`),
} satisfies Record<Language, string>;
