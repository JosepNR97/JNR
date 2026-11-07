# Mantenimiento de dependencias

Este documento define las reglas vigentes para actualizar, validar y remediar las dependencias del portfolio.

La documentación describe **contratos y decisiones estables**.

Las versiones concretas declaradas e instaladas se consultan siempre en:

```text
package.json
package-lock.json
```

No deben duplicarse en este documento versiones minor o patch que Dependabot pueda actualizar automáticamente.

## Principio de fuente de verdad

La responsabilidad se divide así:

```text
package.json
  → dependencias declaradas
  → rangos soportados
  → contrato Node/npm
  → scripts del proyecto

package-lock.json
  → resolución concreta del árbol
  → dependencias transitivas
  → integrities

documentación
  → decisiones arquitectónicas
  → políticas de mantenimiento
  → reglas de seguridad
```

Si una versión minor o patch cambia sin modificar una decisión arquitectónica, la documentación no necesita cambiar.

## Baseline tecnológico

Solo se documentan aquí las líneas tecnológicas que representan una decisión deliberada.

| Componente                    | Política                                   |
| ----------------------------- | ------------------------------------------ |
| Node.js                       | `>=24.15.0 <25`                            |
| npm                           | `>=11.19.0 <12`                            |
| Package manager de referencia | `npm@11.19.0`                              |
| `@types/node`                 | Major 24 mientras Node 24 sea el runtime   |
| React                         | Major 19                                   |
| TypeScript                    | Major 6                                    |
| Vite                          | Major 8                                    |
| Tailwind CSS                  | Major 4 mediante `@tailwindcss/vite`       |
| Vitest                        | Major 5                                    |
| ESLint                        | Major 10                                   |
| Prettier                      | Major 3                                    |
| Playwright                    | Chromium como único navegador E2E          |
| Axe                           | Gestionado mediante `@axe-core/playwright` |

Las versiones exactas deben consultarse en `package.json` y `package-lock.json`.

## Contrato Node/npm

El proyecto soporta oficialmente:

```text
Node.js >=24.15.0 <25
npm     >=11.19.0 <12
```

y utiliza:

```text
npm@11.19.0
```

como referencia reproducible en GitHub Actions.

Estos valores sí se mantienen explícitamente en documentación porque son parte del contrato de entorno.

### `engines`

`engines` expresa el contrato público de compatibilidad:

```json
{
  "engines": {
    "node": ">=24.15.0 <25",
    "npm": ">=11.19.0 <12"
  }
}
```

### `packageManager`

El proyecto declara:

```json
{
  "packageManager": "npm@11.19.0"
}
```

Este campo identifica npm como package manager de referencia.

No sustituye los rangos de compatibilidad de `engines` ni `devEngines`.

### `devEngines`

El entorno utilizado para trabajar con el proyecto se valida estrictamente mediante:

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

Un entorno incompatible debe hacer fallar los comandos npm relevantes.

El proyecto no declara soporte para otros package managers.

### Bootstrap de npm

Una instalación compatible de Node 24 puede incorporar una versión anterior de npm.

Puede actualizarse mediante:

```bash
npm install --global npm@11.19.0
```

Los workflows realizan este bootstrap explícitamente cuando es necesario.

### Node y `@types/node`

Mientras Node 24 sea la única major soportada:

```text
Runtime: Node 24
Tipos:   @types/node 24.x
```

Dependabot puede actualizar `@types/node` dentro de esa major.

Las actualizaciones semver-major de `@types/node` permanecen ignoradas mientras no cambie el runtime oficial.

Una futura migración de Node debe revisar conjuntamente:

- `engines.node`;
- `devEngines.runtime`;
- `@types/node`;
- versión de npm soportada;
- GitHub Actions;
- tooling;
- tests;
- build;
- E2E.

## Instalaciones reproducibles

El repositorio utiliza npm como único package manager y mantiene `package-lock.json` versionado.

La instalación estándar es:

```bash
npm ci
```

En workflows donde el audit se controla expresamente se utiliza:

```bash
npm ci --no-audit --fund=false
```

No utilizar:

```bash
npm ci --force
npm ci --legacy-peer-deps
```

para ocultar conflictos de dependencias o saltarse el contrato de entorno.

Los conflictos deben resolverse alineando realmente los paquetes afectados.

## Gestión de `package-lock.json`

`package-lock.json` debe ser generado por npm.

No debe editarse manualmente.

No se deben:

- escribir manualmente valores `integrity`;
- inventar URLs `resolved`;
- construir nodos del árbol manualmente;
- copiar entradas desde otros lockfiles;
- modificar `lockfileVersion` manualmente.

