# Gestion del backlog de JNR

GitHub Issues es la fuente de verdad del trabajo pendiente. No mantener un
segundo backlog en HTML ni duplicar el contenido de las issues en una Wiki.

## Modelo ligero

- Una issue por mejora que pueda cerrarse de forma independiente.
- Titulo con identificador estable, por ejemplo `[D13] ...`.
- Area mediante etiqueta: `area:design`, `area:technical` o
  `area:functionality`.
- Fase mediante etiqueta: `phase:now`, `phase:next` o `phase:optional`.
- `open` significa pendiente o en curso; `closed` significa resuelta o descartada
  con explicacion. No son necesarios estados adicionales para una sola persona.
- La descripcion de cada issue incluye contexto, objetivo, alcance, referencias,
  impacto estimado, criterio de reindexacion y prompt cuando proceda.
- Las dependencias recomendadas se enlazan con `#numero` y no bloquean.
  Usar la relacion nativa "blocked by" solo para verdaderos prerrequisitos.

## Ciclo de una mejora

1. Revisar la issue, el `main` actual y las dependencias.
2. Desarrollar en una rama separada de `main`, mediante la web de GitHub si se
   prefiere. Mantener las PR pequenas y revisables.
3. Incluir `Closes #N` en la descripcion de la PR si su merge debe cerrar la
   issue. Si la tarea es una auditoria sin cambios de codigo, documentar sus
   conclusiones en la issue y cerrarla manualmente.
4. Conservar el required check `CI / validate`, los tests E2E y el control de
   accesibilidad ya existentes.
5. Solicitar reindexacion manual solo cuando cambie contenido o metadata
   indexable de forma significativa; no por cada merge.

## Consultas utiles

- [Todas las issues abiertas](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen)
- [Iniciativas para ahora](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen+label%3Aphase%3Anow)
- [Trabajo tecnico](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%3Atechnical)

## Documentacion y tablero

Mantener el README como entrada al proyecto y las guias tecnicas versionadas en
`docs/` (`dependency-maintenance.md`, `multilingual-seo.md`, `image-delivery.md`
y futuras guias). No duplicar esas guias en la Wiki.

No es necesario GitHub Projects mientras las issues y sus etiquetas basten para
priorizar el trabajo. Si despues se necesita un tablero, crear un unico Project
que referencie estas mismas issues, sin una segunda lista de tareas.
