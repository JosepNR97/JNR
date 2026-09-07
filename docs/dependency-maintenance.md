# Mantenimiento de dependencias

Este documento define las reglas de mantenimiento, actualización y validación de las dependencias del portfolio.

## Baseline tecnológico actual

Baseline revisado tras la migración major realizada en septiembre de 2026, el endurecimiento posterior del contrato Node/npm y la incorporación de smoke testing E2E en navegador real.

| Componente | Baseline actual |
| --- | --- |
| Node.js | `>=24.15.0 <25` |
| npm | `>=11.19.0 <12` |
| Package manager de referencia | `npm@11.19.0` |
| `@types/node` | `24.x` |
| React | `19.2.x` |
| React DOM | `19.2.x` |
| TypeScript | `6.0.x` |
| typescript-eslint | `8.69.x` |
| Vite | `8.2.x` |
| Tailwind CSS | `4.3.x` |
| Integración Tailwind | `@tailwindcss/vite` `4.3.x` |
| Lucide React | `1.x` |
| Testing Library React | `16.3.x` |
| Testing Library DOM | `10.4.x` |
| Vitest | `5.0.x` |
| Playwright | `@playwright/test` `1.63.x` |
| Navegador E2E | Chromium gestionado por Playwright |
| ESLint | `10.x` |

`package.json` y `package-lock.json` son la fuente de verdad para las versiones concretas instaladas.

## Contrato de runtime y desarrollo Node/npm

El proyecto soporta oficialmente una única rama de runtime:

```text
Node.js >=24.15.0 <25
```

Esto significa que:

- Node 24.15.0 es el mínimo declarado;
- se aceptan posteriores minor y patch de Node 24;
- Node 25 no está soportado;
- Node 26 no está soportado todavía;
- ninguna major futura se incorpora automáticamente por existir o por ser compatible con alguna dependencia aislada.

El contrato de npm es:

```text
npm >=11.19.0 <12
```

`npm@11.19.0` se mantiene además como versión exacta de referencia para CI, despliegue y regeneración del lockfile.

### `engines`

`engines` expresa el contrato público de compatibilidad del proyecto:

```json
{
  "engines": {
    "node": ">=24.15.0 <25",
    "npm": ">=11.19.0 <12"
  }
}
```

Por sí solo, `engines` no se utiliza como mecanismo principal de bloqueo del entorno de desarrollo. Sin `engine-strict`, npm lo trata como metadata de compatibilidad y normalmente puede limitarse a advertir.

### `packageManager`

El proyecto declara:

```json
{
  "packageManager": "npm@11.19.0"
}
```

Este campo identifica npm como package manager de referencia y fija una versión exacta para herramientas que consumen esta metadata.

No debe confundirse con un rango de compatibilidad:

- no sustituye a `engines.npm`;
- no sustituye a `devEngines.packageManager`;
- no hace que el binario `npm` instalado globalmente cambie automáticamente de versión;
- la reproducibilidad de CI se consigue instalando explícitamente `npm@11.19.0` antes de las operaciones del proyecto.

### `devEngines`

