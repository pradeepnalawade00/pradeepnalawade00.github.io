/* ===================================================
   PRADEEP NALAWADE — PORTFOLIO JAVASCRIPT
   =================================================== */

"use strict";

// ===================================================
// NAVBAR — sticky scroll + active link + hamburger
// ===================================================
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
const allNavLinks = document.querySelectorAll(".nav-link");

// Sticky class on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  updateActiveLink();
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Close mobile nav on link click
navLinks.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }
});

// Active link based on scroll position
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
// SCROLL REVEAL ANIMATION
// ===================================================
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger items within same parent
        const siblings = entry.target.parentElement.querySelectorAll(".reveal:not(.visible)");
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ===================================================
// SKILL BARS ANIMATION
// ===================================================
const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute("data-width");
        setTimeout(() => {
          target.style.width = width + "%";
        }, 300);
        skillObserver.unobserve(target);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach((fill) => skillObserver.observe(fill));

// ===================================================
// SMOOTH SCROLL (for older browsers fallback)
// ===================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-h")) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===================================================
// TYPEWRITER EFFECT — Hero tagline
// ===================================================
const tagline = document.querySelector(".hero-tagline");
if (tagline) {
  const text    = tagline.textContent.trim();
  const delay   = 1200; // ms before starting

  tagline.textContent = "";
  tagline.style.opacity = "1";
  tagline.style.borderRight = "2px solid var(--accent-cyan)";
  tagline.style.display = "inline-block";
  tagline.style.whiteSpace = "normal";

  let i = 0;
  let started = false;

  function typeChar() {
    if (i < text.length) {
      tagline.textContent += text[i];
      i++;
      setTimeout(typeChar, 32);
    } else {
      // Remove cursor blink after done
      setTimeout(() => {
        tagline.style.borderRight = "2px solid transparent";
      }, 800);
    }
  }

  // Start only after element is visible
  const taglineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        setTimeout(typeChar, delay);
        taglineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  taglineObserver.observe(tagline);
}

// ===================================================
// CURSOR GLOW EFFECT (desktop only)
// ===================================================
if (window.matchMedia("(hover: hover)").matches) {
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  Object.assign(glow.style, {
    position: "fixed",
    top: "0", left: "0",
    width: "300px", height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,200,232,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: "0",
    transition: "opacity 0.3s",
    willChange: "transform",
  });
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX  = 0, glowY  = 0;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!raf) animateGlow();
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
// FLOATING ICONS PARALLAX  
// ===================================================
const floatIcons = document.querySelectorAll(".float-icon");

if (floatIcons.length && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", (e) => {
    const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    floatIcons.forEach((icon, idx) => {
      const depth = (idx % 3 + 1) * 8;
      icon.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
    });
  }, { passive: true });
}

// ===================================================
// PROJECT CARDS — tilt effect
// ===================================================
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect   = card.getBoundingClientRect();
    const xPct   = (e.clientX - rect.left) / rect.width  - 0.5;
    const yPct   = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `
      translateY(-8px)
      rotateX(${-yPct * 6}deg)
      rotateY(${xPct * 6}deg)
    `;
    card.style.transformStyle = "preserve-3d";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transformStyle = "";
  });
});

// ===================================================
// CONTACT CARDS — click to copy / navigate
// ===================================================
document.getElementById("contact-email")?.addEventListener("click", () => {
  window.location.href = "mailto:pradeepnalawade000@gmail.com";
});
document.getElementById("contact-phone")?.addEventListener("click", () => {
  window.location.href = "tel:+918088968407";
});
document.getElementById("contact-github")?.addEventListener("click", (e) => {
  if (!e.target.closest("a")) window.open("https://github.com/pradeepnalawade00", "_blank", "noopener");
});
document.getElementById("contact-linkedin")?.addEventListener("click", () => {
  window.open("https://linkedin.com/in/pradeep-nalawade-950244314", "_blank", "noopener");
});

// ===================================================
// SKILL CARDS — hover glow color
// ===================================================
const skillCards = document.querySelectorAll(".skill-card");
skillCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(6,200,232,0.15)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "";
  });
});

