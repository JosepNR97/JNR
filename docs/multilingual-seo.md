# Multilingual SEO architecture

The portfolio exposes three stable, indexable locale URLs:

- `https://josepnr97.github.io/JNR/ca/`
- `https://josepnr97.github.io/JNR/es/`
- `https://josepnr97.github.io/JNR/en/`

Each locale is a real Vite HTML entry. The HTML shells are generated from the existing typed portfolio content plus the SEO locale mapping in `seo.ts`; the React application and translation data remain shared. This avoids maintaining three hand-written copies of the page while ensuring that crawlers receive the correct `lang`, title, description, canonical, hreflang, Open Graph, Twitter, and JSON-LD metadata before JavaScript runs.

`vite.config.ts` generates the locale shells before Vite resolves its multipage inputs. The project keeps `base: './'`, so Vite emits relative asset references that continue to work below the GitHub Pages project path. The generated source directories (`/ca/`, `/es/`, `/en/`) are build inputs only and are ignored by Git; their built equivalents are emitted inside `dist/` and deployed normally by the existing Pages workflow.

The root `/JNR/` is intentionally not a second indexable copy of the Spanish page. It is a small `noindex,follow` language entry point that redirects once to the stored preference when available, otherwise to a supported browser language, with Spanish as the fallback. Its canonical and `x-default` point to `/JNR/es/`. The redirect preserves the current section hash and never runs on an explicit locale URL, preventing redirect loops.

Inside the application, `LanguageContext` treats an explicit locale segment in the URL as authoritative. `localStorage` is only a fallback when no locale segment exists. On a localized page, choosing another language performs a document navigation directly to the equivalent locale URL; React does not apply a transient language state before that navigation. The explicit language choice is persisted before leaving the current document, and the newly loaded locale document synchronizes its URL language back to `localStorage`.

Language changes also preserve the user's semantic position in the portfolio. Immediately before navigating, the application determines which main content section is currently being viewed: `top`, `about`, `certifications`, `services`, `experience`, `education`, or `contact`. Except for `top`, the corresponding section ID becomes the fragment of the localized destination URL. Query strings are preserved. This keeps the user in the same part of the portfolio without copying an absolute pixel offset, which would be unreliable because translated content can have different heights.

If an existing main-section fragment no longer reflects the part of the page currently being viewed because the user has scrolled elsewhere, the visible section takes precedence when changing language. More specific fragments that are not part of the main section set are preserved as-is. The top section intentionally uses the clean localized URL without adding a redundant `#top` fragment.

GitHub Pages keeps a single static `404.html`; there is no SPA fallback rewrite. Because GitHub Pages serves that document while preserving the originally requested URL, the 404 page can resolve its display language without creating three separate error documents. Its language priority is: an explicit locale in the missing URL, a same-origin localized referrer, the stored language preference, a supported browser language, and finally Spanish.

The 404 document remains `noindex` and localizes its `lang`, title, description, message, and return action client-side. Its return action points directly to the resolved localized portfolio URL, such as `/JNR/en/`, instead of returning through `/JNR/`, so an error page does not cause the user to lose language context or trigger an unnecessary language redirect.

`robots.txt` remains valid and points to the sitemap. The sitemap lists only the three canonical locale URLs and includes reciprocal `xhtml:link` hreflang alternates plus `x-default`.
