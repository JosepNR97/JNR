# Mantenimiento de dependencias

Este documento define las reglas de mantenimiento, actualización y validación de las dependencias del portfolio.

## Baseline tecnológico actual

Baseline revisado tras la migración major realizada en septiembre de 2026.

| Componente | Baseline actual |
| --- | --- |
| Node.js | `^24.15.0 || >=26.0.0` |
| npm | `11.19.x` |
| React | `19.2.x` |
| React DOM | `19.2.x` |
| TypeScript | `6.0.x` |
| Vite | `8.2.x` |
| Tailwind CSS | `4.3.x` |
| Lucide React | `1.x` |
| Testing Library React | `16.3.x` |
| Testing Library DOM | `10.4.x` |
| Vitest | `4.1.x` |
| ESLint | `10.x` |

`package.json` y `package-lock.json` son la fuente de verdad para las versiones concretas instaladas.

## Controles automáticos

El repositorio dispone de varios controles complementarios:

- Dependabot revisa periódicamente paquetes npm y GitHub Actions.
- Las pull requests dirigidas a `main` ejecutan el workflow de CI.
- El workflow de CI instala las dependencias mediante `npm ci`.
- La auditoría de seguridad se ejecuta antes de lint, tests y build.
- El check de validación debe superar todos los controles antes del merge.
- Los pushes a `main` vuelven a ejecutar instalación, auditoría, validación y build antes del despliegue en GitHub Pages.
- Existe además un workflow periódico específico para auditar vulnerabilidades.
- Las vulnerabilidades de severidad `high` o `critical` bloquean los pipelines.
- `strict-allow-scripts=true` restringe la ejecución de scripts de instalación de dependencias.

## Instalaciones reproducibles

El proyecto utiliza npm como package manager y mantiene `package-lock.json` versionado.

La instalación utilizada por CI y despliegue es:

```bash
npm ci
```

`package.json` y `package-lock.json` deben permanecer sincronizados.

Después de cualquier modificación de dependencias debe comprobarse como mínimo:

```bash
npm ci
npm run audit:security
npm run check
```

No utilizar:

```bash
npm ci --force
npm ci --legacy-peer-deps
```

para ocultar conflictos de peer dependencies.

Un conflicto debe resolverse alineando correctamente las versiones de los paquetes afectados.

## Gestión del package-lock

`package-lock.json` debe ser generado por npm y no debe editarse manualmente.

Cuando se modifique `package.json`:

1. Utilizar la versión de Node compatible con el proyecto.
2. Utilizar la versión de npm declarada en `packageManager`.
3. Regenerar `package-lock.json`.
4. Ejecutar una instalación limpia mediante `npm ci`.
5. Ejecutar la auditoría de seguridad.
6. Ejecutar el pipeline completo de validación.
7. Versionar conjuntamente `package.json` y `package-lock.json`.

Si no se dispone de un entorno local compatible, puede utilizarse temporalmente un workflow aislado de GitHub Actions que:

1. utilice las versiones de Node y npm declaradas por el proyecto;
2. regenere el lockfile;
3. compruebe que `npm ci` funciona;
4. ejecute `npm audit`;
5. haga commit únicamente del lockfile esperado;
6. sea eliminado antes de integrar la pull request.

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

### TypeScript y typescript-eslint

El proyecto mantiene actualmente TypeScript en la rama `6.0.x`.

La versión de `typescript-eslint` utilizada por el proyecto no soporta todavía TypeScript 7 dentro de su rango oficialmente compatible.

Por este motivo `typescript` permanece deliberadamente restringido a:

```text
~6.0.x
```

No actualizar a TypeScript 7 utilizando:

```text
--force
--legacy-peer-deps
```

ni ignorando warnings de compatibilidad.

La migración podrá realizarse cuando el tooling relacionado declare soporte adecuado.

## Tailwind CSS 4

La migración a Tailwind CSS 4 está completada.

La configuración actual utiliza:

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```

y el plugin PostCSS:

```text
@tailwindcss/postcss
```

`autoprefixer` ya no se mantiene como dependencia explícita del proyecto.

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
18. integrar únicamente cuando el CI esté completamente en verde.

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

## CI y protección de main

Las pull requests hacia `main` deben superar el workflow de CI antes del merge.

El pipeline valida:

```text
npm ci
  ↓
npm run audit:security
  ↓
npm run check
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

La rama `main` debe mantener configurado como obligatorio el check asociado al job `validate` del workflow `CI`.

No debe integrarse una pull request simplemente porque GitHub permita técnicamente el merge si el check requerido no corresponde al workflow real o permanece en estado `Expected`.

## Revisión periódica

Ejecutar al menos trimestralmente:

```bash
npm outdated
npm run audit:security
npm run check
```

Revisar además:

- versiones soportadas de Node;
- versión de npm;
- dependencias directas obsoletas;
- dependencias transitivas vulnerables;
- peer dependencies;
- paquetes con scripts de instalación;
- soporte de TypeScript por `typescript-eslint`;
- baseline de navegadores de Tailwind;
- actualizaciones major abiertas por Dependabot;
- versiones de GitHub Actions;
- configuración de branch protection y required checks.

## Major deliberadamente pospuesta

### TypeScript 7

TypeScript 7 permanece deliberadamente fuera del baseline mientras el ecosistema utilizado por el proyecto no declare compatibilidad adecuada.

Cuando pueda abordarse la migración:

1. crear una pull request independiente;
2. actualizar TypeScript y el tooling relacionado;
3. revisar breaking changes del compilador;
4. actualizar mocks y tipos si fuera necesario;
5. revisar generación de CV;
6. ejecutar toda la suite de tests;
7. ejecutar el build completo;
8. integrar únicamente con todos los checks en verde.
