import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { About } from './components/About';
import { Analytics } from './components/Analytics';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import {
  LanguageProvider,
  useLanguage,
} from './context/LanguageContext';
import {
  clearLanguageNavigationState,
  readLanguageNavigationState,
  restoreLanguageNavigationPosition,
} from './languageNavigationState';
import {
  persistExpandedExperienceId,
  persistExpandedVendorId,
  persistPortfolioReloadPosition,
  readPortfolioSessionState,
} from './portfolioSessionState';
import { scrollToElementAfterLayout } from './scrollToElement';

const getCurrentLocation =
  (): string =>
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

const isReloadNavigation =
  (): boolean => {
    if (
      typeof PerformanceNavigationTiming ===
      'undefined'
    ) {
      return false;
    }

    return performance
      .getEntriesByType(
        'navigation',
      )
      .some(
        (
          entry,
        ) =>
          entry instanceof
            PerformanceNavigationTiming &&
          entry.type ===
            'reload',
      );
  };

const restoreDocumentScrollY = (
  scrollY: number,
): void => {
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
        scrollY,
        maximumScrollY,
      ),
    );

  const documentElement =
    document.documentElement;

  const previousScrollBehavior =
    documentElement.style
      .scrollBehavior;

  documentElement.style
    .scrollBehavior =
    'auto';

  window.scrollTo({
    top:
      clampedScrollY,
    left:
      0,
    behavior:
      'auto',
  });

  documentElement.style
    .scrollBehavior =
    previousScrollBehavior;
};

const restoreHashPositionAfterMount =
  () => {
    const rawHash =
      window.location.hash.slice(1);

    if (!rawHash) {
      return;
    }

    let targetId =
      rawHash;

    try {
      targetId =
        decodeURIComponent(
          rawHash,
        );
    } catch {
      // Keep the raw hash if it is not valid percent-encoded text.
    }

    const target =
      document.getElementById(
        targetId,
      );

    if (!target) {
      return;
    }

    const documentElement =
      document.documentElement;

    const previousScrollBehavior =
      documentElement.style
        .scrollBehavior;

    documentElement.style
      .scrollBehavior =
      'auto';

    target.scrollIntoView({
      block:
        'start',
      behavior:
        'auto',
    });

    documentElement.style
      .scrollBehavior =
      previousScrollBehavior;
  };

