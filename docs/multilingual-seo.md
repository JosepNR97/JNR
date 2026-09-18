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

## Localized application navigation

Inside the application, `LanguageContext` treats an explicit locale segment in the URL as authoritative. `localStorage` is only a fallback when no locale segment exists.

On a localized page, choosing another language performs a full document navigation directly to the equivalent locale URL.

The explicit language choice is persisted before leaving the current document, and the newly loaded locale document synchronizes its explicit URL locale back to `localStorage`.

Query strings and existing URL fragments are preserved exactly across a locale change.

For example:

`/JNR/es/?source=profile#experience`

becomes:

`/JNR/en/?source=profile#experience`

when English is selected.

The application does not create a fragment merely because a particular section happens to be visible. A clean localized URL therefore remains clean.

## Tab-scoped portfolio state

Meaningful browsing state is retained for the lifetime of the current browser tab.

`portfolioSessionState.ts` owns this persisted contract. It contains:

- the expanded Experience item, if any;
- the expanded professional Education provider, if any;
- the most recent document location and scroll coordinate captured before the document is left.

The state uses `sessionStorage`, not `localStorage`.

It therefore survives reloads and locale changes within the same tab without becoming a long-term preference that unexpectedly reappears in an unrelated future browser session.

`App` is the single React owner of expandable portfolio UI state. Experience and Education are controlled components and do not access browser storage directly.

The synchronization boundary between React state and `sessionStorage` is centralized in `App`, while the storage module owns serialization, validation and persistence.

Selecting a professional provider directly in Education and selecting the same provider through the Certifications carousel both use the same state path.

Transient interaction state such as hover, keyboard focus, mobile navigation overlays, carousel autoplay progress and animation state is intentionally not persisted.

## Expanded content restoration

Experience and professional Education use stable IDs that are common to all three translations.

Their persisted IDs are read synchronously during the initial application render.

Expanded panels therefore exist in the first mounted layout rather than being opened later by an effect.

This is important for both reload and locale continuity because viewport restoration is calculated against the same meaningful UI geometry the user was previously browsing.

Closing an accordion explicitly stores `null`, so a later reload does not reopen content the user intentionally closed.

## Reload continuity

A normal browser reload is treated differently from other document navigations.

Immediately before the current document is hidden, `pagehide` stores:

- the exact pathname, query string and fragment;
- the current vertical scroll coordinate.

The next document considers that coordinate only when `PerformanceNavigationTiming` identifies the navigation as an actual `reload`.

The stored location must also exactly match the newly loaded location.

This prevents a coordinate captured on one page from being replayed during:

- direct navigation;
- a locale change;
- Back/Forward navigation;
- a visit to another localized URL.

On an actual reload, expanded Experience and Education state is reconstructed first. The saved scroll coordinate is then restored against that layout.

The restoration is corrected during initial layout settlement so late font or resource metrics do not leave the user at a different visual position.

This makes F5 continuity an explicit application contract instead of depending on browser-native scroll restoration behavior.

If an explicit fragment is present during an actual reload, the reload snapshot takes priority for that immediate reload because the user may have moved away from the beginning of the referenced section.

For a fresh direct navigation with no valid reload snapshot, the URL fragment remains authoritative.

## Locale-transition navigation state

A separate one-shot state exists exclusively for locale-to-locale navigation.

`languageNavigationState.ts` does not store portfolio accordion state.

Its responsibility is limited to the geometry required to preserve the user's visual position when translated content changes height.

Immediately before changing locale, it records:

- the source locale;
- the destination locale;
- the exact destination location;
- a stable DOM anchor representing the current viewport context;
- that anchor's vertical position inside the viewport;
- the current absolute scroll position as a fallback.

The destination document accepts this snapshot only when it is structurally valid, has not expired, targets the current locale and matches the exact loaded pathname, query string and fragment.

Invalid, stale or mismatched snapshots are discarded.

## Viewport restoration across translations

The portfolio does not simply copy an absolute `scrollY` value from one language to another.

Catalan, Spanish and English content can occupy different vertical space, so the same absolute page coordinate may represent different content after translation.

Instead, the source document identifies a stable DOM anchor around a reading point within the viewport.

Stable section and content IDs remain equivalent across localized documents because they are derived from shared identifiers rather than translated labels.

The locale-transition snapshot records the anchor's exact viewport position.

After the destination React application mounts, the same stable element is found and the document is adjusted so that the element returns to the same screen position.