Cuando se modifique `package.json`, el lockfile debe regenerarse utilizando el entorno Node/npm soportado.

El repositorio dispone de:

```text
.github/workflows/regenerate-package-lock.yml
```

para regeneraciones controladas.

Puede utilizar ramas:

```text
Mejoras
maintenance/**
security/**
```

pero nunca debe escribir directamente sobre:

```text
main
dependabot/**
```

El workflow:

1. valida la branch objetivo;
2. obtiene el contrato Node/npm desde `package.json`;
3. instala la versión de npm de referencia;
4. preserva `package.json`;
5. regenera `package-lock.json`;
6. intenta aplicar fixes compatibles;
7. rechaza cambios inesperados fuera del lockfile;
8. valida una instalación limpia;
9. versiona únicamente `package-lock.json` cuando cambia;
10. informa del estado de seguridad restante;
11. ejecuta `npm run check`.

No debe utilizar:

```bash
npm audit fix --force
```

Una corrección que requiera una major o una resolución incompatible debe tratarse mediante una PR explícita.

## Controles automáticos

El repositorio utiliza varias capas que tienen responsabilidades diferentes.

### CI de pull requests

Toda PR dirigida a `main` debe superar:

```text
CI / validate
```

El flujo principal es:

```text
Dependency Review
  ↓
npm ci --no-audit --fund=false
  ↓
npm run check
  ↓
npx playwright install --with-deps chromium
  ↓
npm run test:e2e
```

`validate` permanece como required status principal de `main`.

### `npm run check`

Ejecuta:

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

Playwright permanece fuera de este comando porque también se reutiliza durante el despliegue.

### Playwright

La smoke suite completa se ejecuta mediante:

```bash
npm run test:e2e
```

Incluye E2E funcional y accessibility smoke.

El baseline E2E utiliza únicamente:

```text
Chromium
```

Localmente Playwright genera el build necesario.

En CI reutiliza el build ya validado por `npm run check`.

Para ejecutar únicamente la capa de accesibilidad:

```bash
npm run test:a11y
```

### CodeQL

CodeQL analiza JavaScript/TypeScript como una capa independiente de seguridad.

Complementa, pero no sustituye:

- TypeScript;
- ESLint;
- tests;
- Dependency Review;
- auditoría de dependencias.

## Modelo de seguridad de dependencias

El proyecto separa deliberadamente:

1. vulnerabilidades **introducidas por una PR**;
2. vulnerabilidades **ya presentes en `main`**.

No deben tratarse ambas situaciones mediante el mismo gate absoluto.

## Dependency Review

Dependency Review compara las dependencias modificadas por una PR respecto a `main`.

La política es:

| Scope       | Moderate      | High       | Critical   |
| ----------- | ------------- | ---------- | ---------- |
| Runtime     | ❌ Bloquea    | ❌ Bloquea | ❌ Bloquea |
| Unknown     | ❌ Bloquea    | ❌ Bloquea | ❌ Bloquea |
| Development | ⚠️ No bloquea | ❌ Bloquea | ❌ Bloquea |

El workflow implementa dos controles:

```text
runtime + unknown
  → bloquea desde moderate

development
  → bloquea desde high
```

Las GitHub Actions utilizadas por el repositorio deben permanecer pinneadas a SHA completo.

La comprobación de licencias no forma parte actualmente de este gate.

### Principio de no regresión

Una vulnerabilidad ya existente en `main`:

```text
NO debe bloquear una PR que no la introduce o empeora.
```

Por ejemplo:

```text
main contiene H1 + H2

PR A corrige H1
PR B corrige H2
```

PR A debe poder integrarse aunque H2 continúe existiendo.

PR B debe poder integrarse aunque H1 todavía exista en su base.

Esto evita deadlocks de mantenimiento.

## Estado absoluto de `main`

El estado completo del árbol se comprueba mediante:

```bash
npm run audit:security
```

La política es:

```text
todo el árbol:
  high / critical → error

dependencias de producción:
  moderate / high / critical → error

dependencias exclusivamente de desarrollo:
  moderate → seguimiento
```

Para revisar también las vulnerabilidades `moderate` del árbol completo existe:

```bash
npm run audit:security:moderate
```

El workflow:

```text
.github/workflows/dependency-audit.yml
```

se ejecuta periódicamente y bajo demanda.

Su responsabilidad es supervisar el estado absoluto de `main`.

No es el required gate de las PR.

