import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function waitForSelector(selector: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) return resolve(true);
    const observer = new MutationObserver((_m, obs) => {
      if (document.querySelector(selector)) {
        obs.disconnect();
        resolve(true);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(false);
    }, timeout);
  });
}

export async function initAnimations(): Promise<void> {
  try {
    // BATCH all reads first, then writes inside rAF to avoid forced reflows.
    // ScrollTrigger.refresh() also forced reflows before; now we call it ONCE
    // at the end after every animation is registered.
    await Promise.all([
      setupScrollProgress(),
      setupServicesReveal(),
      setupDiffCards(),
      setupTestimonials(),
      setupCTA(),
    ]);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  } catch (e) {
    console.error("GSAP init failed:", e);
  }
}

function setupScrollProgress(): Promise<void> {
  return Promise.resolve().then(() => {
    gsap.to("#scrollProgress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  });
}

function setupServicesReveal(): Promise<void> {
  return waitForSelector(".services-section").then((found) => {
    if (!found) return;
    gsap.fromTo(
      ".services-section",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

function setupDiffCards(): Promise<void> {
  return waitForSelector(".diff-card").then((found) => {
    if (!found) return;
    const cards = gsap.utils.toArray<HTMLElement>(".diff-card");
    cards.forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: ".diff-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
}

function setupTestimonials(): Promise<void> {
  return waitForSelector(".testimonial-card").then((found) => {
    if (!found) return;
    const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
    cards.forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
}

function setupCTA(): Promise<void> {
  return waitForSelector(".cta-inner").then((found) => {
    if (!found) return;
    gsap.fromTo(
      ".cta-inner",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}
