/* ============================================================
   ÉLITE TRANSFER — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Hamburger menu ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });

  /* ─── Reveal on scroll ───────────────────────────────────── */
  const reveals = document.querySelectorAll(
    '.service-card, .why-feature, .fleet-panel, .testimonial-card, .contact-method, .why-card'
  );
  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObserver.observe(el));

  /* ─── Counter animation ──────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const step   = Math.max(1, Math.floor(target / 60));
      let current  = 0;
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString('es');
        if (current >= target) clearInterval(timer);
      }, 25);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ─── Fleet tabs ─────────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.fleet-tab');
  const panels = document.querySelectorAll('.fleet-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  /* ─── Testimonials slider ────────────────────────────────── */
  const track    = document.getElementById('testimonials-track');
  const cards    = track.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testi-dots');
  let   current  = 0;
  let   perPage  = window.innerWidth < 640 ? 1 : 3;

  // Build dots
  const totalSlides = () => Math.ceil(cards.length / perPage);
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('div');
      d.className = 'testi-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  };

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, totalSlides() - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * perPage * cardWidth}px)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  document.getElementById('testi-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('testi-next').addEventListener('click', () => goTo(current + 1));

  buildDots();
  window.addEventListener('resize', () => {
    perPage = window.innerWidth < 640 ? 1 : 3;
    current = 0;
    buildDots();
    goTo(0);
  });

  // Auto-advance
  setInterval(() => {
    goTo(current + 1 >= totalSlides() ? 0 : current + 1);
  }, 5000);

  /* ─── Contact form ───────────────────────────────────────── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Enviando...';

    setTimeout(() => {
      success.style.display = 'flex';
      form.reset();
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Solicitar Reserva';
      setTimeout(() => { success.style.display = 'none'; }, 6000);
    }, 1200);
  });

  /* ─── Smooth scroll for all anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
