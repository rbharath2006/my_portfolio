import "../css/variables.css";
import "../css/layout.css";
import "../css/responsive.css";
import { createScene } from "./scene3d.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Fine-pointer atmosphere and a slim page progress bar.
const motionEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionEnabled && window.matchMedia("(pointer: fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "pointer-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);
  let pointerFrame = 0;
  window.addEventListener("pointermove", event => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      glow.classList.add("is-active");
    });
  }, { passive: true });
}
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.appendChild(progressBar);
let scrollTicking = false;
const updateScrollEffects = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  const heroVisual = $(".hero-visual");
  if (heroVisual && motionEnabled && window.innerWidth > 680) {
    const offset = Math.min(window.scrollY, window.innerHeight) * 0.12;
    heroVisual.style.setProperty("--hero-scroll-y", `${offset}px`);
  }
  scrollTicking = false;
};
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  }
}, { passive: true });
updateScrollEffects();

// Navigation: close the mobile menu after a selection.
const menuToggle = $(".menu-toggle");
const nav = $(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$$(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Theme toggle with local preference persistence.
const themeToggle = $(".theme-toggle");
const savedTheme = localStorage.getItem("bharath-portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light-theme");
const updateThemeIcon = () => {
  const light = document.body.classList.contains("light-theme");
  $(".theme-icon").textContent = light ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
};
updateThemeIcon();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("bharath-portfolio-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  updateThemeIcon();
});

// A real Three.js scene with graceful fallback if WebGL is unavailable.
createScene($("#scene3d"));



// Reveal elements with staggered entrance animations.
const reducedMotionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealElements = $$(".reveal, .skill-card, .project-card, .timeline-item");

if (!reducedMotionPreference && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((el, index) => {
    // Stagger nearby elements by 90 milliseconds.
    const delay = Math.min(index % 4, 3) * 90;

    el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.classList.add("will-reveal");
    revealObserver.observe(el);
  });
} else {
  // Keep all content visible if reduced motion is enabled
  // or IntersectionObserver is not supported.
  revealElements.forEach((el) => {
    el.classList.add("is-visible");
  });
}

// Interactive project detail modal. Use Escape or backdrop to close.



// Interactive project detail modal. Use Escape or backdrop to close.

const projectDetails = {
  qr: {
    eyebrow: "CYBERSECURITY / JAVA / SPRING BOOT",
    title: "QR Phishing Detector",

    description: `OVERVIEW

A Java and Spring Boot security application that analyzes URLs and QR-related inputs to help identify potentially malicious destinations. It combines threat intelligence, URL heuristics, redirect analysis, risk scoring, and an isolated browser sandbox.

DETECTION PIPELINE

1. Input and validation
Accept URL input and validate supported URL formats. QR decoding can supply a URL for analysis.

2. URL normalization
Standardize URLs, extract hostnames and domains, handle IDN/Punycode, and preserve the original URL for reporting.

3. Parallel detection engine
Combine threat-intelligence lookups, allowlist checks, heuristic analysis, supported shortener resolution, and browser sandbox observations.

4. Evidence correlation
Combine the available signals while accounting for their reliability and incomplete or conflicting evidence.

5. Risk scoring and verdict
Produce a risk score, classification, and explanatory signals based on the analysis results.

6. Results dashboard
Present the original and normalized URL, findings, redirect evidence, and available sandbox observations.

BACKGROUND THREAT INTELLIGENCE

The ingestion pipeline fetches configured feeds, validates and normalizes indicators, removes duplicates, and inserts or updates records in PostgreSQL. Optional remote feed ingestion is disabled by default.

BROWSER SANDBOX

A separate Docker Compose environment uses an API gateway, a browser worker running Playwright/Chromium, and a controlled HTTPS egress proxy. It returns observations such as page title, HTTP status, visible text, request information, page errors, and an optional screenshot.

REDIRECT ANALYSIS

A separately gated feature inspects supported shortener redirect headers, follows a limited number of hops, and detects redirect loops. It does not automatically open the final destination page. Sandbox analysis is a separate operation that deliberately loads an HTTPS target in an isolated browser environment.

VERIFICATION

The project report records 69 Maven tests passing with zero failures and zero errors, plus successful application and sandbox smoke checks.

SECURITY NOTE

Threat-intelligence matches, heuristic scores, and browser observations are evidence rather than absolute proof that a site is safe or malicious.`,

    tags: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Threat Intelligence",
      "URL Heuristics",
      "Redirect Analysis",
      "Playwright",
      "Docker",
      "Maven Tests"
    ]
  },

  secure: {
    eyebrow: "ETHICAL HACKING / SECURE WEB DEVELOPMENT",
    title: "Secure Student Notes Web Application",

    description: `OVERVIEW

A Student Notes web application developed in phases to understand common web vulnerabilities, test them in a controlled environment, implement defenses, and verify the hardened application.

VULNERABILITY ASSESSMENT

The project compares a deliberately vulnerable V1 with a hardened V2, focusing on:

• SQL injection
• Cross-site scripting (XSS)
• Cross-site request forgery (CSRF)

SECURITY IMPROVEMENTS

• Passwords are stored using Werkzeug password hashing and verified securely.
• CSRF protection is implemented using Flask-WTF.
• State-changing delete and logout actions use POST requests.
• Jinja template autoescaping helps prevent untrusted note content from executing as HTML.
• Parameterized database queries help prevent SQL injection.
• Session-cookie settings include HttpOnly and SameSite=Lax, with Secure enabled for production.
• Security headers help restrict unsafe browser behavior and reduce common web risks.
• Application errors are handled without exposing internal exception details to users.

TESTING AND BACKUP

The project report records 50 automated tests passing. Database backup and restore procedures were also tested, including integrity and foreign-key checks.

DEPLOYMENT

The application was deployed to PythonAnywhere using Flask, WSGI, and SQLite. Registration, login, note creation, editing, deletion, and logout were tested on the deployed website.

PROJECT OUTCOME

This project demonstrates a practical security workflow: establish a functional application, assess vulnerabilities, implement defenses, retest the application, verify backup and recovery, and deploy the hardened version.

The recorded tests provide evidence for the implemented controls, but they do not constitute a guarantee that every possible vulnerability has been eliminated.`,

    tags: [
      "Python",
      "Flask",
      "SQLite",
      "Flask-WTF",
      "SQL Injection",
      "XSS",
      "CSRF",
      "Pytest",
      "PythonAnywhere"
    ]
  }
};


