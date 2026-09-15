# Multilingual SEO architecture

The portfolio exposes three stable, indexable locale URLs:

- `https://josepnr97.github.io/JNR/ca/`
- `https://josepnr97.github.io/JNR/es/`
- `https://josepnr97.github.io/JNR/en/`

Each locale is a real Vite HTML entry. The HTML shells are generated from the existing typed portfolio content plus the SEO locale mapping in `seo.ts`; the React application and translation data remain shared. This avoids maintaining three hand-written copies of the page while ensuring that crawlers receive the correct `lang`, title, description, canonical, hreflang, Open Graph, Twitter, and JSON-LD metadata before JavaScript runs.

`vite.config.ts` generates the locale shells before Vite resolves its multipage inputs. The project keeps `base: './'`, so Vite emits relative asset references that continue to work below the GitHub Pages project path. The generated source directories (`/ca/`, `/es/`, `/en/`) are build inputs only and are ignored by Git; their built equivalents are emitted inside `dist/` and deployed normally by the existing Pages workflow.

The root `/JNR/` is intentionally not a second indexable copy of the Spanish page. It is a small `noindex,follow` language entry point that redirects once to the stored preference when available, otherwise to a supported browser language, with Spanish as the fallback. Its canonical and `x-default` point to `/JNR/es/`. The redirect preserves the current section hash and never runs on an explicit locale URL, preventing redirect loops.

Inside the application, `LanguageContext` treats an explicit locale segment in the URL as authoritative. `localStorage` is only a fallback when no locale segment exists and is updated after an explicit locale is loaded. Choosing another language navigates to the equivalent locale URL and preserves the query string and section hash.

GitHub Pages keeps the existing static `404.html`; there is no SPA fallback rewrite. Valid locale directories therefore resolve as normal static pages, while unknown URLs continue to return the dedicated 404 document. `robots.txt` remains valid and points to the sitemap. The sitemap lists only the three canonical locale URLs and includes reciprocal `xhtml:link` hreflang alternates plus `x-default`.
