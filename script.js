/* ══════════════════════════════════════════════════
   HIMANSHU RAJ — PORTFOLIO SCRIPT
   ══════════════════════════════════════════════════ */

"use strict";

// ── PAGE LOADER ──────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 700);
    }
    // Trigger hero animations
    document.querySelectorAll("#hero .reveal-up, #hero .reveal-left, #hero .reveal-right")
      .forEach(el => el.classList.add("revealed"));
    // Start typing
    initTyping();
  }, 1500);
});

// ── CUSTOM CURSOR ────────────────────────────────────
const cursorDot  = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + "px";
  cursorDot.style.top   = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top  = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand ring on interactive elements
document.querySelectorAll("a, button, .project-card, .skill-card, .service-card, .stat-card, .about-card")
  .forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-expanded"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-expanded"));
  });

// ── SCROLL PROGRESS ──────────────────────────────────
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const h   = document.documentElement.scrollHeight - window.innerHeight;
  const pct = window.scrollY / h;
  progressBar.style.transform = `scaleX(${pct})`;
}, { passive: true });

// ── NAVBAR ───────────────────────────────────────────
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// Active link highlight
const sections = document.querySelectorAll("section[id]");
const linkMap  = {};
document.querySelectorAll(".nav-links a").forEach(a => {
  const href = a.getAttribute("href").replace("#","");
  linkMap[href] = a;
});

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const link = linkMap[entry.target.id];
    if (link) link.classList.toggle("active", entry.isIntersecting);
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => navObserver.observe(s));

// ── PARTICLE CANVAS ──────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const COLORS = ["rgba(0,229,160,", "rgba(77,159,255,", "rgba(139,92,246,"];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.alpha -= 0.0008;
      if (this.y < -10 || this.alpha < 0) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function tick() {
    ctx.clearRect(0, 0, W, H);
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,160,${0.04 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// ── TYPING EFFECT ────────────────────────────────────
function initTyping() {
  const el    = document.getElementById("typed-text");
  if (!el) return;
  const lines = [
    "Computer Science Student",
    "Web Developer",
    "Startup Builder",
    "Problem Solver",
    "Product Thinker"
  ];
  let li = 0, ci = 0, deleting = false;

  function tick() {
    const current = lines[li];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        li = (li + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();
}

// ── SCROLL REVEAL ────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => {
  // Don't observe hero elements (handled by loader)
  if (!el.closest("#hero")) revealObserver.observe(el);
});

// ── SKILL BAR ANIMATION ──────────────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".skill-fill").forEach(fill => {
        const w = fill.dataset.width;
        setTimeout(() => { fill.style.width = w + "%"; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll("#skills").forEach(s => skillObserver.observe(s));

// ── COUNTER ANIMATION ────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isLarge = target > 100;

  function frame(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = Math.floor(eased * target);
    el.textContent = isLarge
      ? value.toLocaleString()
      : value;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = isLarge ? target.toLocaleString() : target;
  }
  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-num[data-target]").forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll("#achievements").forEach(s => statObserver.observe(s));

// ── TESTIMONIAL SLIDER ───────────────────────────────
(function initSlider() {
  const slider = document.getElementById("testi-slider");
  const dotsEl = document.getElementById("testi-dots");
  const prev   = document.getElementById("testi-prev");
  const next   = document.getElementById("testi-next");
  if (!slider) return;

  const cards = slider.querySelectorAll(".testi-card");
  let current = 0;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "testi-dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(d);
  });

  function goTo(idx) {
    cards[current].style.opacity = "0";
    current = (idx + cards.length) % cards.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll(".testi-dot").forEach((d,i) => d.classList.toggle("active", i === current));
    setTimeout(() => cards[current].style.opacity = "1", 100);
  }

  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));

  // Auto-advance
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  slider.addEventListener("mouseenter", () => clearInterval(autoPlay));
  slider.addEventListener("mouseleave", () => { autoPlay = setInterval(() => goTo(current + 1), 5000); });
})();

// ── CONTACT FORM ─────────────────────────────────────
(function initContactForm() {
  const sendBtn = document.getElementById("send-btn");
  const success = document.getElementById("form-success");
  if (!sendBtn) return;

  sendBtn.addEventListener("click", () => {
    const name  = document.getElementById("cf-name")?.value.trim();
    const email = document.getElementById("cf-email")?.value.trim();
    const msg   = document.getElementById("cf-msg")?.value.trim();

    if (!name || !email || !msg) {
      // Shake empty fields
      [document.getElementById("cf-name"), document.getElementById("cf-email"), document.getElementById("cf-msg")]
        .forEach(el => {
          if (el && !el.value.trim()) {
            el.style.borderColor = "#ef4444";
            setTimeout(() => el.style.borderColor = "", 2000);
          }
        });
      return;
    }

    sendBtn.style.opacity = "0.6";
    sendBtn.disabled = true;
    const originalText = sendBtn.querySelector(".send-text").textContent;
    sendBtn.querySelector(".send-text").textContent = "Sending...";

    setTimeout(() => {
      sendBtn.style.opacity = "1";
      sendBtn.disabled = false;
      sendBtn.querySelector(".send-text").textContent = originalText;
      success.style.display = "block";
      // Clear form
      ["cf-name","cf-email","cf-subject","cf-msg"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      setTimeout(() => { success.style.display = "none"; }, 5000);
    }, 1200);
  });
})();

// ── BACK TO TOP ──────────────────────────────────────
const btt = document.getElementById("back-to-top");
if (btt) {
  window.addEventListener("scroll", () => {
    btt.style.opacity = window.scrollY > 600 ? "1" : "0";
    btt.style.pointerEvents = window.scrollY > 600 ? "all" : "none";
  }, { passive: true });
  btt.style.opacity = "0";
  btt.style.transition = "opacity 0.3s ease";
}

// ── SMOOTH PROJECT CARD HOVER ─────────────────────────
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ── SERVICE CARD TILT ────────────────────────────────
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-3px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// ── SKILL CARD GLOW ───────────────────────────────────
document.querySelectorAll(".skill-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,229,160,0.08), rgba(255,255,255,0.04) 60%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.background = "var(--surface)";
  });
});

console.log("%cHimanshu Raj — Portfolio", "color: #00e5a0; font-family: monospace; font-size: 1.2rem; font-weight: bold;");
console.log("%cHandcrafted with HTML, CSS & Vanilla JS. No frameworks. No templates.", "color: rgba(232,232,240,0.5); font-family: monospace;");