El proyecto utiliza `devEngines` para validar de forma estricta el runtime y el package manager en los comandos npm relevantes:

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": ">=24.15.0 <25",
      "onFail": "error"
    },
    "packageManager": {
      "name": "npm",
      "version": ">=11.19.0 <12",
      "onFail": "error"
    }
  }
}
```

La forma correcta para Node es `devEngines.runtime`; no se utiliza un campo arbitrario `devEngines.node`.

La forma correcta para npm es `devEngines.packageManager`.

Con `onFail: "error"`, un entorno incompatible hace fallar los comandos npm que aplican esta validación, entre ellos:

```text
npm install
npm ci
npm run <script>
```

Esto cubre, dentro del baseline soportado por npm 11, casos como:

- Node 22;
- Node 26;
- npm anterior a 11.19.0;
- npm 12 o posterior.

`devEngines` existe también en versiones recientes de npm 10, pero el proyecto no declara soporte para npm 10. Clientes npm suficientemente antiguos pueden no conocer este campo; no se añade `engine-strict` únicamente para cubrir clientes fuera del baseline soportado.

### Bootstrap de npm

Una instalación de Node 24 compatible puede incluir una versión de npm anterior a 11.19.0.

Antes de ejecutar `npm ci` o cualquier `npm run <script>`, actualizar npm mediante:

```bash
npm install --global npm@11.19.0
```

Los workflows del repositorio realizan explícitamente este bootstrap.

### Por qué no se utiliza `engine-strict`

El repositorio mantiene:

```text
strict-allow-scripts=true
```

pero no añade:

```text
engine-strict=true
```

`devEngines` ya proporciona el bloqueo específico que se necesita para el entorno de desarrollo del proyecto.

Activar `engine-strict` ampliaría el alcance de la política a los `engines` declarados por las dependencias del árbol, alterando la semántica de instalación más allá del objetivo de esta política.

Por tanto, `engine-strict` solo debería considerarse en una decisión separada si existe una necesidad explícita de endurecer también el árbol completo de dependencias.

### Relación entre Node y `@types/node`

Mientras el runtime oficialmente soportado sea Node 24, `@types/node` debe permanecer en la major 24.

La intención es mantener alineación conceptual de major:

```text
Runtime: Node 24
Tipos:   @types/node 24.x
```

No se exige que el patch de `@types/node` coincida con el patch del runtime.

Actualizar `@types/node` a 26 antes de adoptar Node 26 podría hacer disponibles en TypeScript APIs que no forman parte del runtime oficialmente soportado.

Dependabot puede seguir proponiendo actualizaciones minor y patch de `@types/node` dentro de 24.x, pero las actualizaciones semver-major permanecen bloqueadas mientras Node 24 siga siendo el runtime oficial.

### Futuras majors de Node

Una nueva major de Node solo se declarará como soportada después de una validación deliberada.

Cuando se evalúe una futura migración a Node 26 deberá revisarse como mínimo:

1. compatibilidad real de todas las dependencias y herramientas directas;
2. ejecución completa de lint, tests, generación de CV y build;
3. ejecución de la smoke suite E2E con la versión de Playwright soportada;
4. versión mínima concreta de Node 26 que se quiera soportar;
5. actualización de `engines.node` con un rango acotado que no incluya Node 27 automáticamente;
6. actualización equivalente de `devEngines.runtime`;
7. estrategia de GitHub Actions para la nueva rama de Node;
8. migración de `@types/node` a la major 26 cuando el runtime oficial cambie;
9. revisión de la versión de npm soportada y de referencia;
10. regeneración controlada de `package-lock.json`;
11. actualización de README y de este documento.

Si se decide mantener temporalmente más de una major de Node, cada major deberá aparecer mediante un rango explícitamente acotado.

No utilizar un tramo abierto como:

```text
>=26.0.0
```

La migración de Node y la migración de TypeScript son decisiones independientes. Adoptar Node 26 no implica adoptar TypeScript 7.

## Controles automáticos

El repositorio dispone de varios controles complementarios:

- Dependabot revisa periódicamente paquetes npm y GitHub Actions.
- Las pull requests dirigidas a `main` ejecutan el workflow de CI.
- El workflow de CI utiliza una release actual de la rama Node 24.
- CI instala explícitamente `npm@11.19.0` antes de los comandos del proyecto.
- El workflow de CI instala las dependencias mediante `npm ci`.
- La auditoría de seguridad se ejecuta antes de lint, tests y build.
- `npm run check` ejecuta la validación rápida basada en ESLint, Vitest, TypeScript y Vite.
- CI instala únicamente Chromium mediante el Playwright incluido en `node_modules`.
- La smoke suite E2E se ejecuta mediante `npm run test:e2e` dentro del mismo job `validate`.
- El check de validación debe superar tanto los controles rápidos como los E2E antes del merge.
- Los pushes a `main` vuelven a ejecutar instalación, auditoría, validación y build antes del despliegue en GitHub Pages.
- El workflow de despliegue no instala Chromium ni ejecuta Playwright.
- Existe además un workflow periódico específico para auditar vulnerabilidades.
- Las vulnerabilidades de severidad `high` o `critical` bloquean los pipelines.
- `strict-allow-scripts=true` restringe la ejecución de scripts de instalación de dependencias.
- `devEngines` rechaza los entornos Node/npm incompatibles en los comandos npm relevantes.

## Instalaciones reproducibles

El proyecto utiliza npm como único package manager soportado y mantiene `package-lock.json` versionado.

La instalación utilizada por CI y despliegue es:

```bash
npm ci
```

`package.json` y `package-lock.json` deben permanecer sincronizados.

Después de cualquier modificación de dependencias o de metadata reproducida en el lockfile debe comprobarse como mínimo:

```bash
npm ci
npm run audit:security
npm run check
```

Cuando el cambio pueda afectar a UI, CSS, eventos de navegador, Playwright o sus dependencias debe ejecutarse además:

```bash
npx playwright install chromium
npm run test:e2e
```

En CI y en entornos Linux que necesiten las dependencias del sistema se utiliza:

```bash
npx playwright install --with-deps chromium
```

No utilizar:

```bash
npm ci --force
npm ci --legacy-peer-deps
```

para ocultar conflictos de peer dependencies o saltarse controles del entorno.

Un conflicto debe resolverse alineando correctamente las versiones de los paquetes afectados.

## Gestión del package-lock

`package-lock.json` debe ser generado por npm y no debe editarse manualmente.

Cuando se modifique `package.json`:

1. utilizar Node 24 dentro de `>=24.15.0 <25`;
2. utilizar `npm@11.19.0` para regenerar el lockfile;
3. preservar una copia de `package.json` cuando se quiera comprobar que npm no lo modifica inesperadamente;
4. regenerar `package-lock.json` mediante npm;
5. revisar el diff del lockfile;
6. ejecutar una instalación limpia mediante `npm ci`;
7. ejecutar la auditoría de seguridad;
8. ejecutar el pipeline completo de validación;
9. instalar Chromium cuando el cambio afecte al baseline E2E;
10. ejecutar `npm run test:e2e`;
11. versionar conjuntamente `package.json` y `package-lock.json`.

Cuando se añade una dependencia directa nueva, como `@playwright/test`, es esperable que `package-lock.json` incorpore:

- la nueva dependencia directa en la metadata raíz;
- el paquete Playwright correspondiente;
- las dependencias transitivas requeridas por Playwright;
- sus campos `resolved` e `integrity` generados por npm.

Estos cambios deben proceder exclusivamente de npm.

No se deben:

- escribir manualmente valores `integrity`;
- inventar URLs `resolved`;
- construir manualmente nodos del árbol;
- copiar entradas de un lockfile de otra versión de Playwright;
- modificar `lockfileVersion` sin que npm lo requiera.

Si no se dispone de un entorno local compatible, puede utilizarse temporalmente un workflow aislado de GitHub Actions que:

1. se ejecute únicamente en la rama de la migración;
2. utilice Node 24 compatible con el contrato;
3. instale `npm@11.19.0`;
4. preserve copias de los manifests relevantes;
5. regenere el lockfile mediante npm;
6. compruebe que `package.json` no cambió;
7. ejecute `npm ci`;
8. ejecute `npm run audit:security`;
9. ejecute `npm run check`;
10. instale únicamente Chromium y sus dependencias mediante Playwright;
11. ejecute `npm run test:e2e`;
12. compruebe que únicamente `package-lock.json` ha cambiado como resultado de la regeneración;
13. haga commit únicamente de `package-lock.json`;
14. sea eliminado antes de integrar la pull request.

## Familias de dependencias que deben mantenerse alineadas

Determinados paquetes están estrechamente relacionados y no deben actualizarse de manera aislada.

### React

Mantener alineadas las major versions de:

- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`

