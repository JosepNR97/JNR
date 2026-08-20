import { render, within } from '@testing-library/react';
import { CV_FILENAMES } from '../cvConfig';
import { LanguageProvider } from '../context/LanguageContext';
import type { Language } from '../types';
import { Hero } from './Hero';

const cases: Array<{ language: Language; label: string }> = [
  { language: 'ca', label: 'Descarregar CV' },
  { language: 'es', label: 'Descargar CV' },
  { language: 'en', label: 'Download CV' },
];

describe('Hero CV download', () => {
  it.each(cases)('uses the active $language document after the primary actions', ({ language, label }) => {
    window.localStorage.setItem('jnr-language-v1', language);
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>,
    );

    const hero = document.querySelector<HTMLElement>('#top');
    expect(hero).not.toBeNull();
    if (!hero) throw new Error('Hero section was not rendered');
    const actions = within(hero).getAllByRole('link');
    const download = within(hero).getByRole('link', { name: label });

    expect(actions).toHaveLength(3);
    expect(actions[1]).toHaveAttribute('href', '#about');
    expect(actions[2]).toBe(download);
    expect(download).toHaveAttribute('href', expect.stringContaining(`/assets/documents/${CV_FILENAMES[language]}`));
    expect(download).toHaveAttribute('download', CV_FILENAMES[language]);
  });
});
