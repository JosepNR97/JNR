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
    window.history.replaceState({}, '', '/');
    document.documentElement.lang = 'es';
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('uses an explicit locale URL before a stored preference', async () => {
    window.localStorage.setItem('jnr-language-v1', 'ca');
    window.history.replaceState({}, '', '/JNR/en/');

    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByLabelText('current-language')).toHaveTextContent('en');
    await waitFor(() => expect(document.documentElement).toHaveAttribute('lang', 'en'));
    await waitFor(() => expect(window.localStorage.getItem('jnr-language-v1')).toBe('en'));
  });

  it('restores the stored language when no locale is present in the URL', async () => {
    window.localStorage.setItem('jnr-language-v1', 'en');

    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );

    expect(screen.getByLabelText('current-language')).toHaveTextContent('en');
    await waitFor(() => expect(document.documentElement).toHaveAttribute('lang', 'en'));
  });

  it('persists a new language selection when rendered without an explicit locale', async () => {
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