No aceptar una actualización que deje, por ejemplo:

```text
react 19
react-dom 18
```

o:

```text
@types/react 19
@types/react-dom 18
```

Aunque npm pueda ofrecer mecanismos para forzar la resolución, debe corregirse la incompatibilidad real.

### Testing Library

El baseline actual utiliza:

- `@testing-library/react`
- `@testing-library/dom`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

`@testing-library/dom` debe permanecer declarado explícitamente mientras sea una peer dependency requerida por los paquetes utilizados.

Al actualizar cualquiera de estos paquetes debe revisarse también su matriz de peer dependencies.

### Playwright

El baseline E2E utiliza:

```text
@playwright/test 1.63.x
```

con **Chromium como único navegador E2E soportado inicialmente**.

Playwright complementa a Vitest; no lo sustituye.

La separación de responsabilidades es:

```text
Vitest + Testing Library + jsdom
  → lógica, estado, componentes y semántica rápida

Playwright + Chromium
  → navegador real, layout, CSS, rAF, hover,
    pointer events, drag y responsive behavior
```

Los specs de Playwright se almacenan en `e2e/` y están excluidos expresamente del discovery de Vitest.

Cada versión de Playwright requiere browser binaries compatibles con esa versión. Por tanto, después de actualizar `@playwright/test` debe ejecutarse nuevamente:

