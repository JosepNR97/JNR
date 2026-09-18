import {
  PORTFOLIO_SESSION_STATE_STORAGE_KEY,
  parsePortfolioSessionState,
  readPortfolioSessionState,
  updatePortfolioSessionState,
} from './portfolioSessionState';

describe(
  'portfolioSessionState',
  () => {
    beforeEach(() => {
      window.sessionStorage.clear();
    });

    it(
      'parses a valid serialized portfolio session state',
      () => {
        const serializedState =
          JSON.stringify({
            version: 1,
            expandedExperienceId:
              'experience-1',
            expandedVendorId:
              'vendor-1',
          });

        expect(
          parsePortfolioSessionState(
            serializedState,
          ),
        ).toEqual({
          version: 1,
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
        });
      },
    );

    it(
      'rejects malformed JSON',
      () => {
        expect(
          parsePortfolioSessionState(
            '{not-valid-json',
          ),
        ).toBeNull();
      },
    );

    it(
      'rejects data that does not satisfy the persisted contract',
      () => {
        const serializedState =
          JSON.stringify({
            version: 1,
            expandedExperienceId:
              123,
            expandedVendorId:
              null,
          });

        expect(
          parsePortfolioSessionState(
            serializedState,
          ),
        ).toBeNull();
      },
    );

    it(
      'returns an empty state and removes invalid persisted data',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 999,
            expandedExperienceId:
              'experience-1',
            expandedVendorId:
              'vendor-1',
          }),
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 1,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
        });

        expect(
          window.sessionStorage.getItem(
            PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );

    it(
      'updates one field without losing the other persisted field',
      () => {
        updatePortfolioSessionState({
          expandedExperienceId:
            'experience-1',
        });

        updatePortfolioSessionState({
          expandedVendorId:
            'vendor-1',
        });

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 1,
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
        });
      },
    );

    it(
      'persists explicit null when an accordion is closed',
      () => {
        updatePortfolioSessionState({
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
        });

        updatePortfolioSessionState({
          expandedExperienceId:
            null,
        });

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 1,
          expandedExperienceId:
            null,
          expandedVendorId:
            'vendor-1',
        });
      },
    );
  },
);
