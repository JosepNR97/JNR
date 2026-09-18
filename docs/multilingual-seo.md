# Multilingual SEO architecture

The portfolio exposes three stable, indexable locale URLs:

- `https://josepnr97.github.io/JNR/ca/`
- `https://josepnr97.github.io/JNR/es/`
- `https://josepnr97.github.io/JNR/en/`

Each locale is a real Vite HTML entry. The HTML shells are generated from the existing typed portfolio content plus the SEO locale mapping in `seo.ts`; the React application and translation data remain shared. This avoids maintaining three hand-written copies of the page while ensuring that crawlers receive the correct `lang`, title, description, canonical, hreflang, Open Graph, Twitter, and JSON-LD metadata before JavaScript runs.

`vite.config.ts` generates the locale shells before Vite resolves its multipage inputs. The project keeps `base: './'`, so Vite emits relative asset references that continue to work below the GitHub Pages project path. The generated source directories (`/ca/`, `/es/`, `/en/`) are build inputs only and are ignored by Git; their built equivalents are emitted inside `dist/` and deployed normally by the existing Pages workflow.

The root `/JNR/` is intentionally not a second indexable copy of the Spanish page. It is a small `noindex,follow` language entry point whose resolution priority is:

1. a same-origin localized referrer;
2. the stored language preference;
3. a supported browser language;
4. Spanish as the final fallback.

The same-origin referrer safeguard preserves an existing explicit locale if the root entry point is reached from a localized portfolio page. Its canonical and `x-default` point to `/JNR/es/`. The root redirect preserves the current section hash and never runs on an explicit locale URL, preventing redirect loops.

Inside the application, `LanguageContext` treats an explicit locale segment in the URL as authoritative. `localStorage` is only a fallback when no locale segment exists. On a localized page, choosing another language performs a document navigation directly to the equivalent locale URL; React does not apply a transient language state before that navigation. The explicit language choice is persisted before leaving the current document, and the newly loaded locale document synchronizes its URL language back to `localStorage`.

Language changes also preserve the user's semantic position in the portfolio. Immediately before navigating, the application determines which main content section is currently being viewed:

- `top`
- `about`
- `certifications`
- `services`
- `experience`
- `education`
- `contact`

Except for `top`, the corresponding section ID becomes the fragment of the localized destination URL. The top section intentionally uses the clean localized URL without adding a redundant `#top` fragment.

For example, changing language while viewing Experience produces a navigation such as:

`/JNR/es/` → `/JNR/en/#experience`

instead of returning the user to the top of the English page.

The application preserves the query string during locale changes. It does not copy an absolute pixel scroll position because translated content can have different heights across Catalan, Spanish, and English. Preserving the semantic section therefore provides a more stable result than restoring the same `scrollY` value in another translation.

If an existing main-section fragment no longer reflects the part of the page currently being viewed because the user has manually scrolled elsewhere, the visible section takes precedence when changing language. For example, if the URL still contains `#about` but the user has scrolled to Services, switching language navigates to the corresponding `#services` section.

Fragments that are not one of the main section-level anchors are preserved as-is. This allows more specific deep links to remain intact rather than being replaced by the section-context logic.

The visible section is determined using a stable reading line below the fixed header rather than requiring a section heading to be exactly aligned with the top of the viewport. A special bottom-of-document case ensures that the short final Contact section can still be identified correctly when it cannot naturally reach that reading line.

Localized pages are separate HTML documents, so fragment restoration requires one additional client-side step. When a URL such as `/JNR/en/#experience` initially loads, the generated HTML shell exists before React has rendered the portfolio sections. The browser therefore cannot always perform its normal anchor scroll immediately because the `#experience` element does not yet exist.

After React mounts the portfolio DOM, the application explicitly resolves the current fragment and scrolls to the corresponding element. This restoration runs during layout initialization and temporarily disables smooth scrolling so that the correct section is positioned before the mounted page is presented, avoiding an unnecessary animated scroll from the top.

This means the locale-switch flow is:

1. determine the semantic section currently being viewed;
2. persist the explicitly selected language;
3. navigate directly to the localized URL with the appropriate query string and fragment;
4. mount the localized React application;
5. restore the fragment once its target exists in the DOM.

GitHub Pages keeps a single static `404.html`; there is no SPA fallback rewrite. Because GitHub Pages serves that document while preserving the originally requested URL, the 404 page can resolve its display language without creating three separate error documents. Its language priority is:

1. an explicit locale in the missing URL;
2. a same-origin localized referrer;
3. the stored language preference;
4. a supported browser language;
5. Spanish as the final fallback.

The 404 document remains `noindex` and localizes its `lang`, title, description, message, and return action client-side. Its return action points directly to the resolved localized portfolio URL, such as `/JNR/en/`, instead of returning through `/JNR/`, so an error page does not cause the user to lose language context or trigger an unnecessary language redirect.

`robots.txt` remains valid and points to the sitemap. The sitemap lists only the three canonical locale URLs and includes reciprocal `xhtml:link` hreflang alternates plus `x-default`.

The Playwright multilingual smoke suite validates the routing contract in a real Chromium browser. It covers explicit locale authority, stored-language conflicts, direct navigation between locales, preservation of query strings and semantic section context, restoration of section fragments after React mounts, root-entry behavior, and localized 404 navigation.
