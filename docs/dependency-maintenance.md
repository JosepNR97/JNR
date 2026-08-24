# Mantenimiento de dependencias

## Controles automáticos

- Dependabot revisa semanalmente paquetes npm y GitHub Actions.
- Los cambios minor y patch se agrupan por dependencias de producción y desarrollo.
- Las actualizaciones major se presentan en PR independientes para poder evaluar migraciones y regresiones.
- El despliegue y el workflow semanal ejecutan `npm run audit:security`, que bloquea vulnerabilidades high o critical.
- `strict-allow-scripts=true` impide instalar dependencias con scripts no revisados.

## Scripts de instalación

`package.json` mantiene una lista `allowScripts` fijada a versiones concretas. Cuando cambie `esbuild`:

1. Ejecutar `npm install-scripts ls`.
2. Revisar el paquete, su procedencia y el script de instalación.
3. Actualizar la entrada versionada de `allowScripts`.
4. Validar desde cero con `npm ci` y `npm run check`.

No se deben autorizar todos los scripts ni usar rangos abiertos para eliminar un warning.

## Revisión periódica

Ejecutar al menos trimestralmente:

```bash
npm outdated
npm run audit:security
npm run check
```

No usar `npm audit fix --force` automáticamente: puede introducir actualizaciones major fuera de los rangos declarados.

## Majors pospuestos

A 24 de agosto de 2026 se mantienen deliberadamente fuera de esta actualización:

- React 19 y sus tipos: requiere una migración funcional y revisión del renderizado PDF.
- Tailwind CSS 4: implica migrar PostCSS, configuración y utilidades personalizadas.
- TypeScript 7: requiere revisar cambios del compilador y compatibilidad del ecosistema.
- Testing Library React 16: conviene coordinarla con la futura migración de React.
- Lucide React 1: requiere una revisión visual completa de todos los iconos.

Estas versiones no se ocultan: Dependabot abrirá PR independientes para poder planificarlas.
