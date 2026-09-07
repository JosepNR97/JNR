# 🚀 Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional multilingüe centrado en **estrategia**, **tecnología** e **innovación**. Presenta mi trayectoria, áreas de especialización, formación académica y certificaciones profesionales.

## 🌐 Portfolio publicado

🔗 **https://josepnr97.github.io/JNR/**

## ✨ Funcionalidades

* 🌍 Contenido disponible en catalán, castellano e inglés.
* 📱 Interfaz responsive y accesible mediante teclado.
* 💼 Trayectoria profesional con proyectos desplegables.
* 🎓 Formación académica y certificaciones agrupadas por proveedor.
* 🏅 Carrusel continuo e interactivo de organizaciones acreditadoras, con navegación mediante clic y arrastre manual.
* ♿ Animaciones respetuosas con la preferencia `prefers-reduced-motion`.
* ♿ Accessibility smoke automatizado con Axe sobre estados reales de Chromium para detectar regresiones WCAG A/AA de alto impacto.
* 🖼️ Recursos visuales servidos localmente, sin depender de URLs externas para los elementos gráficos de la interfaz.
* 📄 CV descargable en el idioma activo, generado automáticamente desde los datos del portfolio.
* 🔎 Metadatos SEO, Open Graph y datos estructurados de tipo `Person`.
* 📊 Google Analytics inicializado al cargar la web.
* 🧪 Smoke tests E2E con Chromium para validar interacción, layout y comportamiento real de navegador.
* ✅ Integración continua para validar pull requests antes de integrarlas.
* ⚙️ Despliegue automatizado mediante GitHub Actions y GitHub Pages.

## 🧰 Stack tecnológico

* **React 19** y **React DOM 19**.
* **TypeScript 6** en modo estricto.
* **Vite 8** para desarrollo y build.
* **Tailwind CSS 4** integrado directamente en Vite mediante `@tailwindcss/vite`.
* **Lucide React 1** para la iconografía de interfaz, complementado con SVG local cuando un icono deja de formar parte de la librería.
* **React PDF** para generar los CV en catalán, castellano e inglés.
* **Vitest 5** y **Testing Library 16** para pruebas unitarias y de componentes sobre jsdom.
* **Playwright 1.63** con **Chromium** para smoke tests E2E en navegador real.
* **Axe 4.13** mediante `@axe-core/playwright` para accessibility smoke automatizado sobre la misma infraestructura E2E.
* **ESLint 10** y **Prettier** para mantener la calidad y consistencia del código.

## 🖥️ Requisitos de desarrollo

El proyecto declara como entorno soportado:

* **Node.js:** `>=24.15.0 <25` — únicamente la rama Node 24.
* **npm:** `>=11.19.0 <12`.
* **Package manager de referencia:** `npm@11.19.0`.

`package.json` utiliza `devEngines` para rechazar con error los comandos npm relevantes cuando el runtime Node o la versión de npm no cumplen estos rangos.

El proyecto utiliza **npm** como único package manager soportado. No se declara soporte para pnpm ni Yarn.

La versión exacta `npm@11.19.0` es la referencia reproducible utilizada por CI y despliegue. Si una instalación compatible de Node 24 incluye una versión anterior de npm, puede actualizarse antes de instalar las dependencias mediante:

```bash
npm install --global npm@11.19.0
```

Tailwind CSS 4 requiere navegadores modernos. El baseline de referencia del framework es:

* Safari 16.4+
* Chrome 111+
* Firefox 128+

## 🗂️ Estructura del proyecto

