# 🚀 Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional multilingüe centrado en **estrategia**, **tecnología** e **innovación**. Presenta mi trayectoria, áreas de especialización, formación académica y certificaciones profesionales.

## 🌐 Portfolio publicado

🔗 **[https://josepnr97.github.io/JNR/](https://josepnr97.github.io/JNR/)**

## ✨ Funcionalidades

- 🌍 Contenido disponible en catalán, castellano e inglés.
- 📱 Interfaz responsive y accesible mediante teclado.
- 💼 Trayectoria profesional con proyectos desplegables.
- 🎓 Formación académica y certificaciones agrupadas por proveedor.
- 🏅 Carrusel continuo e interactivo de organizaciones acreditadoras, arrastrable manualmente y respetuoso con `prefers-reduced-motion`.
- 🖼️ Recursos visuales servidos localmente, sin depender de URLs de imágenes externas.
- 📄 CV descargable en el idioma activo, generado automáticamente desde los datos del portfolio.
- 🔎 Metadatos SEO, Open Graph y datos estructurados de tipo `Person`.
- 📊 Google Analytics inicializado al cargar la web.
- ⚙️ Integración continua para pull requests y despliegue automatizado mediante GitHub Actions y GitHub Pages.

## 🧰 Stack tecnológico

- **React 19** y **React DOM 19**.
- **TypeScript 6** en modo estricto.
- **Vite 8** para desarrollo y build.
- **Tailwind CSS 4** compilado mediante `@tailwindcss/postcss`.
- **Lucide React 1** para la iconografía de interfaz, complementado con SVG local cuando un icono ya no forma parte de la librería.
- **React PDF** para generar los CV en catalán, castellano e inglés.
- **Vitest 4** y **Testing Library 16** para pruebas.
- **ESLint 10** y **Prettier** para mantener la calidad del código.

## 🖥️ Requisitos de desarrollo

El proyecto declara como entorno soportado:

- **Node.js:** `^24.15.0 || >=26.0.0`
- **npm:** `>=11.19.0 <12`
- **Package manager de referencia:** `npm@11.19.0`

Tailwind CSS 4 tiene como baseline de navegador Safari 16.4+, Chrome 111+ y Firefox 128+.

## 🗂️ Estructura del proyecto

```text
.
├── components/              Componentes de interfaz
├── context/                 Estado y persistencia de idioma
├── public/
│   ├── assets/
│   │   ├── certifications/  Insignias y certificados
│   │   ├── credential-issuers/ Logos de acreditadores
│   │   ├── education/       Universidades y centros formativos
│   │   ├── employers/       Empresas y organizaciones
│   │   ├── documents/       CV generados durante dev y build
│   │   └── people/          Fotografías personales
│   ├── robots.txt
│   └── sitemap.xml
├── test/                    Configuración de pruebas
├── scripts/                 Modelo, generador y pruebas de los CV
├── aboutMe.ts               Contenido personal y textos base
├── constants.ts             Formación, certificaciones y enlaces
├── experienceInfo.ts        Trayectoria profesional
├── translations.ts          Construcción de traducciones
├── types.ts                 Contratos TypeScript
├── styles.css               Estilos globales y Tailwind
└── index.tsx                Punto de entrada