Una vulnerabilidad nueva descubierta contra una dependencia ya existente debe generar una remediación, pero no congelar cambios no relacionados.

## Dependabot

Dependabot revisa periódicamente:

- paquetes npm;
- GitHub Actions.

Las actualizaciones ordinarias pueden agruparse por familias relacionadas.

Las security updates npm utilizan un grupo específico:

```yaml
npm-security:
  applies-to: 'security-updates'
  patterns:
    - '*'
```

El objetivo es permitir que varias actualizaciones necesarias para una misma remediación puedan llegar conjuntamente cuando Dependabot pueda resolverlas.

### Configuración desde la default branch

GitHub solo activa:

```text
.github/dependabot.yml
```

desde la default branch.

Por tanto, al editar ese fichero desde una branch de trabajo puede aparecer el aviso:

```text
Cannot configure Dependabot from this branch
```

Ese aviso no invalida el fichero ni impide revisarlo mediante PR.

La nueva configuración entra en vigor cuando llega a `main`.

## Remediaciones coordinadas

Si una vulnerabilidad no puede resolverse mediante una PR individual de Dependabot, debe utilizarse una branch:

```text
security/<descripcion>
```

creada desde el `main` actual.

En ella pueden actualizarse conjuntamente:

- dependencias directas;
- dependencias relacionadas;
- lockfile;
- configuración necesaria.

Después se abre una única PR de remediación.

No se debe:

- desactivar branch protection;
- quitar el required check;
- crear bypasses permanentes;
- utilizar `--force`;
- utilizar `--legacy-peer-deps`;
- editar manualmente el lockfile.

## Regenerador de lockfile y seguridad

El regenerador intenta aplicar fixes compatibles mediante:

```bash
npm audit fix \
  --package-lock-only \
  --ignore-scripts \
  --audit-level=high
```

sin `--force`.

El paso puede continuar aunque queden findings que requieran una intervención adicional.

Después ejecuta:

```bash
npm run audit:security
```

como señal informativa.

Si quedan vulnerabilidades:

- aparecen en los logs;
- se genera un warning;
- se recomienda Dependabot o una rama `security/**`;
- la regeneración no queda bloqueada únicamente porque exista una vulnerabilidad previa.

El gate que impide introducir nuevas vulnerabilidades se aplica posteriormente mediante Dependency Review en la PR.

## Despliegue

El workflow de GitHub Pages ejecuta:

```text
npm ci --no-audit --fund=false
  ↓
npm run check
  ↓
Upload GitHub Pages artifact
  ↓
Deploy
```

No ejecuta un audit absoluto del árbol.

Esto es intencionado.

Si se publica un advisory nuevo contra una dependencia que ya estaba desplegada, bloquear futuros despliegues:

```text
NO elimina esa vulnerabilidad
```

y podría impedir publicar su propia corrección.

La detección y remediación corresponden a:

```text
Dependency audit
Dependabot
security/**
```

mientras Dependency Review evita introducir nuevas regresiones.

## Branch protection

`main` mantiene:

- PR obligatoria;
- `validate` como required status;
- branch actualizada respecto a `main`;
- force-push bloqueado;
- eliminación bloqueada;
- sin bypass.

No es necesario debilitar estas reglas para realizar remediaciones.

Si aparece un deadlock, debe corregirse la estrategia de actualización o preparar una remediación coordinada.

## Familias de dependencias relacionadas

### React

Mantener alineadas las majors de:

```text
react
react-dom
@types/react
@types/react-dom
```

No aceptar árboles conceptualmente incompatibles.

### Tailwind

Mantener la compatibilidad entre:

```text
tailwindcss
@tailwindcss/vite
vite
```

El proyecto utiliza integración CSS-first:

```css
@import 'tailwindcss';
```

mediante:

```text
@tailwindcss/vite
```

No mantiene un `tailwind.config.js` ni un `postcss.config.js` propios.

### Testing Library

Revisar conjuntamente:

```text
@testing-library/react
@testing-library/dom
@testing-library/jest-dom
@testing-library/user-event
```

y sus peer dependencies.

### TypeScript

TypeScript permanece deliberadamente en major 6.

Una futura migración a TypeScript 7 debe realizarse únicamente cuando el tooling relacionado declare una compatibilidad suficiente.

No utilizar:

```text
--force
--legacy-peer-deps
```

para adelantar esa migración.

### Playwright

El baseline E2E utiliza únicamente Chromium.

Después de actualizar Playwright debe instalarse nuevamente el browser compatible:

```bash
npx playwright install chromium
```

o, en CI:

```bash
npx playwright install --with-deps chromium
```