```text
.
├── .github/
│   └── workflows/              CI, auditoría, CodeQL y despliegue
├── components/                 Componentes de interfaz y sus pruebas
├── context/                    Estado y persistencia de idioma
├── e2e/                        Smoke tests E2E y accessibility smoke con Chromium
├── hooks/                      Hooks reutilizables
├── public/
│   ├── assets/
│   │   ├── certifications/     Insignias y certificados
│   │   ├── credential-issuers/ Logos de acreditadores
│   │   ├── education/          Universidades y centros formativos
│   │   ├── employers/          Empresas y organizaciones
│   │   ├── documents/          CV generados durante dev y build
│   │   └── people/             Fotografías personales
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/                    Modelo, generador y pruebas de los CV
├── test/                       Configuración global de pruebas
├── aboutMe.ts                  Contenido personal y textos base
├── constants.ts                Formación, certificaciones, recursos y enlaces
├── experienceInfo.ts           Trayectoria profesional
├── playwright.config.ts        Configuración única de Playwright
├── translations.ts             Construcción de traducciones
├── types.ts                    Contratos TypeScript
├── styles.css                  Estilos globales y entrada de Tailwind
└── index.tsx                   Punto de entrada de la aplicación
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

Antes de iniciar Vite se generan los tres CV mediante el script `predev`.

También pueden regenerarse manualmente con:

```bash
npm run generate:cv
```

Los PDF de `public/assets/documents/` se ignoran en Git y se recrean antes de cada build.

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

`npm run test:e2e` construye el artefacto de producción mediante Vite, levanta automáticamente `vite preview` en `127.0.0.1:4173`, ejecuta todos los specs E2E —incluido accessibility smoke— con Chromium en modo headless y detiene el servidor al finalizar.

Para ejecutar únicamente la capa de accessibility smoke:

```bash
npm run test:a11y
```

`npm run test:a11y` reutiliza el mismo `playwright.config.ts`, el mismo build, el mismo servidor y el mismo Chromium; únicamente limita la ejecución a `e2e/accessibility.spec.ts`.

Los tests E2E funcionales validan únicamente comportamientos para los que un navegador real aporta señal adicional, como layout, `requestAnimationFrame`, transforms CSS, hover, pointer events, drag, responsive behavior y `prefers-reduced-motion`.

La capa Axe complementa esos tests comprobando problemas de accesibilidad automáticamente detectables sobre estados reales de la interfaz.

## ✅ Controles de calidad

Los principales comandos disponibles son:

```bash
npm run lint
npm run test
npm run build
npm run check
npm run test:e2e
npm run test:a11y
npm run audit:security
npm run format:check
```

`npm run test` ejecuta la suite rápida de Vitest sobre jsdom.

`npm run test:e2e` ejecuta la smoke suite completa de Playwright con Chromium sobre el build de producción, incluyendo accessibility smoke.

`npm run test:a11y` ejecuta únicamente los accessibility smoke tests basados en Axe.

`npm run check` ejecuta secuencialmente:

```text
ESLint
  ↓
Vitest
  ↓
Generación de CV
  ↓
TypeScript
  ↓
Vite build
```

Playwright no forma parte de `npm run check`. Esta separación mantiene rápido el control utilizado también durante el despliegue y evita instalar un browser en el workflow de GitHub Pages.

Toda pull request dirigida a `main` ejecuta el workflow de CI desde una instalación limpia:

```text
npm ci
  ↓
npm run audit:security
  ↓
npm run check
  ↓
Instalación de Chromium
  ↓