```bash
npx playwright install chromium
```

y en CI:

```bash
npx playwright install --with-deps chromium
```

No se instalan Firefox ni WebKit mientras no exista una decisión explícita de ampliar el baseline de navegadores E2E.

No añadir paquetes como:

```text
@playwright/browser-chromium
@playwright/browser-firefox
@playwright/browser-webkit
```

únicamente para convertir la descarga de browsers en un efecto lateral de `npm ci`.

El browser debe seguir instalándose explícitamente mediante el Playwright local del proyecto.

La smoke suite debe permanecer reducida y centrada en:

- carga real de la aplicación;
- idiomas y estado DOM real;
- navegación principal crítica;
- menú responsive;
- autoplay del carrusel;
- hover;
- drag;
- diferenciación entre click y drag;
- cobertura ultrawide;
- reduced motion.

No convertir Playwright en una duplicación exhaustiva de todos los tests de componentes.

### TypeScript y typescript-eslint

El proyecto mantiene actualmente TypeScript en la rama `6.0.x`.

La versión `8.69.x` de `typescript-eslint` utilizada por el proyecto no soporta TypeScript 7 dentro de su rango oficialmente compatible actual.

Por este motivo `typescript` permanece deliberadamente restringido a:

```text
~6.0.x
```

No actualizar a TypeScript 7 utilizando:

```text
--force
--legacy-peer-deps
```

ni ignorando warnings o errores de compatibilidad.

La migración podrá realizarse cuando el tooling relacionado declare soporte oficial adecuado y deberá tratarse en una pull request independiente del contrato de Node.

## Tailwind CSS 4

La migración a Tailwind CSS 4 está completada, incluida la configuración CSS-first nativa.

La entrada `styles.css` utiliza:

```css
@import "tailwindcss";

@theme {
  --font-sans: Inter, "Segoe UI", system-ui, sans-serif;
  --font-serif: "Playfair Display", Georgia, Cambria, "Times New Roman", serif;

  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-300: #7dd3fc;
  --color-brand-400: #38bdf8;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
  --color-brand-950: #082f49;
}
```

El proyecto ya no utiliza `@config` y no mantiene `tailwind.config.js`.

Tailwind está integrado directamente en el pipeline de Vite mediante:

```text
@tailwindcss/vite
```

