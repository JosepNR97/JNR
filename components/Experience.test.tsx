import { useState } from 'react';
import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../context/LanguageContext';
import { Experience } from './Experience';

const ExperienceHarness =
  () => {
    const [
      expandedId,
      setExpandedId,
    ] =
      useState<string | null>(
        null,
      );

    const handleToggle = (
      itemId: string,
    ) => {
      setExpandedId(
        (
          currentId,
        ) =>
          currentId ===
          itemId
            ? null
            : itemId,
      );
    };

    return (
      <Experience
        expandedId={
          expandedId
        }
        onToggle={
          handleToggle
        }
      />
    );
  };

describe(
  'Experience',
  () => {
    beforeEach(() => {
      window.localStorage.clear();

      window.localStorage.setItem(
        'jnr-language-v1',
        'en',
      );
    });

    afterEach(() => {
      window.localStorage.clear();
    });

    it(
      'exposes controlled expandable project details to keyboard and assistive technology',
      async () => {
        const user =
          userEvent.setup();

        render(
          <LanguageProvider>
            <ExperienceHarness />
          </LanguageProvider>,
        );

        const trigger =
          screen.getByRole(
            'button',
            {
              name:
                /Senior Consultant/i,
            },
          );

        const panelId =
          trigger.getAttribute(
            'aria-controls',
          );

        const panel =
          panelId
            ? document.getElementById(
                panelId,
              )
            : null;

        expect(
          trigger,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        expect(
          panel,
        ).toHaveAttribute(
          'aria-hidden',
          'true',
        );

        await user.click(
          trigger,
        );

        expect(
          trigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        expect(
          panel,
        ).not.toHaveAttribute(
          'aria-hidden',
        );

        expect(
          screen.getByRole(
            'region',
            {
              name:
                /Senior Consultant/i,
            },
          ),
        ).toBeVisible();

        await user.click(
          trigger,
        );

        expect(
          trigger,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        expect(
          panel,
        ).toHaveAttribute(
          'aria-hidden',
          'true',
        );
      },
    );
  },
);