const modal = $("#projectModal");
let lastFocused = null;

function addCaseCard(container, number, title, description) {
  const card = document.createElement("article");
  card.className = "case-step";

  const index = document.createElement("span");
  index.className = "case-step-number";
  index.textContent = number;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const body = document.createElement("p");
  body.textContent = description;

  card.append(index, heading, body);
  container.appendChild(card);
}

function addFeatureCard(container, title, description, warning = false) {
  const card = document.createElement("article");
  card.className = `case-feature${warning ? " is-warning" : ""}`;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const body = document.createElement("p");
  body.textContent = description;

  card.append(heading, body);
  container.appendChild(card);
}

function getProjectSections(description) {
  const sections = {};
  let currentSection = "";

  description.split("\n").forEach(line => {
    const trimmed = line.trim();

    if (!trimmed) return;

    // Project descriptions use uppercase headings.
    if (/^[A-Z][A-Z0-9 /()&-]{3,}$/.test(trimmed)) {
      currentSection = trimmed;
      sections[currentSection] ??= [];
      return;
    }

    if (currentSection) {
      sections[currentSection].push(trimmed);
    }
  });

  return Object.fromEntries(
    Object.entries(sections).map(([heading, lines]) => [
      heading,
      lines.join(" ")
    ])
  );
}