// ===================================================
// COUNTER ANIMATION — stat numbers
// ===================================================
function animateCounter(el, target, suffix = "", duration = 1200) {
  let start     = 0;
  const isFloat = target % 1 !== 0;
  const step    = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = isFloat
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll(".stat-num");
      nums.forEach((num) => {
        const text = num.textContent.trim();
        if (text.includes("%")) animateCounter(num, parseFloat(text), "%");
        else if (text.includes("+")) animateCounter(num, parseFloat(text), "+");
        else animateCounter(num, parseFloat(text));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".avatar-card").forEach((el) => statObserver.observe(el));

// ===================================================
// PAGE LOAD — fade in body
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  });
});

console.log(
  "%c 👋 Hey there! Built by Pradeep Nalawade — ECE Student | Embedded Systems & IoT | Data Science ",
  "background: linear-gradient(135deg, #06c8e8, #3b8bff); color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold;"
);

// ===================================================
// CERTIFICATE MANAGEMENT SYSTEM
// ===================================================
const CERTS_KEY = "pn_certificates";

function getCerts() {
  try { return JSON.parse(localStorage.getItem(CERTS_KEY) || "[]"); }
  catch { return []; }
}
function saveCerts(certs) {
  localStorage.setItem(CERTS_KEY, JSON.stringify(certs));
}
function formatCertDate(monthStr) {
  if (!monthStr) return "";
  const [y, m] = monthStr.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function renderCerts() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;
  const certs = getCerts();
  if (certs.length === 0) {
    grid.innerHTML = `
      <div class="cert-empty">
        <div class="cert-empty-icon">🏆</div>
        <p>No certificates added yet.<br>Click <strong>Add Certificate</strong> to showcase your achievements!</p>
      </div>`;
    return;
  }
  grid.innerHTML = certs.map((cert, i) => `
    <div class="cert-card reveal" data-index="${i}">
      <div class="cert-card-img" onclick="viewCert(${i})">
        ${cert.image
          ? `<img src="${cert.image}" alt="${cert.name}" />`
          : `<div class="cert-no-img">📜</div>`}
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
  // Re-observe new reveal elements
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
  else { img.style.display = "none"; }
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

// --- Modal Controls ---
const certModal      = document.getElementById("certModal");
const certViewModal  = document.getElementById("certViewModal");
const certClose      = document.getElementById("certClose");
const certViewClose  = document.getElementById("certViewClose");
const certCancelBtn  = document.getElementById("certCancelBtn");
const certSaveBtn    = document.getElementById("certSaveBtn");
const certBackdrop   = document.getElementById("certBackdrop");
const certViewBackdrop = document.getElementById("certViewBackdrop");
const certUploadZone = document.getElementById("certUploadZone");
const certFileInput  = document.getElementById("certFileInput");
const certPreview    = document.getElementById("certPreview");
const certPlaceholder= document.getElementById("certPlaceholder");
const addCertBtn     = document.getElementById("addCertBtn");

let certImageData = null;

function openAddModal() {
  certImageData = null;
  certPreview?.classList.add("cert-hidden");
  certPlaceholder?.classList.remove("cert-hidden");
  if (document.getElementById("certName"))   document.getElementById("certName").value   = "";
  if (document.getElementById("certIssuer")) document.getElementById("certIssuer").value = "";
  if (document.getElementById("certDate"))   document.getElementById("certDate").value   = "";
  if (certFileInput) certFileInput.value = "";
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

addCertBtn?.addEventListener("click", openAddModal);
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
  e.preventDefault();
  certUploadZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleCertFile(file);
});
certFileInput?.addEventListener("change", () => {
  if (certFileInput.files[0]) handleCertFile(certFileInput.files[0]);
});

function handleCertFile(file) {
  if (!file.type.startsWith("image/")) { alert("Please upload an image file (PNG, JPG, WEBP)."); return; }
  if (file.size > 5 * 1024 * 1024)   { alert("File must be under 5MB."); return; }
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
  ["certName", "certIssuer"].forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
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

// Keyboard close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeAddModal(); closeViewModal(); }
});

// Init
renderCerts();