const Portfolio = () => {
  const {
    language,
    t,
  } = useLanguage();

  const [
    languageNavigationState,
  ] = useState(
    () =>
      readLanguageNavigationState(
        language,
      ),
  );

  const [
    portfolioSessionState,
    setPortfolioSessionState,
  ] = useState(
    readPortfolioSessionState,
  );

  /*
   * Only a real browser reload may consume the persisted reload position.
   * Direct navigation, Back/Forward and locale navigation must not replay it.
   */
  const [
    reloadPosition,
  ] = useState(
    () => {
      if (
        !isReloadNavigation()
      ) {
        return null;
      }

      const candidate =
        portfolioSessionState
          .reloadPosition;

      if (
        !candidate ||
        candidate.location !==
          getCurrentLocation()
      ) {
        return null;
      }

      return candidate;
    },
  );

  /*
   * pagehide runs immediately before a reload or document navigation and is
   * compatible with the browser page lifecycle. The captured coordinate is
   * only consumed by a later document when that navigation is confirmed to
   * have been an actual reload.
   */
  useEffect(() => {
    const handlePageHide =
      () => {
        persistPortfolioReloadPosition({
          location:
            getCurrentLocation(),
          scrollY:
            Math.max(
              0,
              window.scrollY,
            ),
        });
      };

    window.addEventListener(
      'pagehide',
      handlePageHide,
    );

    return () => {
      window.removeEventListener(
        'pagehide',
        handlePageHide,
      );
    };
  }, []);

  useLayoutEffect(() => {
    const restorePosition =
      languageNavigationState
        ? () => {
            restoreLanguageNavigationPosition(
              languageNavigationState,
            );
          }
        : reloadPosition
          ? () => {
              restoreDocumentScrollY(
                reloadPosition.scrollY,
              );
            }
          : null;

    if (!restorePosition) {
      /*
       * A normal document entry has no transient viewport snapshot.
       * Explicit URL fragments therefore remain authoritative.
       */
      restoreHashPositionAfterMount();

      return undefined;
    }

    let cancelled =
      false;

    const pendingAnimationFrames =
      new Set<number>();

    const applyRestoration =
      () => {
        if (cancelled) {
          return;
        }

        restorePosition();
      };

    const requestTrackedAnimationFrame =
      (
        callback: () => void,
      ) => {
        let animationFrame =
          0;

        animationFrame =
          window.requestAnimationFrame(
            () => {
              pendingAnimationFrames.delete(
                animationFrame,
              );

              if (cancelled) {
                return;
              }

              callback();
            },
          );

        pendingAnimationFrames.add(
          animationFrame,
        );
      };

    const restoreAcrossAnimationFrames =
      () => {
        requestTrackedAnimationFrame(
          () => {
            applyRestoration();

            requestTrackedAnimationFrame(
              () => {
                applyRestoration();
              },
            );
          },
        );
      };

    /*
     * Expanded panels already exist in the first React layout because their
     * state was synchronously reconstructed from portfolioSessionState.
     */
    applyRestoration();
    restoreAcrossAnimationFrames();

    const restoreAfterFonts =
      async () => {
        try {
          await document.fonts.ready;
        } catch {
          /*
           * Font readiness improves geometric stability but must never make
           * navigation dependent on successful font loading.
           */
        }

        if (cancelled) {
          return;
        }

        applyRestoration();
        restoreAcrossAnimationFrames();
      };

    void restoreAfterFonts();

    const restoreAfterLoad =
      () => {
        if (cancelled) {
          return;
        }

        applyRestoration();
        restoreAcrossAnimationFrames();
      };

    if (
      document.readyState ===
      'complete'
    ) {
      restoreAfterLoad();
    } else {
      window.addEventListener(
        'load',
        restoreAfterLoad,
        {
          once:
            true,
        },
      );
    }

    /*
     * Only the locale-transition geometry is one-shot. Reload position is
     * tab-scoped and will simply be replaced by the next pagehide.
     */
    if (
      languageNavigationState
    ) {
      clearLanguageNavigationState();
    }

    return () => {
      cancelled =
        true;

      window.removeEventListener(
        'load',
        restoreAfterLoad,
      );

      for (
        const animationFrame
        of pendingAnimationFrames
      ) {
        window.cancelAnimationFrame(
          animationFrame,
        );
      }

      pendingAnimationFrames.clear();
    };
  }, [
    languageNavigationState,
    reloadPosition,
  ]);

  /*
   * These two setters are the single synchronization boundary between React
   * UI state and its tab-scoped persisted representation.
   */
  const setExpandedExperienceId =
    useCallback(
      (
        expandedExperienceId:
          string | null,
      ) => {
        setPortfolioSessionState(
          (
            currentState,
          ) => ({
            ...currentState,
            expandedExperienceId,
          }),
        );

        persistExpandedExperienceId(
          expandedExperienceId,
        );
      },
      [],
    );

  const setExpandedVendorId =
    useCallback(
      (
        expandedVendorId:
          string | null,
      ) => {
        setPortfolioSessionState(
          (
            currentState,
          ) => ({
            ...currentState,
            expandedVendorId,
          }),
        );

        persistExpandedVendorId(
          expandedVendorId,
        );
      },
      [],
    );

  const handleExperienceToggle =
    useCallback(
      (
        itemId: string,
      ) => {
        const shouldExpand =
          portfolioSessionState
            .expandedExperienceId !==
          itemId;

        setExpandedExperienceId(
          shouldExpand
            ? itemId
            : null,
        );

        if (shouldExpand) {
          scrollToElementAfterLayout(
            `experience-item-${itemId}`,
          );
        }
      },
      [
        portfolioSessionState
          .expandedExperienceId,
        setExpandedExperienceId,
      ],
    );

  const handleVendorToggle =
    useCallback(
      (
        vendorId: string,
      ) => {
        const shouldExpand =
          portfolioSessionState
            .expandedVendorId !==
          vendorId;

        setExpandedVendorId(
          shouldExpand
            ? vendorId
            : null,
        );

        if (shouldExpand) {
          scrollToElementAfterLayout(
            `education-card-${vendorId}`,
          );
        }
      },
      [
        portfolioSessionState
          .expandedVendorId,
        setExpandedVendorId,
      ],
    );

  const handleCertificationSelect =
    useCallback(
      (
        vendorId: string,
      ) => {
        setExpandedVendorId(
          vendorId,
        );

        scrollToElementAfterLayout(
          `education-card-${vendorId}`,
        );
      },
      [
        setExpandedVendorId,
      ],
    );

  const handleSkipToContent =
    useCallback(() => {
      document
        .getElementById(
          'main-content',
        )
        ?.focus();
    }, []);

  return (
    <div className="relative min-h-screen bg-slate-50">
      <a
        href="#main-content"
        onClick={
          handleSkipToContent
        }
        className="fixed left-4 top-4 z-[60] -translate-y-[calc(100%+2rem)] rounded-md bg-brand-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-150 focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        {
          t.accessibility
            .skipToContent
        }
      </a>

      <Header />

      <main
        id="main-content"
        tabIndex={-1}
      >
        <Hero />
        <About />

        <div
          id="certifications"
          className="scroll-mt-20"
        >
          <Certifications
            onSelectVendor={
              handleCertificationSelect
            }
          />
        </div>

        <Services />

        <Experience
          expandedId={
            portfolioSessionState
              .expandedExperienceId
          }
          onToggle={
            handleExperienceToggle
          }
        />

        <Education
          expandedVendorId={
            portfolioSessionState
              .expandedVendorId
          }
          onVendorToggle={
            handleVendorToggle
          }
        />

        <Contact />
      </main>

      <Footer />
      <Analytics />
    </div>
  );
};

const App = () => (
  <LanguageProvider>
    <Portfolio />
  </LanguageProvider>
);

export default App;
