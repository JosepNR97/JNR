import type { Language } from './types';

export const LANGUAGE_NAVIGATION_STORAGE_KEY =
  'jnr-language-navigation-v1';

const LANGUAGE_NAVIGATION_MAX_AGE_MS = 60_000;

const EXPERIENCE_TRIGGER_PREFIX = 'experience-trigger-';
const EDUCATION_TRIGGER_PREFIX = 'education-trigger-';

const IGNORED_SCROLL_ANCHOR_IDS = new Set([
  'root',
  'main-content',
  'mobile-navigation',
]);

interface ScrollSnapshot {
  anchorId: string | null;
  anchorProgress: number | null;
  referenceY: number;
  scrollY: number;
}

export interface LanguageNavigationState {
  version: 1;
  createdAt: number;
  fromLanguage: Language;
  toLanguage: Language;
  targetLocation: string;
  scroll: ScrollSnapshot;
  expandedExperienceId: string | null;
  expandedVendorId: string | null;
}

interface SaveLanguageNavigationStateOptions {
  fromLanguage: Language;
  toLanguage: Language;
  targetHref: string;
}

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null;

const isLanguageValue = (
  value: unknown,
): value is Language =>
  value === 'ca' ||
  value === 'es' ||
  value === 'en';

const isNullableString = (
  value: unknown,
): value is string | null =>
  value === null ||
  typeof value === 'string';

const isFiniteNumber = (
  value: unknown,
): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value);

const isLanguageNavigationState = (
  value: unknown,
): value is LanguageNavigationState => {
  if (!isRecord(value)) {
    return false;
  }

  if (value.version !== 1) {
    return false;
  }

  if (
    !isFiniteNumber(value.createdAt) ||
    !isLanguageValue(value.fromLanguage) ||
    !isLanguageValue(value.toLanguage) ||
    typeof value.targetLocation !== 'string' ||
    !isNullableString(value.expandedExperienceId) ||
    !isNullableString(value.expandedVendorId) ||
    !isRecord(value.scroll)
  ) {
    return false;
  }

  const {
    anchorId,
    anchorProgress,
    referenceY,
    scrollY,
  } = value.scroll;

  if (
    !isNullableString(anchorId) ||
    !isFiniteNumber(referenceY) ||
    referenceY < 0 ||
    !isFiniteNumber(scrollY) ||
    scrollY < 0
  ) {
    return false;
  }

  if (
    anchorProgress !== null &&
    (
      !isFiniteNumber(anchorProgress) ||
      anchorProgress < 0 ||
      anchorProgress > 1
    )
  ) {
    return false;
  }

  return true;
};

const getCurrentLocation = (): string =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

const getReferenceY = (): number => {
  const preferredReferenceY = Math.max(
    96,
    Math.min(
      window.innerHeight * 0.25,
      240,
    ),
  );

  return Math.max(
    0,
    Math.min(
      preferredReferenceY,
      Math.max(
        window.innerHeight - 1,
        0,
      ),
    ),
  );
};

const getReferenceX = (): number =>
  Math.max(
    0,
    Math.min(
      window.innerWidth / 2,
      Math.max(
        window.innerWidth - 1,
        0,
      ),
    ),
  );

const isUsableScrollAnchor = (
  element: HTMLElement,
): boolean => {
  if (
    !element.id ||
    IGNORED_SCROLL_ANCHOR_IDS.has(
      element.id,
    )
  ) {
    return false;
  }

  if (
    element.closest(
      '[aria-hidden="true"]',
    )
  ) {
    return false;
  }

  const rect =
    element.getBoundingClientRect();

  if (
    rect.height <= 1 ||
    rect.width <= 1
  ) {
    return false;
  }

  const style =
    window.getComputedStyle(element);

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden'
  );
};

const findStableIdAncestor = (
  startingElement: Element | null,
): HTMLElement | null => {
  let currentElement:
    | Element
    | null = startingElement;

  while (
    currentElement &&
    currentElement !== document.body
  ) {
    if (
      currentElement instanceof HTMLElement &&
      isUsableScrollAnchor(
        currentElement,
      )
    ) {
      return currentElement;
    }

    currentElement =
      currentElement.parentElement;
  }

  return null;
};

const findScrollAnchor = (
  referenceY: number,
): HTMLElement | null => {
  const referenceX =
    getReferenceX();

  const elementsAtReference =
    document.elementsFromPoint(
      referenceX,
      referenceY,
    );

  for (
    const element
    of elementsAtReference
  ) {
    const anchor =
      findStableIdAncestor(element);

    if (anchor) {
      return anchor;
    }
  }

  const candidates =
    Array.from(
      document.querySelectorAll<HTMLElement>(
        'main [id]',
      ),
    ).filter(
      isUsableScrollAnchor,
    );

  if (candidates.length === 0) {
    return null;
  }

  const containingCandidates =
    candidates.filter((element) => {
      const rect =
        element.getBoundingClientRect();

      return (
        rect.top <= referenceY &&
        rect.bottom >= referenceY
      );
    });

  if (
    containingCandidates.length > 0
  ) {
    return containingCandidates.reduce(
      (smallest, candidate) => {
        const smallestHeight =
          smallest.getBoundingClientRect()
            .height;

        const candidateHeight =
          candidate.getBoundingClientRect()
            .height;

        return candidateHeight <
          smallestHeight
          ? candidate
          : smallest;
      },
    );
  }

  return candidates.reduce(
    (nearest, candidate) => {
      const nearestRect =
        nearest.getBoundingClientRect();

      const candidateRect =
        candidate.getBoundingClientRect();

      const nearestDistance =
        Math.min(
          Math.abs(
            nearestRect.top -
              referenceY,
          ),
          Math.abs(
            nearestRect.bottom -
              referenceY,
          ),
        );

      const candidateDistance =
        Math.min(
          Math.abs(
            candidateRect.top -
              referenceY,
          ),
          Math.abs(
            candidateRect.bottom -
              referenceY,
          ),
        );

      return candidateDistance <
        nearestDistance
        ? candidate
        : nearest;
    },
  );
};

