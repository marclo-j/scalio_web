# Guía de Implementación: Mejoras GSAP para tu Carrusel

## 🔧 PASO 1: Animar el cambio de Título/Categoría (MÁS FÁCIL)

### Actual (salto instantáneo):

```javascript
titleEl.textContent = card.dataset.title || "";
subtitleEl.textContent = card.dataset.category || "";
```

### Mejorado con GSAP:

```javascript
function updateInfo() {
  // ... código existente ...

  const card = originalCards[index];
  if (card) {
    // Animar salida
    gsap.to(titleEl, { opacity: 0, y: -10, duration: 0.3 });
    gsap.to(subtitleEl, { opacity: 0, y: -10, duration: 0.3 });

    // Cambiar texto y animar entrada
    setTimeout(() => {
      titleEl.textContent = card.dataset.title || "";
      subtitleEl.textContent = card.dataset.category || "";

      gsap.from(titleEl, { opacity: 0, y: 10, duration: 0.4 });
      gsap.from(subtitleEl, { opacity: 0, y: 10, duration: 0.4 });
    }, 300);
  }
}
```

---

## 🎢 PASO 2: Animaciones en Hover de Tarjetas

### Agregar a tu CSS:

```css
.work-card {
  position: relative;
  overflow: hidden;
  /* ... resto de estilos ... */
  will-change: transform; /* Performance */
}

.work-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0),
    rgba(0, 0, 0, 0.3)
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.work-card:hover::after {
  opacity: 1;
}
```

### Agregar a tu JavaScript:

```javascript
// Dentro de DOMContentLoaded
allCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    // Solo animar la tarjeta central (card-center)
    if (card.classList.contains("card-center")) {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out",
      });

      // Animar la imagen
      const img = card.querySelector("img");
      gsap.to(img, {
        scale: 1.15,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  });

  card.addEventListener("mouseleave", () => {
    if (card.classList.contains("card-center")) {
      gsap.to(card, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      const img = card.querySelector("img");
      gsap.to(img, {
        scale: 1.08,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  });
});
```

---

## 🌌 PASO 3: Blur en Tarjetas Laterales

### Mejorar tu updateCardStates():

```javascript
function updateCardStates() {
  const trackCenter = track.scrollLeft + track.clientWidth / 2;

  allCards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = cardCenter - trackCenter;

    card.classList.remove("card-left", "card-center", "card-right");

    if (Math.abs(distance) < card.offsetWidth / 2) {
      card.classList.add("card-center");
      // Animar a estado nítido
      gsap.to(card, {
        filter: "blur(0px) brightness(1)",
        duration: 0.6,
        ease: "power2.inOut",
      });
    } else if (distance < 0) {
      card.classList.add("card-left");
      gsap.to(card, {
        filter: "blur(4px) brightness(0.7)",
        duration: 0.6,
        ease: "power2.inOut",
      });
    } else {
      card.classList.add("card-right");
      gsap.to(card, {
        filter: "blur(4px) brightness(0.7)",
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  });
}
```

### Actualizar tu CSS:

```css
.work-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  flex: 0 0 115%;
  aspect-ratio: 16 / 9;
  min-height: 850px;
  background: #0f0f0f;
  scroll-snap-align: center;
  content-visibility: auto;
  contain: content;
  filter: blur(0px) brightness(1); /* Valor inicial */
}

.work-card.card-left {
  opacity: 0.7;
  mask-image: linear-gradient(to right, transparent 0%, black 30%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
}

/* ... resto de estilos ... */
```

---

## ⚡ PASO 4: Animación de Carga Inicial (Stagger)

### Agregar después de calculateCardWidth():

```javascript
function animateInitialLoad() {
  // Animar entrada de cards
  gsap.from(originalCards, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.2,
  });

  // Animar título y botones
  gsap.from(
    [titleEl, subtitleEl],
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
    },
    0.3,
  );

  gsap.from(
    [prevBtn, nextBtn],
    {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "back.out",
      stagger: 0.1,
    },
    0.5,
  );
}

// Llamar después de inicializar
animateInitialLoad();
```

