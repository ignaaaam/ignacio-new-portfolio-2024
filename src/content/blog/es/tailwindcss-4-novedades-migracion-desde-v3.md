---
title: "TailwindCSS 4: novedades y migración desde v3"
description: "TailwindCSS 4 trae un motor Rust, configuración en CSS y mejoras reales de rendimiento. Resumen práctico de novedades y pasos para migrar desde v3."
author: Ignacio Amat
publishDate: 2026-02-23
slug: tailwindcss-4-novedades-migracion-desde-v3
locale: es
translationKey: tailwindcss-4-migration-2026
image:
  url: /img/optimized/tailwindcss-4-article.webp
  alt: "Desarrollo frontend con TailwindCSS 4 y migración desde la versión 3"
tags:
  - TailwindCSS
  - CSS
  - Frontend
  - Migración
  - Full Stack
isDraft: false
---

# TailwindCSS 4: novedades y migración desde v3

TailwindCSS 4 no es una actualización menor. Es una reescritura profunda del motor interno, con un compilador nuevo en Rust, un sistema de configuración que vive directamente en CSS y mejoras de rendimiento que se notan desde el primer build. Si trabajas con Tailwind en producción, esto te interesa.

## Qué cambia en TailwindCSS 4

El cambio más importante es filosófico: la configuración deja de vivir en `tailwind.config.js` y pasa a tu archivo CSS. En lugar de las tres directivas clásicas (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), ahora usas un solo import. El framework detecta automáticamente qué clases usas en tu proyecto, así que tampoco necesitas configurar el array `content` manualmente.

Por debajo, el motor JavaScript fue reemplazado por **Oxide**, un compilador escrito en Rust. El resultado: builds incrementales que pasan de 44ms a 5ms. En proyectos grandes, eso se traduce en un flujo de desarrollo mucho más ágil.

## Novedades principales

Las mejoras no son solo internas. Hay funcionalidad nueva que antes requería plugins o hacks:

- **container queries** integradas en el core, sin necesidad del plugin `@tailwindcss/container-queries`;
- **transformaciones 3D** nativas con utilidades como `rotate-x-*`, `rotate-y-*`, `scale-z-*` y `translate-z-*`;
- **cascade layers** nativos de CSS para un control más fino de la especificidad;
- **color-mix()** para ajustar opacidad de cualquier valor de color sin variables extra;
- soporte nativo para **propiedades personalizadas registradas**, lo que permite animar gradientes;
- utilidades nuevas como `inset-shadow-*`, `inset-ring-*`, `field-sizing` para textareas autoajustables y `font-stretch` para fuentes variables.

La directiva `@theme` reemplaza la sección `theme.extend` del config anterior, y todo se define con sintaxis CSS estándar.

## Migración desde v3

Tailwind ofrece una herramienta oficial de migración que cubre la mayoría de los casos:

1. ejecutar `npx @tailwindcss/upgrade` en la raíz del proyecto;
2. actualizar la configuración del bundler (Vite, PostCSS o el que uses);
3. convertir las personalizaciones del theme a la directiva `@theme` en CSS;
4. revisar utilidades renombradas: `shadow` pasa a `shadow-sm`, `rounded` a `rounded-sm`, `ring` a `ring-1` por defecto, `outline-none` a `outline-hidden`.

En proyectos simples, la migración tarda entre una y dos horas. Proyectos con plugins custom o configuraciones muy extendidas pueden necesitar un día completo de revisión.

## Qué significa para proyectos en producción

El soporte de navegadores parte desde Safari 16.4+, Chrome 111+ y Firefox 128+. Si tu audiencia incluye navegadores más antiguos, conviene quedarse en v3.4 hasta que los requisitos cambien.

En mi caso, para proyectos con Astro, Laravel o Next.js donde el stack de navegadores está actualizado, la migración merece la pena. El compilador Rust elimina cuellos de botella en desarrollo, la configuración CSS-first reduce archivos de config y las utilidades nuevas cubren casos que antes requerían CSS custom.

No hace falta migrar todo de golpe. Puedes mantener v3 en proyectos estables y adoptar v4 en proyectos nuevos o en los que ya tenías previsto refactorizar.

## Conclusión

TailwindCSS 4 es una mejora real, no solo de marketing. El motor Rust, la configuración en CSS y las utilidades nuevas resuelven problemas concretos del día a día. Si ya usas Tailwind, el camino de migración está bien documentado y la herramienta oficial facilita la transición. Lo veo como una actualización que compensa el esfuerzo de adoptarla.
