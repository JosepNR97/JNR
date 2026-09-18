import {
  PORTFOLIO_SESSION_STATE_STORAGE_KEY,
  persistExpandedExperienceId,
  persistExpandedVendorId,
  persistPortfolioReloadPosition,
  readPortfolioSessionState,
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
      'returns an empty state when no persisted state exists',
      () => {
        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
          reloadPosition:
            null,
        });
      },
    );

    it(
      'reads a valid persisted state',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 2,
            expandedExperienceId:
              'experience-1',
            expandedVendorId:
              'vendor-1',
            reloadPosition: {
              location:
                '/es/#education',
              scrollY:
                2_500,
            },
          }),
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
          reloadPosition: {
            location:
              '/es/#education',
            scrollY:
              2_500,
          },
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
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
          reloadPosition:
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
            version: 2,
            expandedExperienceId:
              123,
            expandedVendorId:
              null,
            reloadPosition:
              null,
          }),
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
          reloadPosition:
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
      'rejects an unsupported persisted version',
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
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
          reloadPosition:
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
      'persists Experience and Education state independently',
      () => {
        persistExpandedExperienceId(
          'experience-1',
        );

        persistExpandedVendorId(
          'vendor-1',
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
          reloadPosition:
            null,
        });
      },
    );

    it(
      'persists explicit null when an accordion is closed',
      () => {
        persistExpandedExperienceId(
          'experience-1',
        );

        persistExpandedVendorId(
          'vendor-1',
        );

        persistExpandedExperienceId(
          null,
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            'vendor-1',
          reloadPosition:
            null,
        });
      },
    );

    it(
      'persists reload position without losing expanded UI state',
      () => {
        persistExpandedExperienceId(
          'experience-1',
        );

        persistExpandedVendorId(
          'vendor-1',
        );

        persistPortfolioReloadPosition({
          location:
            '/es/?source=test',
          scrollY:
            3_250,
        });

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            'experience-1',
          expandedVendorId:
            'vendor-1',
          reloadPosition: {
            location:
              '/es/?source=test',
            scrollY:
              3_250,
          },
        });
      },
    );

    it(
      'rejects an invalid reload position',
      () => {
        window.sessionStorage.setItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          JSON.stringify({
            version: 2,
            expandedExperienceId:
              null,
            expandedVendorId:
              null,
            reloadPosition: {
              location:
                '/es/',
              scrollY:
                -50,
            },
          }),
        );

        expect(
          readPortfolioSessionState(),
        ).toEqual({
          version: 2,
          expandedExperienceId:
            null,
          expandedVendorId:
            null,
          reloadPosition:
            null,
        });

        expect(
          window.sessionStorage.getItem(
            PORTFOLIO_SESSION_STATE_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );
  },
);