---

## 🔢 PASO 5: Contador Animado (Opcional pero impactante)

### Agregar HTML:

```html
<div class="carousel-counter">
  <span class="carousel-current">1</span>
  <span class="carousel-separator">/</span>
  <span class="carousel-total">6</span>
</div>
```

### Agregar CSS:

```css
.carousel-counter {
  text-align: center;
  font-size: 0.9rem;
  color: var(--white-muted);
  margin-top: 1rem;
  letter-spacing: 0.05em;
}

.carousel-current {
  color: var(--white);
  font-weight: 600;
  display: inline-block;
  min-width: 2rem;
}
```

### Agregar JavaScript:

```javascript
const counterEl = document.querySelector(".carousel-current");
const totalEl = document.querySelector(".carousel-total");

function updateCounter() {
  let index = Math.round(track.scrollLeft / getCardWidth()) - 1;
  index = ((index % totalCards) + totalCards) % totalCards;

  if (counterEl && totalEl) {
    // Animar el número
    gsap.to(counterEl, {
      textContent: index + 1,
      duration: 0.4,
      snap: { textContent: 1 },
      ease: "power1.inOut",
      color: "var(--yellow)",
    });

    totalEl.textContent = totalCards;
  }
}

// Llamar en updateInfo()
updateCounter();
```

---

## 🎨 PASO 6: Easing Mejorado en Botones

### Mejorar navegación:

```javascript
prevBtn.addEventListener("click", () => {
  gsap.to(track, {
    scrollLeft: track.scrollLeft - getCardWidth(),
    duration: 0.7,
    ease: "power2.inOut",
    onUpdate: updateCardStates,
  });
});

nextBtn.addEventListener("click", () => {
  gsap.to(track, {
    scrollLeft: track.scrollLeft + getCardWidth(),
    duration: 0.7,
    ease: "power2.inOut",
    onUpdate: updateCardStates,
  });
});
```

### Animar botones al hover:

```css
.carousel-arrow {
  position: relative;
  transition: all 0.3s ease;
}

.carousel-arrow:hover:not(:disabled) {
  background: var(--yellow);
  border-color: var(--yellow);
  color: var(--dark);
  transform: scale(1.1);
}

.carousel-arrow:active:not(:disabled) {
  transform: scale(0.95);
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Nivel 1 - Básico (1-2 horas)**
  - [ ] Animar título/categoría (Paso 1)
  - [ ] Blur en tarjetas laterales (Paso 3)
  - [ ] Animación inicial (Paso 4)
- [ ] **Nivel 2 - Intermedio (2-4 horas)**
  - [ ] Hover effects en tarjetas (Paso 2)
  - [ ] Contador animado (Paso 5)
  - [ ] Easing mejorado (Paso 6)
- [ ] **Nivel 3 - Avanzado (4+ horas)**
  - [ ] Parallax en imágenes
  - [ ] Scroll trigger
  - [ ] Efectos 3D
  - [ ] Desaturación dinámmica

---

## ⚠️ NOTAS IMPORTANTES

1. **Asegúrate de importar GSAP al inicio:**

```javascript
import gsap from "gsap";
```

1. **Para mejor performance, agregar:**

```css
* {
  will-change: auto;
}

.work-card {
  will-change: transform, filter;
}
```

1. **Testear en:**

- Desktop (Chrome, Firefox, Safari)
- Mobile (iOS Safari, Chrome)
- Tablets

2. **Medir performance con DevTools:**

- Chrome: Perf tab
- Firefox: Performance
- Safari: Develop > Show Web Inspector

---

## 🎯 RESULTADO ESPERADO

Después de implementar estos pasos, tu carrusel debería tener:

- ✨ Transiciones suaves y profesionales
- 🎢 Feedback visual en cada interacción
- 🌌 Sensación de profundidad
- ⚡ Animaciones coordinadas
- 👁️ Aspecto similar a GSAP Showcase (pero adaptado a tu marca)
