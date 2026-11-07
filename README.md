# 🚀 Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional multilingüe centrado en **estrategia**, **tecnología** e **innovación**. Presenta mi trayectoria, áreas de especialización, formación académica y certificaciones profesionales.

## 🌐 Portfolio publicado

🔗 **https://josepnr97.github.io/JNR/**

El portfolio dispone de URLs estables e indexables para cada idioma:

- 🇨🇦 Català: **https://josepnr97.github.io/JNR/ca/**
- 🇪🇸 Español: **https://josepnr97.github.io/JNR/es/**
- 🇬🇧 English: **https://josepnr97.github.io/JNR/en/**

La raíz `/JNR/` actúa como punto de entrada de idioma. Redirige a la preferencia almacenada cuando existe, a un idioma compatible del navegador en caso contrario y finalmente a español como fallback.

## ✨ Funcionalidades

- 🌍 Contenido disponible en catalán, castellano e inglés mediante URLs estables `/ca/`, `/es/` y `/en/`.
- 📱 Interfaz responsive y accesible mediante teclado.
- 💼 Trayectoria profesional con proyectos desplegables.
- 🎓 Formación académica y certificaciones agrupadas por proveedor.
- 🏅 Carrusel continuo e interactivo de organizaciones acreditadoras, con navegación mediante clic y arrastre manual.
- ♿ Animaciones respetuosas con la preferencia `prefers-reduced-motion`.
- ♿ Accessibility smoke automatizado con Axe sobre estados reales de Chromium para detectar regresiones WCAG A/AA de alto impacto.
- 🖼️ Recursos visuales servidos localmente, con generación automática de variantes responsive cuando aportan una mejora real de entrega.
- 📄 CV descargable en el idioma activo, generado automáticamente desde los datos del portfolio.
- 🔎 SEO multilingüe indexable con metadata localizada disponible antes de cargar React: `lang`, title, description, canonical, hreflang, Open Graph, Twitter Cards y datos estructurados `Person`.
- 🗺️ Sitemap multilingüe con alternates `hreflang` recíprocos y `x-default`.
- 🚧 Página 404 estática y multilingüe que conserva el contexto de idioma y devuelve directamente al portfolio en el locale correspondiente.
- 📊 Google Analytics inicializado al cargar la web.
- 🧪 Smoke tests E2E con Chromium para validar interacción, layout, navegación multilingüe y comportamiento real de navegador.
- ✅ Integración continua para validar pull requests antes de integrarlas.
- 🔐 Dependency Review para impedir regresiones de seguridad sin bloquear la remediación de vulnerabilidades ya existentes.
- ⚙️ Despliegue automatizado mediante GitHub Actions y GitHub Pages.

## 🧰 Stack tecnológico

El stack se mantiene deliberadamente sobre las siguientes líneas principales:

- **React 19** y **React DOM 19**.
- **TypeScript 6** en modo estricto.
- **Vite 8** para desarrollo y build.
- **Tailwind CSS 4** integrado directamente en Vite mediante `@tailwindcss/vite`.
- **Lucide React** para iconografía de interfaz, complementado con SVG local cuando es necesario.
- **React PDF** para generar los CV en catalán, castellano e inglés.
- **Vitest 5** y **Testing Library** para pruebas unitarias y de componentes sobre jsdom.
- **Playwright** con **Chromium** para smoke tests E2E en navegador real.
- **Axe** mediante `@axe-core/playwright` para accessibility smoke automatizado sobre la misma infraestructura E2E.
- **ESLint 10** y **Prettier 3** para mantener la calidad y consistencia del código.

Las versiones concretas declaradas e instaladas **no se duplican en esta documentación**. La fuente de verdad es:

```text
package.json
package-lock.json
```

Las majors indicadas aquí representan decisiones arquitectónicas o de compatibilidad y solo deben modificarse cuando se realice una migración deliberada.

## 🖥️ Requisitos de desarrollo

El proyecto declara como entorno soportado:

- **Node.js:** `>=24.15.0 <25` — únicamente la rama Node 24.
- **npm:** `>=11.19.0 <12`.
- **Package manager de referencia:** `npm@11.19.0`.

Estos valores sí se documentan expresamente porque forman parte del contrato de entorno del proyecto.

`package.json` utiliza `devEngines` para rechazar con error los comandos npm relevantes cuando el runtime Node o la versión de npm no cumplen estos rangos.

El proyecto utiliza **npm** como único package manager soportado. No se declara soporte para pnpm ni Yarn.

