// Reveal fallback: ensures content stays visible even if GSAP fails to load
// or the user prefers reduced motion. Adds .is-visible to .reveal* elements
// once they enter the viewport. CSS in Layout.astro resets initial state only
// when prefers-reduced-motion is no-preference, so accessibility is preserved.
const REVEAL_SELECTORS = [".reveal", ".reveal-left", ".reveal-right", ".reveal-scale"];

export function initRevealFallback(): void {
  const prefersReducedMotion =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Reduced motion: reveal everything immediately.
    document.querySelectorAll(REVEAL_SELECTORS.join(",")).forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll(REVEAL_SELECTORS.join(",")).forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  document
    .querySelectorAll(`${REVEAL_SELECTORS.join(",")}:not(.is-visible)`)
    .forEach((el) => observer.observe(el));

  // Re-scan after a tick in case React islands render late.
  setTimeout(() => {
    document
      .querySelectorAll(`${REVEAL_SELECTORS.join(",")}:not(.is-visible)`)
      .forEach((el) => observer.observe(el));
  }, 1000);
}

if (document.readyState !== "loading") {
  initRevealFallback();
} else {
  document.addEventListener("DOMContentLoaded", initRevealFallback);
}