function openProject(key) {
  const project = projectDetails[key];
  if (!project) return;

  lastFocused = document.activeElement;

  const sections = getProjectSections(project.description);

  $("#modalEyebrow").textContent = project.eyebrow;
  $("#modalTitle").textContent = project.title;

  $("#modalOverview").textContent =
    sections.OVERVIEW || project.description;

  const processContainer = $("#modalProcess");
  const securityContainer = $("#modalSecurity");

  processContainer.replaceChildren();
  securityContainer.replaceChildren();

  const isQrProject = key === "qr";

  $("#modalProcessLabel").textContent = isQrProject
    ? "DETECTION PIPELINE"
    : "SECURITY WORKFLOW";

  $("#modalSecurityLabel").textContent = isQrProject
    ? "KEY CAPABILITIES"
    : "V1 → V2 SECURITY IMPROVEMENTS";

  if (isQrProject) {
    const stages = [
      {
        title: "Input & validation",
        description:
          "Accept URL input, validate supported formats, and extract URLs from QR input where supported."
      },
      {
        title: "URL normalization",
        description:
          "Standardize the URL, extract hostname and domain information, handle IDN/Punycode, and preserve the original URL."
      },
      {
        title: "Parallel detection",
        description:
          "Combine available threat-intelligence lookups, allowlist checks, heuristic analysis, redirect analysis, and sandbox evidence."
      },
      {
        title: "Evidence correlation",
        description:
          "Bring the available signals together while considering source reliability and incomplete or conflicting evidence."
      },
      {
        title: "Risk scoring",
        description:
          "Generate a risk score, classification, and explanations from the available analysis results."
      },
      {
        title: "Results dashboard",
        description:
          "Present URL details, findings, redirect evidence, and available sandbox observations."
      }
    ];

    stages.forEach((stage, index) => {
      addCaseCard(
        processContainer,
        String(index + 1).padStart(2, "0"),
        stage.title,
        stage.description
      );
    });

    addFeatureCard(
      securityContainer,
      "Threat intelligence",
      "Uses configured intelligence sources and stored indicators to inform URL analysis."
    );

    addFeatureCard(
      securityContainer,
      "Heuristic analysis",
      "Checks URL characteristics and suspicious patterns as supporting evidence."
    );

    addFeatureCard(
      securityContainer,
      "Redirect analysis",
      "Examines supported redirect chains with hop limits and loop detection."
    );

    addFeatureCard(
      securityContainer,
      "Isolated browser analysis",
      "Uses a separately controlled browser sandbox to collect page observations."
    );

    $("#modalNote").textContent =
      "A risk score is an indicator, not proof. Available checks depend on configuration and external service availability.";
  } else {
    const workflow = [
      {
        title: "Functional V1",
        description:
          "Establish the student notes application and its core functionality before hardening."
      },
      {
        title: "Vulnerability assessment",
        description:
          "Assess SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF) in a controlled environment."
      },
      {
        title: "Security hardening",
        description:
          "Apply protections including parameterized queries, password hashing, CSRF protection, and safer state-changing requests."
      },
      {
        title: "Retesting",
        description:
          "Use automated tests to check application behavior and the implemented security controls."
      }
    ];

    workflow.forEach((stage, index) => {
      addCaseCard(
        processContainer,
        String(index + 1).padStart(2, "0"),
        stage.title,
        stage.description
      );
    });

    addFeatureCard(
      securityContainer,
      "SQL injection",
      "Parameterized database queries help prevent untrusted input from changing SQL commands."
    );

    addFeatureCard(
      securityContainer,
      "Cross-site scripting",
      "Jinja autoescaping helps ensure user-supplied note content is rendered as text."
    );

    addFeatureCard(
      securityContainer,
      "CSRF protection",
      "Flask-WTF CSRF protection and POST-only state-changing actions help prevent forged requests."
    );

    addFeatureCard(
      securityContainer,
      "Password and session security",
      "Werkzeug password hashing and hardened session-cookie settings improve account security."
    );

    $("#modalNote").textContent =
      "These controls reduce specific risks; passing tests does not guarantee that every possible vulnerability has been eliminated.";
  }

  $("#modalTags").replaceChildren(
    ...project.tags.map(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    })
  );

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  $("[data-close]", modal)?.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocused?.focus?.();
}

$$("[data-project]").forEach(element => {
  element.addEventListener("click", event => {
    if (event.target.closest("button") || element.matches("button")) {
      openProject(element.dataset.project);
    } else if (element.classList.contains("project-card")) {
      openProject(element.dataset.project);
    }
  });
});

$$("[data-close]", modal).forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }

  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.matches(".project-card[role='button']")
  ) {
    event.preventDefault();
    openProject(event.target.dataset.project);
  }
});
// ==========================================
// ANIMATED PURPLE PARTICLE BACKGROUND
// ==========================================