y se registra en `vite.config.ts` mediante:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: './',
});
```

El proyecto no mantiene un `postcss.config.js` propio y no declara como dependencias directas:

```text
@tailwindcss/postcss
postcss
autoprefixer
```

Esto no significa que `postcss` deba desaparecer necesariamente de `package-lock.json`.

Vite puede mantener PostCSS como dependencia transitiva para su propio pipeline CSS. La ausencia relevante es la de `postcss` como dependencia directa del proyecto y la de `@tailwindcss/postcss` como mecanismo de integración de Tailwind.

### Compatibilidad visual con Tailwind CSS 3

Tailwind CSS 4 modificó el significado de algunas escalas de utilidades.

Cuando se migre código originalmente diseñado con Tailwind 3 y se quiera conservar aproximadamente el mismo resultado visual, deben revisarse estas equivalencias:

| Tailwind CSS 3 | Tailwind CSS 4 equivalente |
| --- | --- |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `backdrop-blur-sm` | `backdrop-blur-xs` |
| `backdrop-blur` | `backdrop-blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| semántica anterior de `outline-none` | `outline-hidden` |

Los gradientes lineales utilizan la sintaxis:

```text
bg-linear-*
```

Tailwind CSS 4 utiliza un espacio de color moderno por defecto para la interpolación de gradientes. Cuando sea necesario conservar específicamente una interpolación similar a la utilizada anteriormente puede utilizarse el modificador:

```text
/srgb
```

### Baseline de navegadores

El baseline de navegador de referencia de Tailwind CSS 4 es:

- Safari 16.4+
- Chrome 111+
- Firefox 128+

Si en el futuro fuera necesario soportar navegadores anteriores, deberá revisarse expresamente la elección de Tailwind CSS 4.

La utilización inicial de Chromium como único navegador E2E no modifica este baseline de compatibilidad de producto. Significa únicamente que la primera capa automatizada de navegador real está deliberadamente limitada a Chromium.

## Scripts de instalación

El repositorio utiliza:

```text
strict-allow-scripts=true
```

y `package.json` mantiene explícitamente los paquetes cuyos scripts de instalación están permitidos.

Cuando una actualización introduzca o modifique un script de instalación:

1. identificar el paquete que solicita ejecutar el script;
2. revisar su procedencia;
3. revisar la finalidad del script;
4. comprobar que la versión instalada es la esperada;
5. permitir únicamente la versión concreta necesaria;
6. evitar rangos abiertos;
7. ejecutar una instalación limpia;
8. ejecutar la auditoría de seguridad;
9. ejecutar el pipeline completo de validación.

No se deben autorizar indiscriminadamente todos los scripts para eliminar un warning de npm.

La instalación de los browser binaries de Playwright permanece separada de `npm ci` y se realiza explícitamente mediante:

```bash
npx playwright install chromium
```

o, en CI:

```bash
npx playwright install --with-deps chromium
```

No debe relajarse `strict-allow-scripts` para convertir la descarga del browser en un efecto lateral de la instalación npm.

## Auditoría de seguridad

El proyecto ejecuta:

```bash
npm audit --audit-level=high
```

mediante:

```bash
npm run audit:security
```

Una instalación correctamente resuelta puede seguir conteniendo vulnerabilidades.

Por tanto:

- que `npm ci` termine correctamente no implica que `npm audit` vaya a pasar;
- una vulnerabilidad puede encontrarse en una dependencia transitiva;
- una dependencia transitiva no debe añadirse automáticamente a `package.json` solo para controlar su versión;
- cuando el rango existente ya permite una versión corregida, debe actualizarse el lockfile;
- toda corrección debe volver a validarse mediante instalación limpia.

No utilizar automáticamente:

```bash
npm audit fix --force
```

porque puede introducir actualizaciones major o resoluciones fuera de los rangos previstos.

Cuando `npm audit fix` pueda utilizarse sin romper los rangos declarados, debe comprobarse después que:

