import {
  useCallback,
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
  readPortfolioSessionState,
  updatePortfolioSessionState,
} from './portfolioSessionState';
import { scrollToElementAfterLayout } from './scrollToElement';

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
      block: 'start',
      behavior: 'auto',
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

  /*
   * Meaningful UI state belongs to the tab session, independently from the
   * one-shot locale-navigation snapshot.
   */
  const [
    portfolioSessionState,
    setPortfolioSessionState,
  ] = useState(
    readPortfolioSessionState,
  );

  useLayoutEffect(() => {
    if (
      !languageNavigationState
    ) {
      /*
       * Direct entry or reload: URL fragments remain authoritative.
       * Without a fragment, native browser scroll restoration is left alone.
       */
      restoreHashPositionAfterMount();

      return undefined;
    }

    let cancelled =
      false;

    const pendingAnimationFrames =
      new Set<number>();

    const restorePosition =
      () => {
        if (cancelled) {
          return;
        }

        restoreLanguageNavigationPosition(
          languageNavigationState,
        );
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
            restorePosition();

            requestTrackedAnimationFrame(
              () => {
                restorePosition();
              },
            );
          },
        );
      };

    restorePosition();
    restoreAcrossAnimationFrames();

    const restoreAfterFonts =
      async () => {
        try {
          await document.fonts.ready;
        } catch {
          /*
           * Font readiness improves geometric stability but is not required
           * for navigation to remain functional.
           */
        }

        if (cancelled) {
          return;
        }

        restorePosition();
        restoreAcrossAnimationFrames();
      };

    void restoreAfterFonts();

    const restoreAfterLoad =
      () => {
        if (cancelled) {
          return;
        }

        restorePosition();
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
          once: true,
        },
      );
    }

    /*
     * Geometry from a locale hand-off is one-shot. Accordion state is stored
     * independently and therefore remains available after this is cleared.
     */
    clearLanguageNavigationState();

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
  ]);

  const handleExperienceToggle =
    useCallback(
      (
        itemId: string,
      ) => {
        const shouldExpand =
          portfolioSessionState
            .expandedExperienceId !==
          itemId;

        const nextExpandedId =
          shouldExpand
            ? itemId
            : null;

        setPortfolioSessionState(
          (
            currentState,
          ) => ({
            ...currentState,
            expandedExperienceId:
              nextExpandedId,
          }),
        );

        updatePortfolioSessionState({
          expandedExperienceId:
            nextExpandedId,
        });

        if (shouldExpand) {
          scrollToElementAfterLayout(
            `experience-item-${itemId}`,
          );
        }
      },
      [
        portfolioSessionState
          .expandedExperienceId,
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

        const nextExpandedVendorId =
          shouldExpand
            ? vendorId
            : null;

        setPortfolioSessionState(
          (
            currentState,
          ) => ({
            ...currentState,
            expandedVendorId:
              nextExpandedVendorId,
          }),
        );

        updatePortfolioSessionState({
          expandedVendorId:
            nextExpandedVendorId,
        });

        if (shouldExpand) {
          scrollToElementAfterLayout(
            `education-card-${vendorId}`,
          );
        }
      },
      [
        portfolioSessionState
          .expandedVendorId,
      ],
    );

  const handleCertificationSelect =
    useCallback(
      (
        vendorId: string,
      ) => {
        setPortfolioSessionState(
          (
            currentState,
          ) => ({
            ...currentState,
            expandedVendorId:
              vendorId,
          }),
        );

        updatePortfolioSessionState({
          expandedVendorId:
            vendorId,
        });

        scrollToElementAfterLayout(
          `education-card-${vendorId}`,
        );
      },
      [],
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
