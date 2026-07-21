# Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional desarrollado con React, TypeScript, Tailwind CSS y Vite. Presenta experiencia, áreas de especialización, formación y certificaciones en catalán, castellano e inglés.

## Funcionalidades

- Interfaz responsive y accesible mediante teclado.
- Selector de idioma con detección del navegador y persistencia local.
- Trayectoria profesional y certificaciones desplegables.
- Carrusel de organizaciones acreditadoras compatible con movimiento reducido.
- Metadatos SEO, Open Graph y datos estructurados de tipo `Person`.
- Google Analytics inicializado automáticamente al cargar la web.
- Despliegue automatizado en GitHub Pages.

## Stack

- React 18 y TypeScript estricto.
- Vite 5.
- Tailwind CSS compilado mediante PostCSS.
- Lucide React para iconografía.
- Vitest y Testing Library para pruebas.
- ESLint y Prettier para calidad de código.

## Estructura

```text
.
├── components/              Componentes de interfaz
├── context/                 Estado y persistencia de idioma
├── public/
│   ├── assets/              Imágenes organizadas por categoría
│   ├── robots.txt
│   └── sitemap.xml
├── test/                    Configuración de pruebas
├── aboutMe.ts               Contenido personal y textos base
├── constants.ts             Formación, certificaciones, imágenes y enlaces
├── experienceInfo.ts        Trayectoria profesional
├── translations.ts          Construcción de traducciones
├── types.ts                 Contratos TypeScript
├── styles.css               Estilos globales y directivas Tailwind
└── index.tsx                Punto de entrada
```

## Desarrollo local

```bash
npm ci
npm run dev
```

La aplicación queda disponible en la URL que indique Vite, normalmente `http://localhost:5173`.

## Controles de calidad

```bash
npm run lint
npm run test
npm run build
npm run check
```

`npm run check` ejecuta lint, pruebas y build. Es el mismo control utilizado antes del despliegue en GitHub Actions.

## Gestión de imágenes

Las imágenes locales se almacenan en `public/assets/` según su función:

- `people/`: fotografías personales.
- `credential-issuers/`: organizaciones acreditadoras.
- `education/`: universidades y centros de formación.
- `employers/`: empresas y organizaciones profesionales.
- `certifications/`: insignias y certificados.
- `brand/`: recursos de marca y Open Graph.

Las imágenes externas que siguen siendo estables pueden mantenerse por URL. Cuando una URL deje de ser fiable, el archivo debe incorporarse en la categoría correspondiente y referenciarse mediante `assetPath()`.

## Despliegue

Los cambios enviados a `main` activan el workflow de GitHub Pages. La instalación usa `npm ci`, por lo que `package-lock.json` debe mantenerse versionado y actualizado.

## Licencia

© 2026 Josep Núñez Riba. Todos los derechos reservados.
