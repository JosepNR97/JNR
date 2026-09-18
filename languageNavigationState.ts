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
  anchorViewportTop: number | null;
  scrollY: number;
}

export interface LanguageNavigationState {
  version: 2;
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

const isNullableFiniteNumber = (
  value: unknown,
): value is number | null =>
  value === null ||
  (
    typeof value === 'number' &&
    Number.isFinite(value)
  );

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

  /*
   * Version 2 stores the viewport position of the stable anchor itself.
   * Version 1 stored proportional progress through the anchor and must not
   * be restored with the new geometry contract.
   */
  if (value.version !== 2) {
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
    anchorViewportTop,
    scrollY,
  } = value.scroll;

  if (
    !isNullableString(anchorId) ||
    !isNullableFiniteNumber(anchorViewportTop) ||
    !isFiniteNumber(scrollY) ||
    scrollY < 0
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

  /*
   * elementsFromPoint can miss a useful stable ID when the reading point
   * happens to fall over decorative or otherwise non-addressable content.
   * Fall back to the stable IDs already present in the main portfolio DOM.
   */
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
    /*
     * Prefer the most specific stable element that contains the reading
     * point. A smaller containing element is normally closer to the content
     * the user is actually reading than an outer section wrapper.
     */
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
      findScrollAnchor(
        referenceY,
      );

    if (!anchor) {
      return {
        anchorId: null,
        anchorViewportTop: null,
        scrollY: Math.max(
          0,
          window.scrollY,
        ),
      };
    }

    const rect =
      anchor.getBoundingClientRect();

    return {
      anchorId: anchor.id,

      /*
       * Preserve the actual screen position of the stable element, not the
       * proportional progress through it.
       *
       * Translated text can change an element's height. A percentage-based
       * anchor therefore moves the element itself when switching language.
       * Storing its viewport top keeps the UI visually stationary instead.
       *
       * Negative values are valid: an anchor can begin above the viewport
       * while the user is reading content further down inside it.
       */
      anchorViewportTop:
        rect.top,

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
      version: 2,
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
     * A locale change must keep working even if sessionStorage is
     * unavailable. The destination URL and its hash remain sufficient
     * fallbacks.
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
        JSON.parse(
          serializedState,
        );

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
    anchorViewportTop,
  } = state.scroll;

  if (
    anchorId &&
    anchorViewportTop !== null
  ) {
    const anchor =
      document.getElementById(
        anchorId,
      );

    if (anchor) {
      const rect =
        anchor.getBoundingClientRect();

      /*
       * Move the destination document by exactly the difference between the
       * anchor's current screen position and its screen position before the
       * locale switch.
       *
       * Example:
       *
       *   source:      trigger top = 120 px
       *   destination: trigger top = 144 px
       *   correction:                 24 px
       *
       * After scrolling the destination by 24 px, the same stable trigger is
       * once again positioned at 120 px.
       */
      targetScrollY =
        window.scrollY +
        rect.top -
        anchorViewportTop;
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
