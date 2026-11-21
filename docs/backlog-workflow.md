
# Gestión del backlog y GitHub Project de JNR

## Fuente de verdad

Las issues del repositorio son el registro oficial de requisitos, decisiones,
prompts y dependencias. GitHub Projects muestra los mismos datos en formato de
tabla o tablero. No hay ningún HTML ni JSON de backlog que mantener.

## Crear o editar una iniciativa

1. Desde `JNR → Issues → New issue`, utiliza **Mejora del portafolio**.
2. Escribe el objetivo, la motivación, el alcance y los criterios de aceptación.
3. Selecciona **Área**, **Fase**, **Impacto**, **Esfuerzo estimado** y
   **Reindexación manual**. Estos cinco datos son obligatorios.
4. Indica dependencias con referencias a issues de JNR (`#126`, por ejemplo):
   - **Recomendadas:** conviene realizar otra mejora antes, pero no es necesario.
   - **Bloqueantes:** no se puede completar la mejora sin terminar otra issue.
5. Añade el prompt de implementación cuando exista. Si utilizas IA, comprueba que
   los hechos y requisitos estén basados en el `main` actual.
6. Publica la issue. La Action **Sincronizar JNR Project** añadirá la iniciativa
   al Project, rellenará los campos, reconciliará etiquetas y recalculará las
   relaciones de la vista de dependencias.

También es válido editar una issue ya importada en el formato antiguo: el
sincronizador reconoce los campos de su sección **Clasificación** y las
referencias de su sección **Dependencias**.

Para crear issues desde un chat con IA sin utilizar el formulario, solicita una
descripción con estos campos exactos, además del objetivo, el enfoque y los
criterios de aceptación:

```markdown
## Clasificación

- **Área:** Diseño
- **Fase:** Ahora
- **Impacto:** Alto
- **Esfuerzo estimado:** Medio
- **Reindexación manual:** No

## Dependencias

- **Recomendada (no bloqueante)**: #126 — Motivo de la recomendación.
```

Utiliza los mismos nombres y valores que ofrece el formulario. No inventes
identificadores de issues, bloqueos, proyectos ni resultados de pruebas.

## Campos y vistas

- **01 · Backlog completo**: agrupado por Fase, ordenado por Orden.
- **02 · Por área**: agrupado por Área.
- **03 · Ejecución**: Kanban por Status.
- **04 · Dependencias**: Depende de, Facilita a, Relación y N.º relaciones.

En **Depende de**, cada referencia indica qué otra issue debe realizarse antes.
En **Facilita a**, se muestran las iniciativas que apuntan a la actual. La
relación «Recomendada» no bloquea. «Bloqueante» sí se refleja mediante la
relación nativa **Relationships → Blocked by** de GitHub.

El Project conserva un mapa adicional de relaciones en su README, generado a
partir de las issues. Incluye una tabla y un diagrama Mermaid donde se admita.
Las relaciones y el README se recalculan automáticamente tras cada edición.

## Reglas de sincronización

- **Issue → Project**, nunca al revés, para Área, Fase, Impacto, Esfuerzo,
  Reindexación y relaciones. Cambia esos valores editando la descripción de la
  issue, no la celda del tablero.
- **Orden**: si la issue tiene el campo opcional «Orden», prevalece su número.
  Si está vacío, el Project asigna una posición inicial y después respeta los
  cambios de orden realizados manualmente en la tabla.
- **Status**: se puede mover a «In progress» desde el tablero; al cerrar la
  issue, la Action lo marca «Done». Al reabrirla, pasa a «Todo».
- **Bloqueos**: la Action añade relaciones nativas cuando se declara un bloqueo.
  Para retirar un bloqueo existente, utiliza **Relationships** en GitHub y
  elimina también su referencia de la descripción. No se borran bloqueos
  automáticamente para evitar eliminar relaciones creadas manualmente.
- **Etiquetas**: `area:*` y `phase:*` se ajustan automáticamente a los campos de
  la issue. Las restantes etiquetas no se modifican.

## Configuración y mantenimiento de la Action

El workflow permanente es `.github/workflows/sync-portfolio-project.yml` y
utiliza `scripts/sync-portfolio-project.mjs`.

- Se ejecuta cuando el propietario crea, edita, abre, cierra o cambia etiquetas
  de una issue, y se puede lanzar manualmente desde `Actions`.
- Un `workflow_dispatch` con `dry_run = true` solo valida la información.
- Un `workflow_dispatch` con `dry_run = false` crea o reconcilia el Project y
  todos sus campos, elementos y vistas. No crea otro Project si ya existe uno
  con el mismo nombre.
- Requiere el secreto `JNR_PROJECT_PAT`: PAT clásico de GitHub con los permisos
  `project` y `repo`, siguiendo la documentación oficial para Projects.
- El token se guarda únicamente en **Settings → Secrets and variables → Actions**.
  Nunca se incluye en una issue, PR, fichero de código o conversación.
- Al caducar el PAT, hay que renovarlo y actualizar el mismo secreto.
  De lo contrario, la sincronización automática dejará de funcionar.
- La Action solo se ejecuta con credenciales para eventos iniciados por el
  propietario o cuando este la lanza manualmente.
- Si la API no permite aplicar agrupaciones u ordenaciones a alguna vista,
  revisa `View → Group by / Sort by` una sola vez desde la interfaz.

## Flujo de desarrollo

1. Revisar la issue y contrastarla con el `main` actual.
2. Trabajar en una rama y PR pequeñas, con cambios revisables.
3. Mantener los controles existentes: formato, ESLint, tests, build, Playwright,
   accesibilidad y Dependency Review.
4. Incluir `Closes #N` en la PR para que GitHub cierre la issue al fusionar.
5. Solicitar reindexación solo cuando se haya publicado contenido o metadata
   indexable relevante, no por cada cambio técnico o visual.
6. Descartar mejoras cerrándolas como «not planned», sin borrar su historial.

## Limpieza del repositorio

Tras verificar el Project y la sincronización, deben eliminarse en una PR:

- `.github/backlog-import-v10.json`
- `scripts/import-backlog-issues.mjs`
- `.github/workflows/import-backlog-issues.yml`

Si se hubiera incorporado el bootstrap temporal anterior, eliminar también
`.github/workflows/bootstrap-portfolio-project.yml` y
`scripts/bootstrap-jnr-project.mjs`. Conservar este documento, la issue form, el
workflow de sincronización y su script: son herramientas permanentes.

La Wiki es opcional y no debe duplicar las guías técnicas de `docs/`. Un único
Project es suficiente; no hacen falta otros tableros ni otro backlog en HTML.
