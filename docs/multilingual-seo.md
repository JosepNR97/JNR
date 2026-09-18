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

On a localized page, choosing another language performs a full document navigation directly to the equivalent locale URL. React does not first apply a transient language state inside the current document.

The explicit language choice is persisted before leaving the current document, and the newly loaded locale document synchronizes its explicit URL locale back to `localStorage`.

Query strings and existing URL fragments are preserved exactly across a locale change.

For example:

`/JNR/es/?source=profile#experience`

becomes:

`/JNR/en/?source=profile#experience`

when English is explicitly selected.

The application does not add a section fragment merely because that section happens to be visible. A clean URL therefore remains clean:

`/JNR/es/`

becomes:

`/JNR/en/`

rather than automatically becoming something such as `/JNR/en/#experience`.

This keeps URL state distinct from transient browsing state.

## Continuity across language changes

Although each locale is a separate HTML document, changing language should feel to the user like translating the current page rather than navigating to a different browsing state.

Immediately before a locale-to-locale document navigation, the application therefore stores a short-lived navigation snapshot in `sessionStorage`.

The snapshot contains:

- the source and destination locale;
- the exact expected destination location;
- a stable DOM anchor representing the current viewport context;
- the anchor's vertical position within the viewport;
- the current absolute scroll position as a defensive fallback;
- the currently expanded Experience item, if any;
- the currently expanded professional Education provider, if any.

The snapshot is deliberately scoped to the current browser tab and is valid only for a short time. It is not a persistent user preference.

The destination document accepts the snapshot only when all of the following are true:

1. the snapshot is structurally valid;
2. it has not expired;
3. its destination locale matches the explicit locale in the loaded URL;
4. its expected pathname, query string, and fragment match the loaded location exactly.

Invalid, stale, mismatched, or obsolete snapshot versions are discarded.

## Viewport restoration

The portfolio does not simply copy an absolute `scrollY` value between translations.

Catalan, Spanish, and English copy can occupy different amounts of vertical space, so the same absolute page coordinate can correspond to a different piece of content after translation.

Instead, the source document identifies a stable DOM element around a reading point within the viewport. Stable section, accordion, trigger, and panel IDs remain equivalent across localized documents because they are derived from shared content identifiers rather than translated labels.

The snapshot stores the exact vertical viewport position of that stable anchor.

For example, if an Education trigger begins 120 pixels below the top of the viewport before changing language, the destination document positions the equivalent trigger 120 pixels below the top of the viewport after translation.

This intentionally differs from preserving proportional progress through an element. Translated labels and descriptions can change the height of a card or trigger. Preserving a percentage within that differently sized element would move the element itself on screen, even though the user only changed language.

After the destination React application has mounted and any expanded content has been restored, the equivalent stable element is located in the translated document. The application then scrolls by exactly the difference between its current viewport position and the viewport position captured in the source document.

This keeps the surrounding interface visually stationary across the locale switch even when translated content changes element heights.

The anchor's viewport position may be negative when the user is reading further down inside a large element whose top has already moved above the visible viewport. Negative positions are valid and are preserved.

An absolute scroll position is retained only as a fallback if the stable anchor cannot be found in the destination document.

At the very beginning or end of the document, the browser's valid scroll range may make an exact geometric match impossible. In those boundary cases, the restored scroll position is clamped to the available document range.

Viewport restoration is applied without smooth scrolling so a locale change does not visibly animate from the top of the destination document.

## Initial layout settlement

Restoring the viewport once immediately after React mounts is not sufficient to guarantee stable geometry.

The portfolio uses local Inter and Playfair Display webfonts. A localized document can therefore mount before all final font metrics have been applied. When those fonts finish loading, translated text higher in the page may reflow and change the document geometry even though the relevant accordion state itself has not changed.

Other initial document resources can also complete after the first React layout pass.

For that reason, viewport restoration uses several deterministic settlement points:

1. immediately after the destination React layout is committed;
2. across the next animation frames;
3. after `document.fonts.ready` resolves;
4. across additional animation frames after font settlement;
5. when the initial document `load` lifecycle has completed;
6. across additional animation frames after that final document settlement.

Every corrective pass uses the same stable anchor and the same captured viewport position.

The mechanism therefore compensates for initial layout shifts without relying on an arbitrary timeout.

The persisted `sessionStorage` snapshot is still one-shot. Once the destination application has accepted it, the stored copy is removed. The mounted React document retains the already validated snapshot in memory only long enough to complete the initial corrective passes.

## Expanded content restoration

Experience and professional Education accordions use stable IDs shared across all three translations.

When a language change occurs, the snapshot records the currently expanded item in each area.

The destination application uses these IDs as initial React state, so expanded panels are already part of the destination layout before viewport restoration is calculated.

This ordering is important:

1. load the localized document;
2. mount React with the same relevant panels expanded;
3. restore the previous viewport context using the expanded layout;
4. keep correcting that position while the initial document geometry settles;
5. discard the temporary hand-off state.

Only meaningful content state is transferred.

Ephemeral interaction state such as hover, keyboard focus, an open mobile navigation overlay, animation progress, or carousel autoplay timing is intentionally not carried across document navigations.

## One-shot state

The navigation snapshot exists only to bridge one explicit locale change.

After the destination document has accepted the state, its persisted copy is removed from `sessionStorage`.

A later reload, direct visit, Back/Forward navigation, or shared URL therefore does not inherit an obsolete expanded state or scroll position from an earlier locale switch.

This keeps explicit URL navigation predictable while still providing continuity during the user's immediate language change.

## Direct URLs and fragments

When no valid locale-transition snapshot exists, the URL remains the sole navigation authority.

For example, opening:

`/JNR/en/#experience`

directly, through a bookmark, after a reload, or from an external link must navigate to the Experience section normally.

Localized pages are separate HTML documents whose portfolio section elements are created when React mounts. The initial HTML shell can therefore be parsed before a fragment target such as `#experience` exists.

After React mounts, the application explicitly resolves the current URL fragment and scrolls to the corresponding element. This complements native browser fragment navigation and ensures that direct localized URLs work consistently.

During an explicit language switch, an existing fragment is still preserved in the destination URL, but the one-shot transition snapshot has priority for that immediate viewport restoration. This prevents a user who has moved deeper into the section from being sent back to its beginning merely because the URL still contains the section fragment.

After the snapshot is consumed, future direct navigation to the same URL once again follows the fragment normally.

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

Because GitHub Pages serves that document while preserving the originally requested URL, the 404 page can resolve its display language without creating three separate error documents.

Its language priority is:

1. an explicit locale in the missing URL;
2. a same-origin localized referrer;
3. the stored language preference;
4. a supported browser language;
5. Spanish as the final fallback.

The 404 document remains `noindex` and localizes its `lang`, title, description, message, and return action client-side.

Its return action points directly to the resolved localized portfolio URL, such as `/JNR/en/`, instead of returning through `/JNR/`, so an error page does not cause the user to lose language context or trigger an unnecessary language redirect.

## Sitemap and robots

`robots.txt` remains valid and points to the sitemap.

The sitemap lists only the three canonical locale URLs and includes reciprocal `xhtml:link` hreflang alternates plus `x-default`.

## Browser validation

The Playwright multilingual smoke suite validates the routing and locale-transition contract in a real Chromium browser.

It covers:

- initial localized metadata;
- explicit locale authority over stored preferences;
- direct navigation between every supported locale pair;
- persistence of the explicit language before leaving the source document;
- preservation of query strings;
- preservation of existing fragments;
- restoration of direct fragment URLs after React mounts;
- preservation of expanded Experience state across a locale change;
- preservation of expanded professional Education state across a locale change;
- preservation of the stable viewport-anchor position across translations;
- one-shot consumption of the temporary navigation snapshot;
- root-entry behavior.

The snapshot mechanism is an enhancement to browsing continuity only. The localized URL remains authoritative for language and SEO.
