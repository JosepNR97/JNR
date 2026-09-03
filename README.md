# 🚀 Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional multilingüe centrado en **estrategia**, **tecnología** e **innovación**. Presenta mi trayectoria, áreas de especialización, formación académica y certificaciones profesionales.

## 🌐 Portfolio publicado

🔗 **[https://josepnr97.github.io/JNR/](https://josepnr97.github.io/JNR/)**

## ✨ Funcionalidades

- 🌍 Contenido disponible en catalán, castellano e inglés.
- 📱 Interfaz responsive y accesible mediante teclado.
- 💼 Trayectoria profesional con proyectos desplegables.
- 🎓 Formación académica y certificaciones agrupadas por proveedor.
- 🏅 Carrusel continuo e interactivo de organizaciones acreditadoras, con navegación mediante clic y arrastre manual.
- ♿ Animaciones respetuosas con la preferencia `prefers-reduced-motion`.
- 🖼️ Recursos visuales servidos localmente, sin depender de URLs externas para los elementos gráficos de la interfaz.
- 📄 CV descargable en el idioma activo, generado automáticamente desde los datos del portfolio.
- 🔎 Metadatos SEO, Open Graph y datos estructurados de tipo `Person`.
- 📊 Google Analytics inicializado al cargar la web.
- ✅ Integración continua para validar pull requests antes de integrarlas.
- ⚙️ Despliegue automatizado mediante GitHub Actions y GitHub Pages.

## 🧰 Stack tecnológico

- **React 19** y **React DOM 19**.
- **TypeScript 6** en modo estricto.
- **Vite 8** para desarrollo y build.
- **Tailwind CSS 4** integrado directamente en Vite mediante `@tailwindcss/vite`.
- **Lucide React 1** para la iconografía de interfaz, complementado con SVG local cuando un icono deja de formar parte de la librería.
- **React PDF** para generar los CV en catalán, castellano e inglés.
- **Vitest 4** y **Testing Library 16** para pruebas.
- **ESLint 10** y **Prettier** para mantener la calidad y consistencia del código.

## 🖥️ Requisitos de desarrollo

El proyecto declara como entorno soportado:

- **Node.js:** `^24.15.0 || >=26.0.0`
- **npm:** `>=11.19.0 <12`
- **Package manager de referencia:** `npm@11.19.0`

Tailwind CSS 4 requiere navegadores modernos. El baseline de referencia del framework es:

- Safari 16.4+
- Chrome 111+
- Firefox 128+

## 🗂️ Estructura del proyecto

```text
.
├── .github/
│   └── workflows/              CI, auditoría y despliegue
├── components/                 Componentes de interfaz y sus pruebas
├── context/                    Estado y persistencia de idioma
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

## ✅ Controles de calidad

Los principales comandos disponibles son:

```bash
npm run lint
npm run test
npm run build
npm run check
npm run audit:security
npm run format:check
```

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

Toda pull request dirigida a `main` ejecuta además el workflow de CI desde una instalación limpia:

```text
npm ci
  ↓
npm run audit:security
  ↓
npm run check
```

El check de validación debe finalizar correctamente antes de integrar cambios en `main`.

La política de actualización y mantenimiento de dependencias se documenta en [docs/dependency-maintenance.md](docs/dependency-maintenance.md).

## 📦 Gestión de dependencias

El proyecto utiliza **npm** como package manager.

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

para ocultar conflictos entre dependencias.

Las actualizaciones major deben revisarse de manera independiente cuando puedan implicar:

- cambios de API;
- cambios en peer dependencies;
- modificaciones de tipos;
- migraciones de configuración;
- diferencias visuales;
- cambios en compatibilidad de navegadores;
- regresiones funcionales.

Dependabot revisa periódicamente tanto dependencias npm como GitHub Actions.

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

## 🖼️ Gestión de imágenes

Todos los recursos visuales utilizados directamente por la interfaz están almacenados en `public/assets/` y se referencian mediante `assetPath()`.

Esto evita que logos, insignias o fotografías desaparezcan por cambios, bloqueos o caducidad de servidores externos.

Los enlaces de credenciales, LinkedIn, Analytics y otros destinos de navegación pueden seguir siendo URLs externas porque no son recursos gráficos necesarios para renderizar la interfaz.

## ♿ Accesibilidad y movimiento

Las animaciones de entrada y los elementos interactivos tienen en cuenta:

```css
prefers-reduced-motion: reduce
```

Cuando el usuario solicita movimiento reducido:

- se eliminan las animaciones decorativas;
- se eliminan transiciones no esenciales;
- el carrusel de acreditadores no se desplaza automáticamente;
- el contenido sigue siendo completamente accesible mediante navegación manual.

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

## ©️ Licencia

© 2026 Josep Núñez Riba. Todos los derechos reservados.