La versión exacta `npm@11.19.0` es la referencia reproducible utilizada por CI, despliegue y mantenimiento del lockfile.

Si una instalación compatible de Node 24 incluye una versión anterior de npm, puede actualizarse mediante:

```bash
npm install --global npm@11.19.0
```

Tailwind CSS 4 requiere navegadores modernos. El baseline de referencia es:

- Safari 16.4+
- Chrome 111+
- Firefox 128+

## 🗂️ Estructura del proyecto

```text
.
├── .github/
│   ├── dependabot.yml          Actualizaciones periódicas y security updates
│   └── workflows/              CI, auditoría, CodeQL, lockfile y despliegue
├── components/                 Componentes de interfaz y sus pruebas
├── context/                    Estado y navegación de idioma
├── docs/
│   ├── dependency-maintenance.md
│   ├── image-delivery.md       Pipeline de imágenes responsive
│   └── multilingual-seo.md     Arquitectura SEO y URLs multilingües
├── e2e/                        Smoke tests E2E, SEO, 404 y accessibility
├── hooks/                      Hooks reutilizables
├── public/
│   ├── assets/
│   │   ├── certifications/     Insignias y certificados
│   │   ├── credential-issuers/ Logos de acreditadores
│   │   ├── education/          Universidades y centros formativos
│   │   ├── employers/          Empresas y organizaciones
│   │   ├── documents/          CV generados durante dev y build
│   │   └── people/             Fotografías personales
│   ├── 404.html                Página 404 estática y localizada
│   ├── robots.txt
│   └── sitemap.xml             URLs canónicas y hreflang
├── scripts/
│   ├── generate-cv.tsx
│   ├── generate-localized-html.ts
│   └── generate-responsive-images.ts
├── test/                       Configuración global de pruebas
├── aboutMe.ts                  Contenido personal y textos base
├── assetPath.ts                Resolución de assets para root y locales
├── constants.ts                Formación, certificaciones, recursos y enlaces
├── experienceInfo.ts           Trayectoria profesional
├── localeRouting.ts            Contrato de rutas CA/ES/EN
├── playwright.config.ts        Configuración de Playwright
├── seo.ts                      Metadata SEO localizada
├── translations.ts             Construcción de traducciones
├── types.ts                    Contratos TypeScript
├── vite.config.ts              Vite multipage y entradas localizadas
├── styles.css                  Estilos globales y entrada de Tailwind
└── index.tsx                   Punto de entrada React compartido
```

## ▶️ Desarrollo local

Instala las dependencias desde el lockfile y arranca Vite:

```bash
npm ci
npm run dev
```

Vite mostrará la URL local, normalmente:

```text
http://localhost:5173
```

La raíz local aplica la misma política de selección de idioma que el despliegue en GitHub Pages.

También pueden abrirse directamente las entradas localizadas:

```text
http://localhost:5173/ca/
http://localhost:5173/es/
http://localhost:5173/en/
```

Las tres rutas utilizan la misma aplicación React y los mismos datos de traducción, pero cada locale dispone de un documento HTML inicial específico con su propia metadata SEO.

La URL localizada es la fuente de verdad del idioma activo. Al cambiar de idioma desde `/ca/`, `/es/` o `/en/` se realiza una navegación de documento a la URL equivalente y se conservan la query string y el section hash cuando existen.

Antes de iniciar Vite se regeneran los CV y los assets responsive necesarios mediante `predev`.

También pueden ejecutarse manualmente:

```bash
npm run generate:cv
npm run generate:images
```

Los PDF de `public/assets/documents/` y las imágenes responsive generadas son outputs reproducibles y no necesitan mantenerse manualmente en Git.

### Smoke E2E en navegador real

Playwright utiliza únicamente Chromium como navegador E2E del proyecto.

Después de `npm ci`, instala el browser gestionado por la versión local de Playwright:

```bash
npx playwright install chromium
```

En Linux, si el entorno necesita además las dependencias del sistema:

```bash
npx playwright install --with-deps chromium
```

Ejecuta toda la smoke suite mediante:

```bash
npm run test:e2e
```

En desarrollo local, `npm run test:e2e` construye el artefacto de producción, levanta automáticamente `vite preview` y ejecuta todos los specs E2E —incluido accessibility smoke— con Chromium en modo headless.

En CI, el build ya ha sido generado y validado previamente mediante `npm run check`, por lo que Playwright reutiliza ese artefacto y evita un segundo build innecesario.

