// ===== Canvas d'arrière-plan animé =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(100, Math.floor(window.innerWidth / 14));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      color: Math.random() > 0.4 ? '53, 224, 124' : '183, 255, 217'
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, 0.6)`;
    ctx.fill();
  });

  // Lignes de connexion
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(53, 224, 124, ${0.12 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Lignes vers la souris
  if (mouse.x !== null) {
    particles.forEach((p) => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(183, 255, 217, ${0.2 * (1 - dist / 180)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });
  }

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
createParticles();
drawParticles();

// ===== Navigation au scroll =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ===== Menu hamburger =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});

// ===== Scroll fluide =====
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== Traduction / changement de langue =====
const FLAG_HTML = {
  fr: '🇫🇷',
  ru: '🇷🇺',
  ka: '🇬🇪',
  ce: '<svg class="flag-svg" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="0" width="5" height="20" fill="#FCD116"/><rect x="5" width="25" height="6.67" fill="#3A9D23"/><rect x="5" y="6.67" width="25" height="6.66" fill="#ffffff"/><rect x="5" y="13.33" width="25" height="6.67" fill="#CE2029"/></svg>'
};

let currentLang = localStorage.getItem('nexabuild-lang') || 'fr';

function applyTranslations(lang) {
  const dict = translations[lang] || translations.fr;
  currentLang = lang;
  localStorage.setItem('nexabuild-lang', lang);
  document.documentElement.lang = lang;

  // Textes simples
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Textes avec HTML (titres avec dégradé, boutons avec flèche)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Titre de la page
  if (dict['page.title']) {
    document.title = dict['page.title'];
  }

  // Drapeau affiché dans le bouton
  const flagEl = document.getElementById('lang-flag');
  if (flagEl) {
    flagEl.innerHTML = FLAG_HTML[lang] || FLAG_HTML.fr;
  }

  // Marquer la langue active dans le menu
  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// Sélecteur de langue
const langBtn = document.getElementById('lang-btn');
const langDropdown = document.getElementById('lang-dropdown');

langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  langDropdown.classList.toggle('open');
  document.getElementById('lang-selector').classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!document.getElementById('lang-selector').contains(e.target)) {
    langDropdown.classList.remove('open');
    document.getElementById('lang-selector').classList.remove('open');
  }
});

document.querySelectorAll('.lang-option').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    applyTranslations(lang);
    langDropdown.classList.remove('open');
  });
});

applyTranslations(currentLang);

// ===== Compteurs animés =====
function animateCounters() {
  const numbers = document.querySelectorAll('.stat-number');
  numbers.forEach((num) => {
    const target = parseInt(num.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      num.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  });
}

// ===== Animations au scroll (Intersection Observer) =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Appliquer la classe reveal aux éléments
function setupReveal() {
  document.querySelectorAll(
    '.service-card, .project-card, .about-visual, .about-content, .contact-info, .contact-form, .section-header'
  ).forEach((el) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });
}
setupReveal();

// ===== Animation des compteurs au scroll =====
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(heroStats);
}

// ===== Validation du formulaire de contact =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  // Validation nom
  if (!name.value.trim()) {
    name.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    name.closest('.form-group').classList.remove('error');
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    email.closest('.form-group').classList.remove('error');
  }

  // Validation message
  if (!message.value.trim()) {
    message.closest('.form-group').classList.add('error');
    isValid = false;
  } else {
    message.closest('.form-group').classList.remove('error');
  }

  if (!isValid) return;

  // Envoi simulé (remplacer par votre backend / Formspree / EmailJS)
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = translations[currentLang]['form.sending'] || 'Envoi en cours...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 5000);
  }, 1500);
});

// Supprimer l'erreur à la saisie
document.querySelectorAll('.form-group input, .form-group textarea').forEach((input) => {
  input.addEventListener('input', () => {
    input.closest('.form-group').classList.remove('error');
  });
});