An absolute scroll position is retained only as a defensive fallback if the stable anchor cannot be found.

At the beginning or end of the document, the requested position is clamped to the browser's available scroll range.

Viewport restoration runs without smooth scrolling so a language change does not visibly animate from the top of the new document.

## Restoration priority

Viewport restoration follows a single priority order:

1. a valid locale-transition snapshot;
2. a valid reload position for an actual reload of the exact same location;
3. an explicit URL fragment;
4. otherwise no application-driven scroll restoration.

This prevents the independent navigation mechanisms from competing with each other.

The locale snapshot wins during a language change because translated content may have different geometry.

The reload snapshot wins during F5 because it represents the precise position the user occupied immediately before reloading.

A fragment remains authoritative for normal direct navigation, bookmarks and shared URLs.

## Initial layout settlement

A document can continue changing geometry shortly after React mounts.

The portfolio uses local Inter and Playfair Display webfonts, and final font metrics can reflow content after the first React layout pass.

For both locale-transition and reload restoration, the selected position is corrected at deterministic settlement points:

1. immediately after the destination React layout is committed;
2. across the following animation frames;
3. after `document.fonts.ready`;
4. across additional animation frames after font settlement;
5. after the initial document `load` lifecycle;
6. across additional animation frames after that final settlement.

This avoids relying on an arbitrary timeout.

Only the locale-transition snapshot is one-shot. Once accepted by the destination document, its persisted copy is removed.

The reload coordinate belongs to the tab-scoped portfolio state and is replaced by the next `pagehide`.

## Direct URLs and fragments

When neither a valid locale-transition snapshot nor a valid reload snapshot applies, the URL is authoritative for explicit fragment navigation.

For example:

`/JNR/en/#experience`

must navigate to Experience when opened directly, through a bookmark or from an external link.

Localized portfolio sections are created by React, so the browser can initially encounter the fragment before the corresponding DOM element exists.

After React mounts, the application explicitly resolves the current fragment and restores its target. This complements native fragment navigation.

During an explicit language switch, an existing fragment remains present in the destination URL, but the valid one-shot locale snapshot controls that immediate transition so that a user deeper inside the section is not unnecessarily moved back to its beginning.

## Root entry point

The root `/JNR/` remains a language-entry document rather than an application page.

Its language resolution order is:

1. same-origin localized referrer;
2. stored language preference;
3. supported browser language;
4. Spanish.

Its redirect preserves an existing section fragment.

Normal locale-to-locale navigation does not pass through the root entry point.

## Static 404

GitHub Pages keeps a single static `404.html`; there is no SPA fallback rewrite.

The 404 page resolves its display language using:

1. an explicit locale in the missing URL;
2. a same-origin localized referrer;
3. the stored language preference;
4. a supported browser language;
5. Spanish as the final fallback.

The document remains `noindex` and localizes its `lang`, title, description, message and return action client-side.

Its return action points directly to the resolved localized portfolio URL instead of navigating through `/JNR/`.

## Sitemap and robots

`robots.txt` points to the sitemap.

The sitemap lists only the three canonical locale URLs and includes reciprocal `xhtml:link` hreflang alternates plus `x-default`.

## Validation strategy

Different test layers intentionally validate different responsibilities.

Vitest validates the `portfolioSessionState` persistence contract, including:

- safe empty defaults;
- valid persisted state;
- malformed JSON;
- invalid persisted schemas;
- obsolete versions;
- independent accordion updates;
- explicit closed state;
- reload-position persistence.

Component tests validate controlled accordion behavior and accessibility semantics without coupling those components to browser storage.

Playwright validates user-visible behavior in Chromium, including:

- expanded Experience and Education content surviving reload;
- viewport context surviving reload;
- a provider opened from the Certifications carousel surviving reload;
- a logo click selecting its provider;
- a drag beginning on the same logo not selecting the provider;
- locale changes preserving expanded content;
- locale changes preserving translated viewport context;
- explicit query strings and fragments surviving locale navigation;
- direct fragment URLs being restored after React mounts.

The click and drag carousel scenarios are separate E2E tests because portfolio state is intentionally persistent within a tab. Playwright's per-test browser-context isolation provides the correct clean-state boundary without manipulating application storage from the test.

E2E tests intentionally avoid decoding or resetting the portfolio `sessionStorage` representation. Its serialized format is an implementation detail covered by unit tests rather than part of the browser-level behavioral contract.

The localized URL remains authoritative for language and SEO.