const captureScrollSnapshot =
  (): ScrollSnapshot => {
    const referenceY =
      getReferenceY();

    const anchor =
      findScrollAnchor(referenceY);

    if (!anchor) {
      return {
        anchorId: null,
        anchorProgress: null,
        referenceY,
        scrollY: Math.max(
          0,
          window.scrollY,
        ),
      };
    }

    const rect =
      anchor.getBoundingClientRect();

    const progress =
      rect.height > 0
        ? Math.max(
            0,
            Math.min(
              1,
              (
                referenceY -
                rect.top
              ) /
                rect.height,
            ),
          )
        : null;

    return {
      anchorId: anchor.id,
      anchorProgress: progress,
      referenceY,
      scrollY: Math.max(
        0,
        window.scrollY,
      ),
    };
  };

const getExpandedItemId = (
  triggerPrefix: string,
): string | null => {
  const expandedTrigger =
    document.querySelector<HTMLElement>(
      `[id^="${triggerPrefix}"][aria-expanded="true"]`,
    );

  if (
    !expandedTrigger ||
    !expandedTrigger.id.startsWith(
      triggerPrefix,
    )
  ) {
    return null;
  }

  const itemId =
    expandedTrigger.id.slice(
      triggerPrefix.length,
    );

  return itemId || null;
};

export const saveLanguageNavigationState = ({
  fromLanguage,
  toLanguage,
  targetHref,
}: SaveLanguageNavigationStateOptions): void => {
  try {
    const targetUrl =
      new URL(
        targetHref,
        window.location.href,
      );

    const state: LanguageNavigationState = {
      version: 1,
      createdAt: Date.now(),
      fromLanguage,
      toLanguage,
      targetLocation:
        `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
      scroll:
        captureScrollSnapshot(),
      expandedExperienceId:
        getExpandedItemId(
          EXPERIENCE_TRIGGER_PREFIX,
        ),
      expandedVendorId:
        getExpandedItemId(
          EDUCATION_TRIGGER_PREFIX,
        ),
    };

    window.sessionStorage.setItem(
      LANGUAGE_NAVIGATION_STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch {
    /*
     * A locale change must keep working even if sessionStorage is unavailable.
     * The destination URL and its hash remain sufficient fallbacks.
     */
  }
};

export const clearLanguageNavigationState =
  (): void => {
    try {
      window.sessionStorage.removeItem(
        LANGUAGE_NAVIGATION_STORAGE_KEY,
      );
    } catch {
      // Nothing else is required if sessionStorage is unavailable.
    }
  };

export const readLanguageNavigationState = (
  currentLanguage: Language,
): LanguageNavigationState | null => {
  try {
    const serializedState =
      window.sessionStorage.getItem(
        LANGUAGE_NAVIGATION_STORAGE_KEY,
      );

    if (!serializedState) {
      return null;
    }

    const parsedState:
      unknown =
        JSON.parse(serializedState);

    if (
      !isLanguageNavigationState(
        parsedState,
      )
    ) {
      clearLanguageNavigationState();
      return null;
    }

    const stateAge =
      Date.now() -
      parsedState.createdAt;

    if (
      Math.abs(stateAge) >
        LANGUAGE_NAVIGATION_MAX_AGE_MS ||
      parsedState.toLanguage !==
        currentLanguage ||
      parsedState.targetLocation !==
        getCurrentLocation()
    ) {
      clearLanguageNavigationState();
      return null;
    }

    return parsedState;
  } catch {
    clearLanguageNavigationState();
    return null;
  }
};

export const restoreLanguageNavigationPosition = (
  state: LanguageNavigationState,
): void => {
  let targetScrollY =
    state.scroll.scrollY;

  const {
    anchorId,
    anchorProgress,
    referenceY,
  } = state.scroll;

  if (
    anchorId &&
    anchorProgress !== null
  ) {
    const anchor =
      document.getElementById(
        anchorId,
      );

    if (anchor) {
      const rect =
        anchor.getBoundingClientRect();

      if (rect.height > 0) {
        const anchorPointDocumentY =
          window.scrollY +
          rect.top +
          rect.height *
            anchorProgress;

        targetScrollY =
          anchorPointDocumentY -
          referenceY;
      }
    }
  }

  const maximumScrollY =
    Math.max(
      0,
      document.documentElement
        .scrollHeight -
        window.innerHeight,
    );

  const clampedScrollY =
    Math.max(
      0,
      Math.min(
        targetScrollY,
        maximumScrollY,
      ),
    );

  const documentElement =
    document.documentElement;

  const previousScrollBehavior =
    documentElement.style
      .scrollBehavior;

  documentElement.style
    .scrollBehavior = 'auto';

  window.scrollTo({
    top: clampedScrollY,
    left: 0,
    behavior: 'auto',
  });

  documentElement.style
    .scrollBehavior =
    previousScrollBehavior;
};
