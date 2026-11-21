# Gestión del backlog de JNR

GitHub Issues es la fuente de verdad del trabajo pendiente. No debe mantenerse un
segundo backlog en HTML ni duplicarse el contenido de las issues en una wiki.

## Modelo ligero

- Una issue por mejora que pueda cerrarse de forma independiente.
- Título con identificador estable, por ejemplo, `[D13] ...`.
- Área mediante una etiqueta: `area:design`, `area:technical` o
  `area:functionality`.
- Fase mediante una etiqueta: `phase:now`, `phase:next` o `phase:optional`.
- `open` significa pendiente o en curso; `closed` significa resuelta o descartada
  con una explicación. No son necesarios estados adicionales para una sola persona.
- La descripción de cada issue incluye contexto, objetivo, alcance, referencias,
  impacto estimado, criterio de reindexación y prompt, cuando proceda.
- Las dependencias recomendadas se enlazan con `#N` y no bloquean.
  La relación nativa «blocked by» se reserva para los verdaderos prerrequisitos.

## Ciclo de una mejora

1. Revisar la issue, el `main` actual y las dependencias.
2. Desarrollar en una rama separada de `main`, directamente desde la web de GitHub
   si se prefiere. Mantener las PR pequeñas y revisables.
3. Incluir `Closes #N` en la descripción de la PR si su fusión debe cerrar la issue.
   Si la tarea consiste en una auditoría sin cambios de código, documentar sus
   conclusiones en la issue y cerrarla manualmente.
4. Conservar la comprobación obligatoria `CI / validate`, las pruebas E2E y el
   control de accesibilidad ya existentes.
5. Solicitar la reindexación manual solo cuando cambien de forma significativa el
   contenido o los metadatos indexables; no por cada fusión de una PR.

## Consultas útiles

- [Todas las issues abiertas](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen)
- [Iniciativas para ahora](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen+label%3Aphase%3Anow)
- [Trabajo técnico](https://github.com/JosepNR97/JNR/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%3Atechnical)

## Documentación y tablero

Mantener el `README.md` como punto de entrada al proyecto y las guías técnicas
versionadas en `docs/` (`dependency-maintenance.md`, `multilingual-seo.md`,
`image-delivery.md` y futuras guías). No duplicar esas guías en la wiki.

No es necesario utilizar GitHub Projects mientras las issues y sus etiquetas
permitan priorizar el trabajo. Si después se necesita un tablero, crear un único
Project que haga referencia a estas mismas issues, sin una segunda lista de tareas.
