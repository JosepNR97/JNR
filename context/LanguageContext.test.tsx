import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from './LanguageContext';

const LanguageProbe = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <output aria-label="current-language">{language}</output>
      <button type="button" onClick={() => setLanguage('ca')}>
        Català
      </button>
    </div>
  );
};

describe('LanguageProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'es';
  });

  it('restores the stored language and updates the document language', async () => {
    window.localStorage.setItem('jnr-language-v1', 'en');
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByLabelText('current-language')).toHaveTextContent('en');
    await waitFor(() => expect(document.documentElement).toHaveAttribute('lang', 'en'));
  });

  it('persists a new language selection', async () => {
    window.localStorage.setItem('jnr-language-v1', 'es');
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Català' }));
    });

    expect(screen.getByLabelText('current-language')).toHaveTextContent('ca');
    await waitFor(() => expect(window.localStorage.getItem('jnr-language-v1')).toBe('ca'));
  });
});
