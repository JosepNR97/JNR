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
import { scrollToElementAfterLayout } from './scrollToElement';

const restoreHashPositionAfterMount =
  () => {
    const rawHash =
      window.location.hash.slice(1);

    if (!rawHash) {
      return;
    }

    let targetId = rawHash;

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

    /*
     * Localized pages are separate HTML documents whose section elements only
     * exist after React mounts. Explicitly restore the hash target now that
     * the DOM exists instead of relying solely on the browser's initial hash
     * navigation.
     */
    const documentElement =
      document.documentElement;

    const previousScrollBehavior =
      documentElement.style
        .scrollBehavior;

    documentElement.style
      .scrollBehavior = 'auto';

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

  /*
   * Reading does not consume the snapshot. This is important for React
   * StrictMode, which can invoke initial render logic more than once in
   * development. The snapshot is cleared only after the mounted application
   * has accepted it.
   */
  const [
    languageNavigationState,
  ] = useState(
    () =>
      readLanguageNavigationState(
        language,
      ),
  );

  const [
    expandedVendorId,
    setExpandedVendorId,
  ] =
    useState<string | null>(
      () =>
        languageNavigationState
          ?.expandedVendorId ??
        null,
    );

  useLayoutEffect(() => {
    if (
      !languageNavigationState
    ) {
      /*
       * Normal entry, reload or shared URL: no locale-transition snapshot
       * exists, so the explicit URL fragment remains authoritative.
       */
      restoreHashPositionAfterMount();

      return undefined;
    }

    let cancelled = false;

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
        let animationFrame = 0;

        animationFrame =
          window.requestAnimationFrame(
            () => {
              pendingAnimationFrames.delete(
                animationFrame,
              );

              if (
                cancelled
              ) {
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

    /*
     * The accordion states were already applied during the initial React
     * render, so start by restoring against the layout currently available
     * before the browser paints the mounted application.
     */
    restorePosition();
    restoreAcrossAnimationFrames();

    /*
     * Local webfonts can finish loading after the first React layout pass.
     * Their final metrics may reflow translated content above the restored
     * anchor. Correct the viewport again only after the browser reports that
     * all fonts required by the current document have finished loading.
     */
    const restoreAfterFonts =
      async () => {
        try {
          await document.fonts.ready;
        } catch {
          /*
           * Font readiness is an enhancement to geometric stability. A
           * failure must never prevent the locale navigation itself.
           */
        }

        if (cancelled) {
          return;
        }

        restorePosition();
        restoreAcrossAnimationFrames();
      };

    void restoreAfterFonts();

    /*
     * The document load event provides a second deterministic settlement
     * point for resources that can complete after the initial React commit.
     * Images that affect layout already reserve their dimensions, but this
     * final pass makes the hand-off resilient to any remaining initial
     * document layout work.
     */
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
     * The sessionStorage hand-off is one-shot. The in-memory state retained
     * by this mounted component is enough for the remaining corrective
     * passes, so the persisted snapshot can be removed immediately.
     */
    clearLanguageNavigationState();

    return () => {
      cancelled = true;

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

  const handleVendorToggle =
    useCallback(
      (
        vendorId: string,
      ) => {
        const shouldExpand =
          expandedVendorId !==
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
      [expandedVendorId],
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
          initialExpandedId={
            languageNavigationState
              ?.expandedExperienceId ??
            null
          }
        />

        <Education
          expandedVendorId={
            expandedVendorId
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