No añadir paquetes específicos de browsers únicamente para convertir la descarga en un efecto lateral de `npm ci`.

### Axe

La versión concreta de Axe no se duplica en documentación.

Debe consultarse en:

```text
package.json
package-lock.json
```

Una actualización de `@axe-core/playwright` puede modificar:

- reglas;
- impacto de violations;
- tags WCAG;
- resultados del gate.

Después de actualizarla deben revisarse:

```bash
npm run test:a11y
npm run test:e2e
```

No se deben desactivar reglas únicamente para recuperar un CI verde.

La baseline actual bloquea violations con impacto:

```text
critical
serious
```

Las `moderate` y `minor` no bloquean actualmente.

Solo deben configurarse tags realmente soportados por la versión instalada.

## Scripts de instalación

El repositorio utiliza:

```text
strict-allow-scripts=true
```

Los paquetes cuyos scripts se permiten deben estar autorizados explícitamente en `package.json`.

Cuando una actualización introduzca o modifique scripts de instalación:

1. identificar el paquete;
2. revisar su procedencia;
3. revisar la finalidad;
4. comprobar la versión instalada;
5. permitir únicamente lo necesario;
6. volver a ejecutar instalación y validación.

No debe desactivarse globalmente esta protección para eliminar warnings.

Playwright instala los browser binaries explícitamente mediante su CLI.

## Actualizaciones major

Una major debe tratarse como una migración deliberada, no como mantenimiento rutinario.

Revisar como mínimo:

1. release notes;
2. breaking changes;
3. peer dependencies;
4. Node/npm requerido;
5. configuración;
6. tipos;
7. APIs eliminadas;
8. scripts de instalación;
9. impacto visual si aplica;
10. comportamiento de navegador si aplica;
11. regeneración del lockfile;
12. instalación limpia;
13. seguridad;
14. `npm run check`;
15. E2E cuando corresponda;
16. accessibility smoke cuando corresponda.

Una major no debe aceptarse únicamente porque npm consiga resolverla mediante opciones de fuerza.

## Validación local recomendada

Para cambios ordinarios:

```bash
npm ci
npm run check
```

Para cambios de dependencias:

```bash
npm ci
npm run audit:security
npm run check
```

Para cambios de UI o tooling de navegador:

```bash
npm ci
npm run audit:security
npm run check
npx playwright install chromium
npm run test:e2e
```

Para cambios específicamente relacionados con accesibilidad:

```bash
npm run test:a11y
```

Un audit local puede fallar por una vulnerabilidad que ya existía en `main`.

En ese caso debe distinguirse entre:

```text
regresión introducida por el cambio
vs.
finding preexistente
```

Dependency Review realiza esa distinción en la PR.

## Revisión periódica

Al menos trimestralmente revisar:

```bash
npm outdated
npm run audit:security
npm run audit:security:moderate
npm run check
npm run test:e2e
```

y comprobar:

- contrato Node/npm;
- alineación de `@types/node`;
- dependencias directas obsoletas;
- dependencias transitivas vulnerables;
- peer dependencies;
- scripts de instalación;
- compatibilidad Tailwind/Vite;
- compatibilidad TypeScript/tooling;
- Playwright y Chromium;
- Axe y reglas configuradas;
- GitHub Actions;
- Dependabot;
- CodeQL;
- branch protection;
- estabilidad de la suite E2E.

## Cuándo debe actualizarse esta documentación

Este documento **no debe modificarse por cada PR de Dependabot**.

Debe actualizarse cuando cambie alguno de estos contratos o decisiones:

- major soportada de Node;
- rango soportado de npm;
- package manager de referencia;
- major de una tecnología considerada baseline;
- navegador E2E soportado;
- política de severidades;
- estrategia de Dependency Review;
- estrategia Dependabot;
- reglas de branch protection;
- forma de regenerar el lockfile;
- política de scripts de instalación;
- arquitectura de CI o despliegue.

Una actualización minor o patch compatible normalmente no requiere cambios documentales.

## Principios que no deben romperse

```text
npm como único package manager
Node 24 como única major soportada actualmente
npm@11.19.0 como referencia reproducible
package-lock generado exclusivamente por npm
sin --force
sin --legacy-peer-deps
Actions pinneadas por SHA
PR obligatoria hacia main
validate obligatorio
sin bypass de main
Dependency Review bloquea regresiones
Dependency audit supervisa el estado absoluto
security/** permite remediaciones coordinadas
```

Estos principios deben revisarse explícitamente si cambia de forma material la arquitectura del repositorio.
