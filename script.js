/* ===================================================
   PRADEEP NALAWADE — PORTFOLIO JAVASCRIPT (3D Edition)
   =================================================== */

"use strict";

// ===================================================
// NAVBAR
// ===================================================
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
const allNavLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveLink();
}, { passive: true });

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }
});

const sections = document.querySelectorAll("section[id]");
function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach((section) => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute("id");
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        allNavLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    }
  });
}

// ===================================================
// SCROLL REVEAL
// ===================================================
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll(".reveal:not(.visible)");
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add("visible"), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
revealEls.forEach(el => revealObserver.observe(el));

// ===================================================
// SKILL BARS
// ===================================================
const skillFills = document.querySelectorAll(".skill-fill");
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const w = entry.target.getAttribute("data-width");
      setTimeout(() => { entry.target.style.width = w + "%"; }, 300);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObserver.observe(fill));

// ===================================================
// SMOOTH SCROLL
// ===================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===================================================
// TYPEWRITER — Hero tagline
// ===================================================
const tagline = document.querySelector(".hero-tagline");
if (tagline) {
  const text  = tagline.textContent.trim();
  tagline.textContent = "";
  tagline.style.opacity = "1";
  tagline.style.borderRight = "2px solid var(--accent-cyan)";
  tagline.style.display = "inline-block";
  let i = 0, started = false;
  function typeChar() {
    if (i < text.length) { tagline.textContent += text[i++]; setTimeout(typeChar, 32); }
    else { setTimeout(() => { tagline.style.borderRight = "2px solid transparent"; }, 800); }
  }
  const tObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) { started = true; setTimeout(typeChar, 1200); tObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  tObs.observe(tagline);
}

// ===================================================
// CURSOR GLOW
// ===================================================
if (window.matchMedia("(hover: hover)").matches) {
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  Object.assign(glow.style, {
    position: "fixed", top: "0", left: "0",
    width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,200,232,0.06) 0%, transparent 70%)",
    pointerEvents: "none", transform: "translate(-50%,-50%)",
    zIndex: "0", transition: "opacity 0.3s", willChange: "transform",
  });
  document.body.appendChild(glow);
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0, raf;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!raf) raf = requestAnimationFrame(animateGlow);
  }, { passive: true });
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
    raf = requestAnimationFrame(animateGlow);
  }
  document.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { glow.style.opacity = "1"; });
}

// ===================================================
// FLOATING ICONS PARALLAX (mouse)
// ===================================================
const floatIcons = document.querySelectorAll(".float-icon");
if (floatIcons.length && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", (e) => {
    const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    floatIcons.forEach((icon, idx) => {
      const depth = parseFloat(icon.style.getPropertyValue("--depth") || (idx % 3 + 1)) * 8;
      icon.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
    });
  }, { passive: true });
}

// ===================================================
// COUNTER ANIMATION
// ===================================================
function animateCounter(el, target, suffix = "", duration = 1200) {
  let start = 0;
  const isFloat = target % 1 !== 0;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-num").forEach((num) => {
        const text = num.textContent.trim();
        if (text.includes("%")) animateCounter(num, parseFloat(text), "%");
        else if (text.includes("+")) animateCounter(num, parseFloat(text), "+");
        else animateCounter(num, parseFloat(text));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".avatar-card").forEach(el => statObserver.observe(el));

// ===================================================
// SKILL / CONTACT CARDS
// ===================================================
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mouseenter", () => { card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(6,200,232,0.15)"; });
  card.addEventListener("mouseleave", () => { card.style.boxShadow = ""; });
});

document.getElementById("contact-email")?.addEventListener("click", () => { window.location.href = "mailto:pradeepnalawade000@gmail.com"; });
document.getElementById("contact-phone")?.addEventListener("click", () => { window.location.href = "tel:+918088968407"; });
document.getElementById("contact-github")?.addEventListener("click", (e) => { if (!e.target.closest("a")) window.open("https://github.com/pradeepnalawade00","_blank","noopener"); });
document.getElementById("contact-linkedin")?.addEventListener("click", () => { window.open("https://linkedin.com/in/pradeep-nalawade-950244314","_blank","noopener"); });

// ===================================================
// PAGE LOAD FADE
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = "1"; }));
});

console.log(
  "%c 👋 Hey there! Built by Pradeep Nalawade — ECE | Embedded Systems & IoT | Data Science ",
  "background:linear-gradient(135deg,#06c8e8,#3b8bff);color:white;padding:10px 20px;border-radius:8px;font-weight:bold;"
);