1. `package.json` no haya cambiado inesperadamente;
2. `package-lock.json` sea instalable;
3. la vulnerabilidad haya desaparecido;
4. los tests sigan pasando;
5. TypeScript compile correctamente;
6. el build complete correctamente.

La validación mínima posterior es:

```bash
npm ci
npm run audit:security
npm run check
```

Si el cambio afecta al tooling de navegador o a comportamiento de UI debe ejecutarse además la smoke suite E2E.

## Actualizaciones major

Las actualizaciones major no deben tratarse como simples cambios de versión.

Antes de aceptar una major de Dependabot:

1. revisar las release notes;
2. revisar breaking changes;
3. identificar paquetes relacionados;
4. revisar peer dependencies;
5. revisar requisitos de Node y npm;
6. revisar cambios de configuración;
7. revisar cambios de tipos;
8. revisar APIs eliminadas o renombradas;
9. regenerar el lockfile correctamente;
10. ejecutar `npm ci`;
11. ejecutar la auditoría;
12. ejecutar lint;
13. ejecutar tests;
14. ejecutar TypeScript;
15. ejecutar el build;
16. realizar una revisión visual si afecta a UI, CSS o iconografía;
17. comprobar comportamiento interactivo si afecta a eventos o APIs del navegador;
18. ejecutar Playwright cuando el cambio pueda afectar al comportamiento real del navegador;
19. integrar únicamente cuando el CI esté completamente en verde.

Una actualización major de Playwright debe revisar además:

- requisitos de Node;
- cambios de configuración;
- browser version incorporada;
- cambios en APIs de locators, assertions y mouse/pointer;
- cambios en los requisitos de sistema de Chromium;
- regeneración del lockfile;
- reinstalación explícita de Chromium.

## Lecciones de la migración de septiembre de 2026

La actualización major de 2026 permitió identificar varios patrones que deben tenerse en cuenta en futuras migraciones.

### Mantener React alineado

Actualizar `react` sin actualizar simultáneamente `react-dom` y sus tipos puede producir un árbol de dependencias inconsistente.

Las cuatro piezas deben revisarse conjuntamente:

```text
react
react-dom
@types/react
@types/react-dom
```

### Un npm ci correcto no sustituye al audit

Durante la migración, una versión vulnerable de una dependencia transitiva permitía instalar el proyecto correctamente pero hacía fallar:

```bash
npm audit --audit-level=high
```

Por tanto, instalación y seguridad son controles independientes.

### Los tipos DOM también pueden cambiar

Las actualizaciones de TypeScript y de las definiciones DOM pueden ampliar interfaces del navegador.

Los mocks utilizados en tests deben seguir implementando correctamente esas interfaces.

Ejemplo encontrado durante la migración:

```text
IntersectionObserver
```

incorporó requisitos de tipos que obligaron a actualizar los mocks utilizados en las pruebas.

La existencia de Playwright reduce el riesgo de depender únicamente de mocks para comportamientos que realmente necesitan layout o APIs implementadas por el browser, pero no elimina la utilidad de los unit tests existentes.

### Las librerías pueden eliminar exports

Una major puede eliminar APIs aunque el resto de la librería siga funcionando correctamente.

Durante la actualización de Lucide React, el icono de LinkedIn dejó de estar disponible mediante el export utilizado previamente.

La solución adoptada fue conservar ese recurso como SVG local en lugar de introducir una nueva dependencia únicamente para un icono.

### Las migraciones CSS necesitan revisión visual

Un build correcto no garantiza equivalencia visual.

Tailwind CSS 4 modificó varias escalas y comportamientos, por lo que después de una major de CSS deben comprobarse especialmente:

- sombras;
- blur;
- backdrop blur;
- border radius;
- rings;
- gradientes;
- animaciones;
- transforms;
- responsive behavior;
- estados hover y focus.

Los smoke tests Playwright proporcionan una red de seguridad adicional para una parte limitada de estos comportamientos sin convertirse en una suite de visual regression pixel-perfect.

