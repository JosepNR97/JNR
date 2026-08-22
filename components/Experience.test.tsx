import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { Experience } from './Experience';

describe('Experience', () => {
  it('exposes expandable project details to keyboard and assistive technology', async () => {
    window.localStorage.setItem('jnr-language-v1', 'en');
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => window.setTimeout(() => callback(0), 0));
    const scrollIntoView = vi.mocked(Element.prototype.scrollIntoView);
    scrollIntoView.mockClear();
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Experience />
      </LanguageProvider>,
    );

    const trigger = screen.getByRole('button', { name: /Senior Consultant/i });
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('aria-hidden', 'true');

    await act(async () => {
      await user.click(trigger);
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('region', { name: /Senior Consultant/i })).toBeVisible();
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
    requestAnimationFrame.mockRestore();
  });
});
