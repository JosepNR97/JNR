export const PORTFOLIO_SESSION_STATE_STORAGE_KEY =
  'jnr-portfolio-session-state-v1';

export interface PortfolioSessionState {
  version: 1;
  expandedExperienceId: string | null;
  expandedVendorId: string | null;
}

type PortfolioSessionStateUpdate = Partial<
  Pick<
    PortfolioSessionState,
    'expandedExperienceId' | 'expandedVendorId'
  >
>;

const EMPTY_PORTFOLIO_SESSION_STATE: PortfolioSessionState = {
  version: 1,
  expandedExperienceId: null,
  expandedVendorId: null,
};

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null;

const isNullableString = (
  value: unknown,
): value is string | null =>
  value === null ||
  typeof value === 'string';

const isPortfolioSessionState = (
  value: unknown,
): value is PortfolioSessionState => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 1 &&
    isNullableString(
      value.expandedExperienceId,
    ) &&
    isNullableString(
      value.expandedVendorId,
    )
  );
};

const getEmptyPortfolioSessionState =
  (): PortfolioSessionState => ({
    ...EMPTY_PORTFOLIO_SESSION_STATE,
  });

export const readPortfolioSessionState =
  (): PortfolioSessionState => {
    if (
      typeof window === 'undefined'
    ) {
      return getEmptyPortfolioSessionState();
    }

    try {
      const serializedState =
        window.sessionStorage.getItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
        );

      if (!serializedState) {
        return getEmptyPortfolioSessionState();
      }

      const parsedState: unknown =
        JSON.parse(
          serializedState,
        );

      if (
        !isPortfolioSessionState(
          parsedState,
        )
      ) {
        window.sessionStorage.removeItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
        );

        return getEmptyPortfolioSessionState();
      }

      return parsedState;
    } catch {
      return getEmptyPortfolioSessionState();
    }
  };

export const updatePortfolioSessionState = (
  update: PortfolioSessionStateUpdate,
): void => {
  if (
    typeof window === 'undefined'
  ) {
    return;
  }

  try {
    const currentState =
      readPortfolioSessionState();

    const nextState: PortfolioSessionState = {
      ...currentState,
      ...update,
      version: 1,
    };

    window.sessionStorage.setItem(
      PORTFOLIO_SESSION_STATE_STORAGE_KEY,
      JSON.stringify(
        nextState,
      ),
    );
  } catch {
    /*
     * Session persistence is a progressive enhancement.
     * Accordion interaction must keep working if storage is unavailable.
     */
  }
};