// ===================================================
// THREE.JS — Particle Field + Rotating Torus
// ===================================================
window.addEventListener("load", () => {
  if (window.innerWidth <= 768) return; // Skip on mobile
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // --- Particle Field ---
  const PARTICLE_COUNT = 1200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x06c8e8,
    size: 0.18,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // --- Wireframe Torus ---
  const tGeo = new THREE.TorusGeometry(10, 3.5, 20, 60);
  const tMat = new THREE.MeshBasicMaterial({
    color: 0x06c8e8,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const torus = new THREE.Mesh(tGeo, tMat);
  torus.position.set(18, 0, -10);
  scene.add(torus);

  // --- Second smaller torus ---
  const tGeo2 = new THREE.TorusGeometry(5, 1.5, 16, 40);
  const tMat2 = new THREE.MeshBasicMaterial({ color: 0x3b8bff, wireframe: true, transparent: true, opacity: 0.12 });
  const torus2 = new THREE.Mesh(tGeo2, tMat2);
  torus2.position.set(-20, 5, -15);
  scene.add(torus2);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Resize
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.004;

    particles.rotation.y = frame * 0.3 + mouseX * 0.15;
    particles.rotation.x = mouseY * 0.06;

    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.002;

    torus2.rotation.x -= 0.004;
    torus2.rotation.y += 0.006;

    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
});

// ===================================================
// VANILLA TILT — Skill & Project cards
// ===================================================
window.addEventListener("load", () => {
  if (typeof VanillaTilt === "undefined") return;
  VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    scale: 1.02,
    perspective: 800,
  });
});

// ===================================================
// GSAP SCROLL ANIMATIONS
// ===================================================
window.addEventListener("load", () => {
  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  // Hero name bounce-in
  gsap.from(".hero-name-3d .name-text", {
    duration: 1.2,
    y: 60,
    opacity: 0,
    ease: "elastic.out(1, 0.5)",
    delay: 0.3,
  });

  // Domain labels slide in
  gsap.utils.toArray(".domain-label").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      x: -40, opacity: 0, duration: 0.7, ease: "power3.out",
    });
  });

  // Skill cards stagger
  gsap.utils.toArray(".skill-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
      y: 50, opacity: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out",
    });
  });
});

// ===================================================
// PASSWORD-PROTECTED CERTIFICATE SYSTEM
// ===================================================
const CERTS_KEY    = "pn_certificates";
const CERT_PWD     = "pradeep2026";   // <-- Change this password!