La suite valida también el contrato multilingüe en navegador real: URLs localizadas, cambio de idioma, persistencia de la preferencia, conservación de anchors y comportamiento de la página 404.

Para ejecutar únicamente la capa de accessibility smoke:

```bash
npm run test:a11y
```

La capa Axe complementa los tests funcionales comprobando problemas de accesibilidad automáticamente detectables sobre estados reales de la interfaz.

## ✅ Controles de calidad

Los principales comandos disponibles son:

```bash
npm run format
npm run format:check
npm run lint
npm run test
npm run build
npm run check
npm run test:e2e
npm run test:a11y
npm run audit:security
npm run audit:security:moderate
```

`npm run check` ejecuta secuencialmente:

```text
Prettier format check
  ↓
ESLint
  ↓
Vitest
  ↓
Generación de CV e imágenes responsive
  ↓
TypeScript
  ↓
Vite build
```

Playwright permanece fuera de `npm run check`.

Toda pull request dirigida a `main` ejecuta el job requerido:

```text
CI / validate
```

Para una PR normal, el flujo es:

```text
Dependency Review
  ├─ runtime / unknown: bloquea moderate+
  └─ development: bloquea high+
  ↓
npm ci --no-audit --fund=false
  ↓
npm run check
  ↓
Instalación de Chromium
  ↓
npm run test:e2e
```

Dependency Review evalúa las dependencias introducidas o modificadas por la PR respecto a `main`.

Una vulnerabilidad que ya existía en `main` no debe bloquear una PR que no la introduzca o empeore.

El mismo job `validate` cubre:

- seguridad incremental de dependencias;
- formato;
- lint;
- unit tests;
- TypeScript;
- build;
- E2E;
- accessibility smoke.

No existe un required check independiente para Playwright ni para Axe.

CodeQL se ejecuta mediante un workflow de seguridad independiente y complementario.

Si Playwright falla, los artefactos disponibles en `test-results/` pueden conservarse temporalmente para facilitar el diagnóstico.

La política detallada de actualización y seguridad se documenta en [docs/dependency-maintenance.md](docs/dependency-maintenance.md).

## 📦 Gestión de dependencias

El proyecto utiliza **npm** como único package manager soportado.

`packageManager`, `engines` y `devEngines` definen el contrato de entorno.

`package.json` y `package-lock.json` deben permanecer sincronizados.

No se debe editar `package-lock.json` manualmente ni utilizar opciones como:

```bash
npm ci --force
npm ci --legacy-peer-deps
```

para ocultar conflictos o saltarse el contrato de entorno.

Dependabot revisa periódicamente:

- dependencias npm;
- GitHub Actions.

Las actualizaciones normales pueden agruparse por familias relacionadas.

Las actualizaciones de seguridad npm se agrupan cuando es posible para permitir remediaciones coordinadas y evitar que varias PR dependientes se bloqueen mutuamente.

La configuración de Dependabot se activa únicamente desde:

```text
.github/dependabot.yml
```

en la rama por defecto.

Por tanto, es normal que GitHub muestre un aviso indicando que Dependabot no puede configurarse desde una branch de trabajo.

Cuando se actualice Playwright debe volver a instalarse el Chromium correspondiente antes de ejecutar la smoke suite.

Cuando se actualice `@axe-core/playwright` deben revisarse los cambios de reglas, impactos y tags soportados, ya que una actualización puede descubrir problemas de accesibilidad que la versión anterior no detectaba.

## 🔐 Seguridad de dependencias

El proyecto separa dos controles diferentes.

### Seguridad incremental de las PR

Dependency Review compara la PR con `main` y bloquea regresiones según esta política:

```text
runtime / unknown:
  moderate, high, critical → bloquean

development:
  high, critical → bloquean
  moderate → no bloquea
```

El objetivo del required check es impedir que una PR empeore la seguridad, no obligarla a resolver todas las vulnerabilidades históricas existentes.

### Estado absoluto de `main`

El estado completo del árbol se revisa mediante:

```bash
npm run audit:security
```

La política es:

```text
todo el árbol:
  high, critical → error

dependencias de producción:
  moderate, high, critical → error

development:
  moderate → seguimiento
```

Además:

```bash
npm run audit:security:moderate
```

permite revisar las vulnerabilidades `moderate` del árbol completo.

El workflow periódico `Dependency audit` aplica esta política a `main`.

Las vulnerabilidades `moderate` limitadas a tooling de desarrollo pueden mantenerse temporalmente como warnings cuando todavía no exista una remediación compatible.