npm run test:e2e
```

La instalación de CI utiliza únicamente Chromium y sus dependencias del sistema.

El mismo job requerido `validate` cubre tanto la validación rápida como la smoke suite E2E completa, incluida la capa Axe. El check debe finalizar correctamente antes de integrar cambios en `main`.

No existe un job ni un required check independiente para accessibility.

CodeQL se ejecuta mediante un workflow de seguridad independiente y no forma parte del required check `validate`; durante su adopción inicial se mantiene como señal adicional no requerida.

Si Playwright falla en CI, se conservan temporalmente los artefactos de fallo disponibles en `test-results/`, como screenshots y trazas generadas por la política configurada.

La política de actualización y mantenimiento de dependencias se documenta en [docs/dependency-maintenance.md](docs/dependency-maintenance.md).

## 📦 Gestión de dependencias

El proyecto utiliza **npm** como único package manager soportado.

`packageManager` fija `npm@11.19.0` como versión de referencia, mientras que `engines.npm` y `devEngines.packageManager` permiten cualquier npm compatible dentro de `>=11.19.0 <12`.

`package.json` y `package-lock.json` deben permanecer siempre sincronizados.

Las instalaciones reproducibles en desarrollo, CI y despliegue se realizan mediante:

```bash
npm ci
```

No se debe editar `package-lock.json` manualmente ni utilizar opciones como:

```bash
npm ci --force
npm ci --legacy-peer-deps
```

para ocultar conflictos entre dependencias o saltarse el contrato de entorno.

Las actualizaciones major deben revisarse de manera independiente cuando puedan implicar:

* cambios de API;
* cambios en peer dependencies;
* modificaciones de tipos;
* migraciones de configuración;
* diferencias visuales;
* cambios en compatibilidad de navegadores;
* regresiones funcionales.

Dependabot revisa periódicamente tanto dependencias npm como GitHub Actions.

Cuando se actualice Playwright debe regenerarse el lockfile y volver a instalarse el Chromium correspondiente a la nueva versión antes de ejecutar la smoke suite.

Cuando se actualice `@axe-core/playwright` debe revisarse también el cambio de reglas y tags de Axe porque puede modificar qué problemas de accesibilidad detecta la suite.

## 🔐 Seguridad de dependencias

La auditoría utilizada por el proyecto es:

```bash
npm run audit:security
```

que ejecuta:

```bash
npm audit --audit-level=high
```

Las vulnerabilidades de severidad alta o crítica bloquean CI y despliegue.

Una instalación correcta mediante `npm ci` no garantiza por sí sola que la auditoría de seguridad vaya a pasar, ya que una dependencia transitiva puede quedar afectada por una vulnerabilidad aunque el árbol de dependencias sea técnicamente resoluble.

El proyecto utiliza además:

```text
strict-allow-scripts=true
```

para evitar la ejecución indiscriminada de scripts de instalación de dependencias.

Los browsers de Playwright se instalan explícitamente mediante su CLI; no se añaden paquetes de browsers ni se relaja la política de scripts del proyecto para descargarlos durante `npm ci`.

## 🔎 Seguridad estática

CodeQL analiza JavaScript/TypeScript como una capa independiente de análisis estático de seguridad, complementaria a los controles de dependencias basados en `npm audit` y Dependabot.

El workflow se ejecuta en pull requests hacia `main`, pushes a `main`, semanalmente y bajo demanda. Utiliza la query suite `default` de CodeQL para priorizar resultados de alta precisión y no repite la instalación, el build ni la suite funcional del proyecto.

Los hallazgos se publican en **Security → Code scanning** y, cuando proceda, aparecen asociados a los checks y annotations de las pull requests.

CodeQL complementa TypeScript, ESLint, tests y controles de dependencias; no garantiza la ausencia de vulnerabilidades ni sustituye una revisión de seguridad específica cuando sea necesaria.

## 🖼️ Gestión de imágenes

Todos los recursos visuales utilizados directamente por la interfaz están almacenados en `public/assets/` y se referencian mediante `assetPath()`.

Esto evita que logos, insignias o fotografías desaparezcan por cambios, bloqueos o caducidad de servidores externos.

Los enlaces de credenciales, LinkedIn, Analytics y otros destinos de navegación pueden seguir siendo URLs externas porque no son recursos gráficos necesarios para renderizar la interfaz.

La smoke suite E2E no depende de Google Analytics ni de otros recursos externos para determinar su resultado.

## ♿ Accesibilidad y movimiento

Las animaciones de entrada y los elementos interactivos tienen en cuenta:

```css
prefers-reduced-motion: reduce
```

Cuando el usuario solicita movimiento reducido:

* se eliminan las animaciones decorativas;
* se eliminan transiciones no esenciales;
* el carrusel de acreditadores no se desplaza automáticamente;
* el contenido sigue siendo completamente accesible mediante navegación manual.

Playwright valida este comportamiento utilizando la preferencia de movimiento reducido del contexto real de Chromium, sin mockear `matchMedia`.

La capa de accessibility smoke utiliza `@axe-core/playwright` sobre el mismo Chromium y cubre como mínimo:

* la página principal desktop en catalán, castellano e inglés;
* la correspondencia entre el idioma activo y `document.documentElement.lang`;
* el menú móvil después de abrirlo realmente;
* el carrusel de certificaciones en un estado interactivo con foco de teclado;
* las copias `aria-hidden` del carrusel, que deben permanecer fuera del tab order.

Los scans se limitan a reglas WCAG A/AA etiquetadas por Axe mediante:

```text
wcag2a
wcag2aa
wcag21a
wcag21aa
wcag22aa
```

Axe 4.13 no expone un tag `wcag22a` independiente. No se inventa ese tag ni se habilitan reglas experimentales manualmente.

La baseline inicial bloquea violations Axe con impacto:

```text
critical
serious
```

Las violations `moderate` y `minor` no bloquean CI en esta baseline inicial, pero tampoco se desactivan reglas para conseguir un resultado verde.

No se excluyen globalmente componentes como el carrusel o el menú móvil. Cuando un estado está oculto por defecto, Playwright lo activa antes de ejecutar Axe para analizar el DOM interactivo real.

Axe automatiza únicamente una parte de la evaluación de accesibilidad. Esta capa **no sustituye** revisiones manuales de teclado, foco, lector de pantalla, contenido, zoom, reflow ni una auditoría WCAG completa.

## 🚢 Despliegue

Las pull requests se validan mediante el workflow de CI antes del merge.

Después de integrar una pull request en `main`, el push resultante activa el workflow de GitHub Pages.

El pipeline de despliegue vuelve a ejecutar:

```text
npm ci
  ↓
npm run audit:security
  ↓
npm run check
  ↓
Generación de dist/
  ↓
Upload GitHub Pages artifact
  ↓
Deploy GitHub Pages
```

Esto garantiza que el código desplegado se valida nuevamente desde una instalación limpia, incluso aunque la pull request ya haya superado el CI.

La smoke suite Playwright permanece deliberadamente fuera de `npm run check`. El workflow de deploy no instala Chromium ni vuelve a ejecutar E2E; esa responsabilidad pertenece al job requerido `validate` de la pull request.

## ©️ Licencia

© 2026 Josep Núñez Riba. Todos los derechos reservados.
