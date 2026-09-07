import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../context/LanguageContext';
import { Header } from './Header';

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('jnr-language-v1', 'es');
    document.documentElement.lang = 'es';
  });

  it('updates the selected language and preserves aria-pressed semantics', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>,
    );

    const spanishButton = screen.getByRole('button', {
      name: 'Español',
    });

    const catalanButton = screen.getByRole('button', {
      name: 'Català',
    });

    expect(spanishButton).toHaveAttribute('aria-pressed', 'true');
    expect(catalanButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(catalanButton);

    expect(catalanButton).toHaveAttribute('aria-pressed', 'true');
    expect(spanishButton).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement).toHaveAttribute('lang', 'ca');
  });

  it('exposes pointer, hover and focus affordance on language controls and contact CTAs', () => {
    const { container } = render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>,
    );

    const languageButtons = container.querySelectorAll<HTMLButtonElement>(
      'button[aria-pressed]',
    );

    expect(languageButtons).toHaveLength(6);

    languageButtons.forEach((button) => {
      expect(button).toHaveClass('cursor-pointer', 'rounded-md');
    });

    const spanishButtons = screen.getAllByLabelText('Español');
    const catalanButtons = screen.getAllByLabelText('Català');

    expect(spanishButtons).toHaveLength(2);
    expect(catalanButtons).toHaveLength(2);

    expect(spanishButtons[0]).toHaveClass(
      'bg-brand-500/10',
      'hover:bg-brand-500/20',
      'focus-visible:bg-brand-500/20',
    );

    expect(spanishButtons[1]).toHaveClass(
      'bg-white/10',
      'hover:bg-white/20',
      'focus-visible:bg-white/20',
    );

    expect(catalanButtons[0]).toHaveClass(
      'hover:bg-brand-500/10',
      'hover:text-brand-500',
      'focus-visible:bg-brand-500/10',
    );

    expect(catalanButtons[1]).toHaveClass(
      'hover:bg-white/10',
      'hover:text-brand-200',
      'focus-visible:bg-white/10',
    );

    const contactLinks = container.querySelectorAll<HTMLAnchorElement>(
      'a[href="#contact"]',
    );

    expect(contactLinks).toHaveLength(2);

    contactLinks.forEach((link) => {
      expect(link).toHaveClass(
        'cursor-pointer',
        'hover:-translate-y-0.5',
        'hover:shadow-md',
        'focus-visible:-translate-y-0.5',
        'focus-visible:shadow-md',
      );
    });
  });
});