Una vulnerabilidad descubierta posteriormente en una dependencia que ya está en `main` debe generar una remediación de seguridad, pero no congelar PRs no relacionadas.

El proyecto utiliza también:

```text
strict-allow-scripts=true
```

para evitar la ejecución indiscriminada de scripts de instalación.

## 🔎 Seguridad estática

CodeQL analiza JavaScript/TypeScript como una capa independiente de análisis estático.

Las responsabilidades quedan separadas:

```text
Dependency Review
  → evita introducir dependencias vulnerables

Dependency audit
  → supervisa el estado absoluto de main

Dependabot
  → propone actualizaciones y remediaciones

CodeQL
  → analiza vulnerabilidades en el código

CI funcional
  → valida formato, lint, tests, build y E2E
```

Ninguna capa por separado garantiza la ausencia de vulnerabilidades.

## 🖼️ Gestión de imágenes

Los recursos visuales utilizados directamente por la interfaz están almacenados en `public/assets/` y se referencian mediante `assetPath()`.

Las imágenes raster soportadas se evalúan automáticamente durante desarrollo y build para generar variantes responsive cuando aportan una reducción real del tamaño transferido.

La arquitectura específica se documenta en [docs/image-delivery.md](docs/image-delivery.md).

Los enlaces de credenciales, LinkedIn, Analytics y otros destinos de navegación pueden seguir siendo URLs externas porque no son recursos gráficos necesarios para renderizar la interfaz.

La smoke suite E2E no depende de Google Analytics ni de otros recursos externos para determinar su resultado.

## ♿ Accesibilidad y movimiento

Las animaciones y elementos interactivos respetan:

```css
prefers-reduced-motion: reduce;
```

La capa de accessibility smoke utiliza `@axe-core/playwright` sobre Chromium y cubre estados representativos de la interfaz, incluyendo:

- los tres idiomas;
- menú móvil abierto;
- carrusel interactivo;
- semántica y orden de foco;
- elementos ocultos del carrusel.

Los scans se limitan a tags WCAG A/AA configurados expresamente.

Solo deben utilizarse tags y reglas realmente soportados por la versión instalada de Axe.

No se deben inventar tags ni habilitar reglas experimentales únicamente para ampliar artificialmente la cobertura.

La baseline actual bloquea violations Axe con impacto:

```text
critical
serious
```

Las violations `moderate` y `minor` no bloquean CI actualmente, pero tampoco se desactivan reglas para conseguir un resultado verde.

Axe automatiza únicamente una parte de la evaluación de accesibilidad y no sustituye revisiones manuales de teclado, foco, lector de pantalla, contenido, zoom, reflow ni una auditoría WCAG completa.

## 🌍 Arquitectura multilingüe y SEO

El portfolio utiliza tres URLs canónicas e indexables:

```text
/JNR/ca/
/JNR/es/
/JNR/en/
```

Cada locale es una entrada HTML real de Vite y comparte la misma aplicación React, componentes y datos tipados.

Los documentos localizados incluyen antes de cargar React:

- `lang`;
- title;
- description;
- canonical;
- hreflang;
- Open Graph;
- Twitter Cards;
- JSON-LD.

La raíz `/JNR/` funciona como entrada `noindex,follow` y redirige al idioma correspondiente.

Dentro de una URL localizada, el locale de la propia URL es siempre autoritativo.

El sitemap publica las tres URLs canónicas con alternates `hreflang` recíprocos y `x-default`.

La arquitectura completa se documenta en [docs/multilingual-seo.md](docs/multilingual-seo.md).

## 🚢 Despliegue

Después de integrar una PR en `main`, GitHub Pages ejecuta:

```text
npm ci --no-audit --fund=false
  ↓
npm run check
  ↓
Generación de dist/
  ↓
Upload GitHub Pages artifact
  ↓
Deploy GitHub Pages
```

El despliegue no ejecuta un audit absoluto del árbol.

La seguridad de las nuevas dependencias ya ha sido evaluada mediante Dependency Review antes del merge y el estado absoluto de `main` se supervisa mediante `Dependency audit`.

Esta separación evita que una vulnerabilidad descubierta posteriormente en una dependencia ya existente impida desplegar su propia corrección u otro cambio no relacionado.

Playwright permanece fuera del workflow de deploy porque la smoke suite E2E ya forma parte del required check `validate` de la PR.

## ©️ Licencia

© 2026 Josep Núñez Riba. Todos los derechos reservados.
