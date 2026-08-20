# 🚀 Josep Núñez Riba | Portfolio de estrategia tecnológica

Portfolio profesional multilingüe centrado en **estrategia**, **tecnología** e **innovación**. Presenta mi trayectoria, áreas de especialización, formación académica y certificaciones profesionales.

## 🌐 Portfolio publicado

🔗 **[https://josepnr97.github.io/JNR/](https://josepnr97.github.io/JNR/)**

## ✨ Funcionalidades

- 🌍 Contenido disponible en catalán, castellano e inglés.
- 📱 Interfaz responsive y accesible mediante teclado.
- 💼 Trayectoria profesional con proyectos desplegables.
- 🎓 Formación académica y certificaciones agrupadas por proveedor.
- 🏅 Carrusel interactivo de organizaciones acreditadoras.
- 🖼️ Recursos visuales servidos localmente, sin depender de URLs de imágenes externas.
- 📄 CV descargable en el idioma activo, generado automáticamente desde los datos del portfolio.
- 🔎 Metadatos SEO, Open Graph y datos estructurados de tipo `Person`.
- 📊 Google Analytics inicializado al cargar la web.
- ⚙️ Despliegue automatizado mediante GitHub Actions y GitHub Pages.

## 🧰 Stack tecnológico

- **React 18** y **TypeScript** en modo estricto.
- **Vite 8** para desarrollo y build.
- **Tailwind CSS** compilado mediante PostCSS.
- **Lucide React** para la iconografía de interfaz.
- **React PDF** para generar los CV en catalán, castellano e inglés.
- **Vitest** y **Testing Library** para pruebas.
- **ESLint** y **Prettier** para mantener la calidad del código.

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
```

## ▶️ Desarrollo local

```bash
npm ci
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Antes de iniciar Vite se generan los tres CV. También pueden regenerarse manualmente con `npm run generate:cv`; los PDF de `public/assets/documents/` se ignoran en Git y se recrean antes de cada build.

## ✅ Controles de calidad

```bash
npm run lint
npm run test
npm run build
npm run check
```

`npm run check` ejecuta lint, pruebas y build. Es el mismo control utilizado antes del despliegue en GitHub Actions.

## 🖼️ Gestión de imágenes

Todos los recursos visuales utilizados por la interfaz están almacenados en `public/assets/` y se referencian mediante `assetPath()`. Esto evita que logos o insignias desaparezcan por cambios, bloqueos o caducidad de servidores externos.

Los enlaces de credenciales, LinkedIn, Analytics y metadatos permanecen como URLs porque son destinos de navegación o servicios, no recursos gráficos de la interfaz.

## 🚢 Despliegue

Los cambios enviados a `main` activan el workflow de GitHub Pages. La instalación usa `npm ci`, por lo que `package-lock.json` debe mantenerse versionado y actualizado.

## ©️ Licencia

© 2026 Josep Núñez Riba. Todos los derechos reservados.