function getCerts()     { try { return JSON.parse(localStorage.getItem(CERTS_KEY) || "[]"); } catch { return []; } }
function saveCerts(c)   { localStorage.setItem(CERTS_KEY, JSON.stringify(c)); }
function formatCertDate(ms) {
  if (!ms) return "";
  const [y, m] = ms.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function renderCerts() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;
  const certs = getCerts();
  if (certs.length === 0) {
    grid.innerHTML = `<div class="cert-empty"><div class="cert-empty-icon">🏆</div><p>No certificates added yet.<br>Click <strong>Add Certificate</strong> to showcase your achievements!</p></div>`;
    return;
  }
  grid.innerHTML = certs.map((cert, i) => `
    <div class="cert-card reveal" data-index="${i}">
      <div class="cert-card-img" onclick="viewCert(${i})">
        ${cert.image ? `<img src="${cert.image}" alt="${cert.name}" />` : `<div class="cert-no-img">📜</div>`}
        <div class="cert-card-overlay">View</div>
      </div>
      <div class="cert-card-body">
        <h4 class="cert-card-title">${cert.name}</h4>
        <div class="cert-card-meta">
          <span class="cert-issuer">${cert.issuer}</span>
          ${cert.date ? `<span class="cert-date">${formatCertDate(cert.date)}</span>` : ""}
        </div>
      </div>
      <button class="cert-delete" onclick="deleteCert(${i})" aria-label="Remove">✕</button>
    </div>
  `).join("");
  grid.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

window.viewCert = function(index) {
  const cert = getCerts()[index];
  if (!cert) return;
  const modal = document.getElementById("certViewModal");
  const img   = document.getElementById("certViewImg");
  document.getElementById("certViewName").textContent   = cert.name;
  document.getElementById("certViewIssuer").textContent = cert.issuer + (cert.date ? ` · ${formatCertDate(cert.date)}` : "");
  if (cert.image) { img.src = cert.image; img.style.display = "block"; }
  else             { img.style.display = "none"; }
  modal.classList.remove("cert-hidden");
  document.body.style.overflow = "hidden";
};

window.deleteCert = function(index) {
  if (!confirm("Remove this certificate?")) return;
  const certs = getCerts();
  certs.splice(index, 1);
  saveCerts(certs);
  renderCerts();
};

// --- DOM elements ---
const certModal       = document.getElementById("certModal");
const certPwdModal    = document.getElementById("certPwdModal");
const certViewModal   = document.getElementById("certViewModal");
const certClose       = document.getElementById("certClose");
const certViewClose   = document.getElementById("certViewClose");
const certCancelBtn   = document.getElementById("certCancelBtn");
const certSaveBtn     = document.getElementById("certSaveBtn");
const certBackdrop    = document.getElementById("certBackdrop");
const certViewBackdrop= document.getElementById("certViewBackdrop");
const certPwdBackdrop = document.getElementById("certPwdBackdrop");
const certPwdClose    = document.getElementById("certPwdClose");
const certPwdCancel   = document.getElementById("certPwdCancel");
const certPwdSubmit   = document.getElementById("certPwdSubmit");
const certPwdInput    = document.getElementById("certPwdInput");
const certPwdError    = document.getElementById("certPwdError");
const certUploadZone  = document.getElementById("certUploadZone");
const certFileInput   = document.getElementById("certFileInput");
const certPreview     = document.getElementById("certPreview");
const certPlaceholder = document.getElementById("certPlaceholder");
const addCertBtn      = document.getElementById("addCertBtn");

let certImageData = null;

function openPwdModal() {
  if (certPwdInput) certPwdInput.value = "";
  if (certPwdError) certPwdError.style.display = "none";
  certPwdModal?.classList.remove("cert-hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => certPwdInput?.focus(), 100);
}
function closePwdModal() {
  certPwdModal?.classList.add("cert-hidden");
  document.body.style.overflow = "";
}
function openAddModal() {
  certImageData = null;
  certPreview?.classList.add("cert-hidden");
  certPlaceholder?.classList.remove("cert-hidden");
  if (certFileInput) certFileInput.value = "";
  ["certName","certIssuer","certDate"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  certModal?.classList.remove("cert-hidden");
  document.body.style.overflow = "hidden";
}
function closeAddModal() {
  certModal?.classList.add("cert-hidden");
  document.body.style.overflow = "";
}
function closeViewModal() {
  certViewModal?.classList.add("cert-hidden");
  document.body.style.overflow = "";
}

// Add Certificate button → password gate first
addCertBtn?.addEventListener("click", openPwdModal);
certPwdClose?.addEventListener("click", closePwdModal);
certPwdCancel?.addEventListener("click", closePwdModal);
certPwdBackdrop?.addEventListener("click", closePwdModal);

function submitPassword() {
  const entered = certPwdInput?.value || "";
  if (entered === CERT_PWD) {
    closePwdModal();
    openAddModal();
  } else {
    if (certPwdError) certPwdError.style.display = "block";
    certPwdInput?.select();
  }
}
certPwdSubmit?.addEventListener("click", submitPassword);
certPwdInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") submitPassword(); });

certClose?.addEventListener("click", closeAddModal);
certCancelBtn?.addEventListener("click", closeAddModal);
certBackdrop?.addEventListener("click", closeAddModal);
certViewClose?.addEventListener("click", closeViewModal);
certViewBackdrop?.addEventListener("click", closeViewModal);

// File upload
certUploadZone?.addEventListener("click", () => certFileInput?.click());
certUploadZone?.addEventListener("dragover",  (e) => { e.preventDefault(); certUploadZone.classList.add("drag-over"); });
certUploadZone?.addEventListener("dragleave", ()  => certUploadZone.classList.remove("drag-over"));
certUploadZone?.addEventListener("drop", (e) => {
  e.preventDefault(); certUploadZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0]; if (file) handleCertFile(file);
});
certFileInput?.addEventListener("change", () => { if (certFileInput.files[0]) handleCertFile(certFileInput.files[0]); });

function handleCertFile(file) {
  if (!file.type.startsWith("image/")) { alert("Please upload an image file."); return; }
  if (file.size > 5 * 1024 * 1024)    { alert("File must be under 5MB."); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    certImageData = e.target.result;
    certPreview.src = certImageData;
    certPreview.classList.remove("cert-hidden");
    certPlaceholder.classList.add("cert-hidden");
  };
  reader.readAsDataURL(file);
}

certSaveBtn?.addEventListener("click", () => {
  const name   = document.getElementById("certName")?.value.trim()   || "";
  const issuer = document.getElementById("certIssuer")?.value.trim() || "";
  const date   = document.getElementById("certDate")?.value          || "";
  let hasError = false;
  ["certName","certIssuer"].forEach(id => {
    const el = document.getElementById(id);
    if (!el?.value.trim()) {
      el.classList.add("input-error");
      setTimeout(() => el.classList.remove("input-error"), 600);
      hasError = true;
    }
  });
  if (hasError) return;
  const certs = getCerts();
  certs.push({ name, issuer, date, image: certImageData });
  saveCerts(certs);
  renderCerts();
  closeAddModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closePwdModal(); closeAddModal(); closeViewModal();
});

// Init
renderCerts();
