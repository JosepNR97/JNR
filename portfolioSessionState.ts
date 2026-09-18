export const PORTFOLIO_SESSION_STATE_STORAGE_KEY =
  'jnr-portfolio-session-state-v2';

export interface PortfolioReloadPosition {
  location: string;
  scrollY: number;
}

export interface PortfolioSessionState {
  version: 2;
  expandedExperienceId: string | null;
  expandedVendorId: string | null;
  reloadPosition: PortfolioReloadPosition | null;
}

const EMPTY_PORTFOLIO_SESSION_STATE: PortfolioSessionState = {
  version: 2,
  expandedExperienceId: null,
  expandedVendorId: null,
  reloadPosition: null,
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

const isPortfolioReloadPosition = (
  value: unknown,
): value is PortfolioReloadPosition => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.location === 'string' &&
    typeof value.scrollY === 'number' &&
    Number.isFinite(value.scrollY) &&
    value.scrollY >= 0
  );
};

const isNullablePortfolioReloadPosition = (
  value: unknown,
): value is PortfolioReloadPosition | null =>
  value === null ||
  isPortfolioReloadPosition(
    value,
  );

const isPortfolioSessionState = (
  value: unknown,
): value is PortfolioSessionState => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === 2 &&
    isNullableString(
      value.expandedExperienceId,
    ) &&
    isNullableString(
      value.expandedVendorId,
    ) &&
    isNullablePortfolioReloadPosition(
      value.reloadPosition,
    )
  );
};

const getEmptyPortfolioSessionState =
  (): PortfolioSessionState => ({
    ...EMPTY_PORTFOLIO_SESSION_STATE,
  });

const parsePortfolioSessionState = (
  serializedState: string,
): PortfolioSessionState | null => {
  try {
    const parsedState: unknown =
      JSON.parse(
        serializedState,
      );

    return isPortfolioSessionState(
      parsedState,
    )
      ? parsedState
      : null;
  } catch {
    return null;
  }
};

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

      const parsedState =
        parsePortfolioSessionState(
          serializedState,
        );

      if (!parsedState) {
        /*
         * Malformed or obsolete session data must not be retried on every
         * render. Remove it and continue from the safe default state.
         */
        window.sessionStorage.removeItem(
          PORTFOLIO_SESSION_STATE_STORAGE_KEY,
        );

        return getEmptyPortfolioSessionState();
      }

      return parsedState;
    } catch {
      /*
       * sessionStorage may be unavailable in restrictive environments.
       * Session continuity is an enhancement and must never break the UI.
       */
      return getEmptyPortfolioSessionState();
    }
  };

const writePortfolioSessionState = (
  nextState: PortfolioSessionState,
): void => {
  if (
    typeof window === 'undefined'
  ) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      PORTFOLIO_SESSION_STATE_STORAGE_KEY,
      JSON.stringify(
        nextState,
      ),
    );
  } catch {
    /*
     * A storage failure must never prevent normal portfolio interaction.
     */
  }
};

const updatePortfolioSessionState = (
  updater: (
    currentState: PortfolioSessionState,
  ) => PortfolioSessionState,
): void => {
  const currentState =
    readPortfolioSessionState();

  writePortfolioSessionState(
    updater(
      currentState,
    ),
  );
};

export const persistExpandedExperienceId = (
  expandedExperienceId: string | null,
): void => {
  updatePortfolioSessionState(
    (
      currentState,
    ) => ({
      ...currentState,
      expandedExperienceId,
    }),
  );
};

export const persistExpandedVendorId = (
  expandedVendorId: string | null,
): void => {
  updatePortfolioSessionState(
    (
      currentState,
    ) => ({
      ...currentState,
      expandedVendorId,
    }),
  );
};

export const persistPortfolioReloadPosition = (
  reloadPosition: PortfolioReloadPosition,
): void => {
  updatePortfolioSessionState(
    (
      currentState,
    ) => ({
      ...currentState,
      reloadPosition,
    }),
  );
};