(() => {
  if (document.getElementById("purple-particle-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "purple-particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const mouse = { x: -1000, y: -1000 };
  const particles = [];
  let width = 0;
  let height = 0;
  let animationId = null;

  const particleCount = Math.min(
    90,
    Math.max(35, Math.floor(window.innerWidth / 16))
  );

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.55 + 0.2,
      phase: Math.random() * Math.PI * 2
    };
  }

  function initializeParticles() {
    particles.length = 0;

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(particle, time) {
    const pulse = reduceMotion
      ? 1
      : 0.75 + Math.sin(time * 0.001 + particle.phase) * 0.25;

    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Gently repel nearby particles from the mouse.
    if (!reduceMotion && distance < 115 && distance > 0) {
      const force = (115 - distance) / 115;
      particle.x -= (dx / distance) * force * 0.8;
      particle.y -= (dy / distance) * force * 0.8;
    }

    ctx.beginPath();
    ctx.arc(
      particle.x,
      particle.y,
      particle.radius * pulse,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = `rgba(192, 132, 252, ${
      particle.opacity * pulse
    })`;

    ctx.shadowBlur = distance < 150 ? 16 : 8;
    ctx.shadowColor = "#a855f7";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 105) {
          const opacity = (1 - distance / 105) * 0.18;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate(time = 0) {
    ctx.clearRect(0, 0, width, height);

    if (!reduceMotion) {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }
      }
    }

    drawConnections();

    for (const particle of particles) {
      drawParticle(particle, time);
    }

    if (!reduceMotion) {
      animationId = requestAnimationFrame(animate);
    }
  }

  canvas.style.pointerEvents = "none";

  window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    initializeParticles();

    if (reduceMotion) {
      animate();
    }
  }, { passive: true });

  resizeCanvas();
  initializeParticles();
  animate();

  // Pause animation when the browser tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (!reduceMotion && animationId === null) {
      animationId = requestAnimationFrame(animate);
    }
  });
})();

// Subtle pointer tilt on project cards; disabled for touch and reduced motion.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
  $$(".project-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      if (event.target.closest("button")) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 2.8}deg) rotateX(${-y * 2.8}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// ==========================================
// HERO ROLE TYPING ANIMATION
// ==========================================

(() => {
  const roleElement = document.querySelector(".hero-role-text");

  if (!roleElement || roleElement.dataset.typingInitialized) return;

  roleElement.dataset.typingInitialized = "true";

  const roles = [
    "Cybersecurity Enthusiast",
    "Java Developer",
    "Ethical Hacking Learner",
    "Software Developer"
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    roleElement.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;

  // Begin by deleting the initial HTML text.
  function typeRole() {
    const currentRole = roles[roleIndex];

    if (deleting) {
      characterIndex--;
      roleElement.textContent = currentRole.slice(0, characterIndex);

      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 350);
        return;
      }

      setTimeout(typeRole, 45);
      return;
    }

    const nextRole = roles[roleIndex];
    characterIndex++;
    roleElement.textContent = nextRole.slice(0, characterIndex);

    if (characterIndex >= nextRole.length) {
      deleting = true;
      setTimeout(typeRole, 1600);
      return;
    }

    setTimeout(typeRole, 85);
  }

  // Pause while the browser tab is hidden.
  let timeoutId;

  function startTyping() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(typeRole, 1000);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      startTyping();
    }
  });

  startTyping();
})();


/* Copy email button fix */
(() => {
  const button = document.querySelector("[data-copy-email]");
  const status = document.querySelector(".copy-email-status");

  if (!button || button.dataset.copyFixAdded) return;
  button.dataset.copyFixAdded = "true";

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement("textarea");
        field.value = email;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();

        const success = document.execCommand("copy");
        field.remove();

        if (!success) throw new Error("Copy failed");
      }

      if (status) status.textContent = "Email copied successfully!";
      button.innerHTML = 'Copied! <span aria-hidden="true">✓</span>';
    } catch (error) {
      if (status) {
        status.textContent = "Copy failed. Email: " + email;
      }
    }

    setTimeout(() => {
      if (status) status.textContent = "";
      button.innerHTML =
        'Copy email <span aria-hidden="true">⧉</span>';
    }, 3000);
  });
})();
