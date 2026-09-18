import {
  PORTFOLIO_SESSION_STATE_STORAGE_KEY,
  readPortfolioSessionState,
  updatePortfolioSessionState,
} from './portfolioSessionState';

describe(
  'portfolioSessionState',
  () => {
    beforeEach(() => {
      window.sessionStorage.clear();
    });

    afterEach(() => {
      window.sessionStorage.clear();
    });

    it(
      'returns the empty state when no session state exists',
      () => {
        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 1,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
        });
      },
    );

    it(
      'reads valid persisted session state',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 1,
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
            'experience-1',
          expandedVendorId:
            'vendor-1',
        });
      },
    );

    it(
      'removes malformed JSON and returns the empty state',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          '{not-valid-json',
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
      'removes persisted data that does not satisfy the current contract',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 1,
            expandedExperienceId:
              123,
            expandedVendorId:
              null,
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
      'removes persisted data from an unsupported version',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 2,
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
