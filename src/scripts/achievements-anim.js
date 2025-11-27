/* Timeline animations for Achievements page
 * This file is bundled by Astro/Vite, so bare imports like 'gsap' work.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Run after DOM is ready
function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

ready(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

  const items = document.querySelectorAll('.timeline-item');
  const progress = document.querySelector('.timeline-progress');
  const dots = document.querySelectorAll('.timeline-dot');
  const dateCards = document.querySelectorAll('.date-card');

  // Fallback function — reveal content without animation
  const revealFallback = () => {
    items.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (progress) {
      progress.style.height = '100%';
    }
  };

  // If reduced motion preferred, skip animations
  if (prefersReduced) {
    revealFallback();
    return;
  }

  try {
    if (gsap && typeof gsap.registerPlugin === 'function') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!items.length) return; // nothing to animate

    items.forEach((el, i) => {
      // Card subtle entrance
      const card = el.querySelector('.timeline-card') || el;
      gsap.from(card, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        opacity: 0,
        y: 26,
        scale: 0.985,
        rotate: (i % 2 === 0 ? -0.25 : 0.25),
        duration: 0.9,
        ease: 'power3.out',
        delay: i * 0.05,
        clearProps: 'opacity,transform',
      });

      // Date card entrance (opposite tilt, slight x offset toward its side)
      const dc = el.querySelector('.date-card');
      if (dc) {
        gsap.from(dc, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
          opacity: 0,
          y: 18,
          x: (i % 2 === 0 ? 10 : -10),
          rotate: (i % 2 === 0 ? 0.35 : -0.35),
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.05 + i * 0.04,
          clearProps: 'opacity,transform',
        });
      }
    });

    if (progress) {
      gsap.fromTo(
        progress,
        { height: 0 },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: document.querySelector('.timeline'),
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      );
    }

    // Soft parallax on markers and date pills
    dots.forEach((dot) => {
      gsap.to(dot, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: dot.closest('.timeline-item') || dot,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Center date pill removed from markup; no animation needed

    // Light parallax on date cards
    dateCards.forEach((dc) => {
      gsap.to(dc, {
        y: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: dc.closest('.timeline-item') || dc,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  } catch (e) {
    // On any failure, ensure content is visible
    revealFallback();
  }
});
