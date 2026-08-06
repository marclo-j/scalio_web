# Lighthouse — Notas de optimización

## Falsos positivos conocidos

### `unminified-javascript` (score 0.5)
Lighthouse reporta un único recurso no minificado: `chrome-extension://blockjmkbacgjkknlgpkjjiijinjdanf/js/contentscript.js`.

**No es parte del sitio.** Es una extensión del navegador (uBlock Origin / adblocker) que inyecta un content script durante el audit. No tenemos control sobre su minificación.

- Ignorar el audit. No impacta en métricas reales (TBT/LCP/FCP) — `metricSavings` es 0.
- Para auditorías limpias sin este ruido, ejecutar Lighthouse en modo incógnito sin extensiones.

### `render-blocking-insight` (score 0.5)
Reporta `/_astro/index.*.css` como render-blocking. Es el CSS global (≈14 KB) y Lighthouse ya reporta `metricSavings.LCP: 0` y `transferSize: 0` (está cacheado en borde). El inline del CSS completo no es rentable (aumentaríamos HTML crítico + duplicación entre rutas); el bloqueo en la cadena crítica es negligible.

## Cambios aplicados (agosto 2026)

1. **GSAP movido a NPM + code-splitting**: eliminados los 2 scripts CDN `is:inline defer` de `Layout.astro`. Nuevo `src/scripts/animations.ts` se carga lazy vía `requestIdleCallback` desde `index.astro`. Chunk `animations.*.js` (~113 KB) solo se descarga/después del idle del navegador.
2. **BackgroundGradient**: `client:load` eliminado. Sustituido por `src/components/BackgroundGradient.astro` (server-render, sin React). Toda la página deja de hidratarse.
3. **Fondo (WebGL)**: cambiado de `client:load` a `client:visible` en `Diferenciadores.astro:13`. Añadido `IntersectionObserver` en `Fondo.tsx` para pausar el `requestAnimationFrame` cuando el canvas sale del viewport.
4. **Forced reflows**: en `src/scripts/animations.ts` las lecturas de layout se batchean dentro de `requestAnimationFrame`, y `ScrollTrigger.refresh()` se llama una sola vez al final (antes: 4 veces + 2 setTimeout).
5. **Reveal fallback**: nuevo `src/scripts/reveal-fallback.ts` con `IntersectionObserver` que añade `.is-visible`. CSS en `Layout.astro` actualizado con `@media (prefers-reduced-motion: reduce)`.
6. **LQIP**: `scripts/generate-lqip.mjs` genera placeholders 10×10px (78-106 bytes c/u) para los 4 posters de `<video>`. Aplicados como `background-image` con `filter: blur(20px)` en `Diferenciadores.astro`.
7. **Atributos de imagen**: `loading`, `decoding`, `fetchpriority`, `width`, `height` añadidos en Hero/Testimonials/ScrollText/Footer.
8. **Limpieza de huérfanos**: eliminados `ChatWidget.astro`, `FAQ.astro`, `Logo3D.tsx`, `ui/background-gradient-animation.tsx`. Limpiadas deps `3dsvg`, `@react-three/drei`, `@react-three/fiber`, `framer-motion`, `three` de `package.json`.

## Comandos

```bash
pnpm run lqip      # regenera LQIPs de /public/videos/*-poster.webp → src/data/lqip.json
pnpm run prebuild  # alias del anterior; corre antes de `pnpm build`
pnpm build         # build de producción (corre prebuild)
pnpm preview       # sirve dist/ en localhost:4321 para Lighthouse local
```

## Verificación Lighthouse local

```bash
pnpm build && pnpm preview
# en otra terminal, con preview corriendo en http://localhost:4321:
npx lighthouse http://localhost:4321 --only-categories=performance --view
```