### Separar framework e integración de build

La versión de Tailwind y el mecanismo mediante el que se integra en el bundler son decisiones distintas.

En proyectos Vite, el baseline actual utiliza el plugin dedicado:

```text
@tailwindcss/vite
```

en lugar de enrutar Tailwind a través de un `postcss.config.js` propio.

Cuando se actualice Tailwind debe comprobarse también la compatibilidad entre:

```text
tailwindcss
@tailwindcss/vite
vite
```

y mantener alineadas las versiones de los dos paquetes de Tailwind.

Si el cambio puede afectar al layout o a las transforms utilizadas por el carrusel debe ejecutarse también `npm run test:e2e`.

## CI y protección de main

Las pull requests hacia `main` deben superar el workflow de CI antes del merge.

El pipeline valida:

```text
npm ci
  ↓
npm run audit:security
  ↓
npm run check
  ↓
npx playwright install --with-deps chromium
  ↓
npm run test:e2e
```

`npm run check` incluye:

```text
lint
  ↓
tests
  ↓
generate:cv
  ↓
TypeScript
  ↓
Vite build
```

La smoke suite Playwright permanece fuera de `npm run check`.

Esto es intencionado porque `npm run check` también se utiliza durante el workflow de despliegue. Mantener E2E separado evita que el deploy tenga que instalar Chromium y ejecutar por segunda vez los tests de navegador.

El job `validate` del workflow `CI` ejecuta ambos niveles de control:

```text
Validación rápida
  +
Smoke E2E Chromium
```

La rama `main` debe mantener configurado como obligatorio el check asociado al job `validate` del workflow `CI`.

No se crea un required check independiente para Playwright.

No debe integrarse una pull request simplemente porque GitHub permita técnicamente el merge si el check requerido no corresponde al workflow real o permanece en estado `Expected`.

Los artefactos Playwright de una ejecución fallida pueden conservarse temporalmente mediante la Action de upload configurada en el mismo job. Esa Action debe permanecer pinneada a un SHA completo, igual que el resto de Actions del repositorio.

## Revisión periódica

Ejecutar al menos trimestralmente:

```bash
npm outdated
npm run audit:security
npm run check
npm run test:e2e
```

Antes de `npm run test:e2e`, Chromium debe estar instalado para la versión local de Playwright.

Revisar además:

- versión mínima y major soportada de Node;
- versión soportada y de referencia de npm;
- alineación de `engines`, `packageManager` y `devEngines`;
- alineación de `@types/node` con la major de runtime;
- dependencias directas obsoletas;
- dependencias transitivas vulnerables;
- peer dependencies;
- paquetes con scripts de instalación;
- compatibilidad entre Tailwind CSS, `@tailwindcss/vite` y Vite;
- soporte de TypeScript por `typescript-eslint`;
- baseline de navegadores de Tailwind;
- versión actual de `@playwright/test`;
- requisitos de sistema actuales de Playwright;
- versión de Chromium gestionada por la release de Playwright instalada;
- estabilidad y utilidad de la smoke suite E2E;
- actualizaciones major abiertas por Dependabot;
- versiones de GitHub Actions;
- configuración de branch protection y required checks.

## Major deliberadamente pospuesta

### TypeScript 7

TypeScript 7 permanece deliberadamente fuera del baseline mientras el ecosistema utilizado por el proyecto no declare compatibilidad oficial adecuada.

Esta decisión es independiente de la major de Node utilizada por el proyecto.

Cuando pueda abordarse la migración:

1. crear una pull request independiente;
2. actualizar TypeScript y el tooling relacionado;
3. revisar breaking changes del compilador;
4. actualizar mocks y tipos si fuera necesario;
5. revisar generación de CV;
6. ejecutar toda la suite de tests;
7. ejecutar el build completo;
8. ejecutar la smoke suite E2E;
9. integrar únicamente con todos los checks en verde.