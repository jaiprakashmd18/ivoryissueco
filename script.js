/* ═══════════════════════════════════════════════════════════════
   IVORY ISSUE CO — Main JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Preloader ─────────────────────────────────────────────── */
  function initPreloader() {
    const loader = document.getElementById('preloader');
    if (!loader) return;

    const done = () => {
      loader.classList.add('done');
      document.body.style.overflow = '';
      triggerHeroAnimations();
    };

    document.body.style.overflow = 'hidden';

    // Minimum 2s, then wait for window load
    let timerDone = false;
    let loadDone  = false;

    const check = () => { if (timerDone && loadDone) done(); };

    setTimeout(() => { timerDone = true; check(); }, 2000);

    if (document.readyState === 'complete') {
      loadDone = true;
      check();
    } else {
      window.addEventListener('load', () => { loadDone = true; check(); });
    }
  }

  /* ─── Hero Animations ───────────────────────────────────────── */
  function triggerHeroAnimations() {
    const els = document.querySelectorAll('.fade-up');
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  }

  /* ─── Sticky Navigation ─────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  /* ─── Active Nav Link on Scroll ─────────────────────────────── */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ─── Mobile Menu ────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle  = document.getElementById('navToggle');
    const menu    = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    if (!toggle || !menu || !overlay) return;

    const open = () => {
      menu.classList.add('open');
      overlay.classList.add('visible');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      menu.classList.remove('open');
      overlay.classList.remove('visible');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? close() : open();
    });

    overlay.addEventListener('click', close);

    // Close on nav link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  }

  /* ─── Smooth Scroll ──────────────────────────────────────────── */
  function initSmoothScroll() {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─── Scroll-triggered Reveal ────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach(el => observer.observe(el));
  }

  /* ─── FAQ Accordion ──────────────────────────────────────────── */
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector('.faq-q');
      const ans = item.querySelector('.faq-a');
      if (!btn || !ans) return;

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all others
        items.forEach(other => {
          const ob = other.querySelector('.faq-q');
          const oa = other.querySelector('.faq-a');
          if (ob && oa && ob !== btn) {
            ob.setAttribute('aria-expanded', 'false');
            oa.setAttribute('hidden', '');
          }
        });

        if (isOpen) {
          btn.setAttribute('aria-expanded', 'false');
          ans.setAttribute('hidden', '');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          ans.removeAttribute('hidden');
        }
      });
    });
  }

  /* ─── Copy UPI ID ────────────────────────────────────────────── */
  window.copyUPI = function () {
    const upiEl = document.getElementById('upiId');
    if (!upiEl) return;
    const text = upiEl.textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showCopyToast());
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); showCopyToast(); } catch (_) {}
      document.body.removeChild(textarea);
    }
  };

  function showCopyToast() {
    const existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = 'UPI ID copied!';
    Object.assign(toast.style, {
      position:   'fixed',
      bottom:     '2rem',
      left:       '50%',
      transform:  'translateX(-50%)',
      background: '#25D366',
      color:      '#fff',
      padding:    '0.6em 1.4em',
      borderRadius: '100px',
      fontSize:   '0.875rem',
      fontWeight: '600',
      zIndex:     '9999',
      pointerEvents: 'none',
      boxShadow:  '0 4px 16px rgba(37,211,102,0.35)',
      animation:  'none',
      transition: 'opacity 0.3s',
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
    setTimeout(() => toast.remove(), 2400);
  }

  /* ─── File Upload Preview ────────────────────────────────────── */
  function initFileUpload() {
    const drop    = document.getElementById('fileDrop');
    const input   = document.getElementById('payFile');
    const preview = document.getElementById('filePreview');
    if (!drop || !input || !preview) return;

    const showPreview = (file) => {
      if (!file) return;
      const ui = drop.querySelector('.file-drop-ui');

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.innerHTML = `<img src="${e.target.result}" alt="Payment screenshot preview">
            <span>${file.name}</span>`;
          preview.style.display = 'flex';
          if (ui) ui.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = `<span style="font-size:1.5rem">📄</span>
          <span>${file.name}</span>`;
        preview.style.display = 'flex';
        if (ui) ui.style.display = 'none';
      }
    };

    input.addEventListener('change', () => {
      if (input.files[0]) showPreview(input.files[0]);
    });

    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      drop.classList.add('drag-over');
    });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('drag-over');
      if (e.dataTransfer.files[0]) {
        input.files = e.dataTransfer.files;
        showPreview(e.dataTransfer.files[0]);
      }
    });
  }

  /* ─── Form Validation & Submission ──────────────────────────── */
  function initOrderForm() {
    const form    = document.getElementById('orderForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    const show = (id, msg) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = msg;
      el.classList.add('show');
    };
    const hide = (id) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('show'); }
    };
    const setError = (field) => field && field.classList.add('error');
    const clearError = (field) => field && field.classList.remove('error');

    const rules = [
      {
        field: form.querySelector('#fname'),
        err: 'fnameErr',
        test: (v) => v.trim().length >= 2,
        msg: 'Please enter your full name (at least 2 characters).'
      },
      {
        field: form.querySelector('#waNum'),
        err: 'waErr',
        test: (v) => /^[+\d\s()-]{7,15}$/.test(v.trim()),
        msg: 'Please enter a valid WhatsApp number.'
      },
      {
        field: form.querySelector('#emailAddr'),
        err: 'emailErr',
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Please enter a valid email address.'
      },
      {
        field: form.querySelector('#magType'),
        err: 'typeErr',
        test: (v) => v !== '',
        msg: 'Please select a magazine type.'
      },
      {
        field: null, /* size radio */
        err: 'sizeErr',
        test: () => !!form.querySelector('input[name="paperSize"]:checked'),
        msg: 'Please select a paper size (A4 or A5).'
      },
      {
        field: form.querySelector('#payFile'),
        err: 'fileErr',
        test: (_, el) => el && el.files && el.files.length > 0,
        msg: 'Please upload your payment screenshot.'
      }
    ];

    // Real-time clear on change
    rules.forEach(({ field, err }) => {
      if (!field) return;
      field.addEventListener('input', () => { clearError(field); hide(err); });
      field.addEventListener('change', () => { clearError(field); hide(err); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      rules.forEach(({ field, err, test, msg }) => {
        const value = field ? field.value : '';
        const ok    = test(value, field);
        hide(err);
        if (field) clearError(field);

        if (!ok) {
          show(err, msg);
          if (field) setError(field);
          valid = false;
        }
      });

      if (!valid) {
        // Scroll to first error
        const firstError = form.querySelector('.error, .form-err.show');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Success state
      const btn = form.querySelector('.btn-submit');
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    });
  }

  /* ─── Portfolio Card Stagger ─────────────────────────────────── */
  function initPortfolioStagger() {
    const cards = document.querySelectorAll('.port-card, .price-card, .review-card, .about-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      observer.observe(card);
    });
  }

  /* ─── Parallax on Hero ───────────────────────────────────────── */
  function initHeroParallax() {
    const hero  = document.querySelector('.hero');
    const glow  = document.querySelector('.hero-glow');
    if (!hero || !glow) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            glow.style.transform = `translateY(${y * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─── Number Counter on Stats ────────────────────────────────── */
  function initCounters() {
    const stats = document.querySelectorAll('.hero-stat strong');
    if (!stats.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el   = entry.target;
          const raw  = el.textContent;
          const num  = parseFloat(raw.replace(/[^0-9.]/g, ''));
          const suffix = raw.replace(/[0-9.]/g, '').trim();

          if (isNaN(num) || num === 0) return;

          let start = 0;
          const end = num;
          const dur = 1200;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const prog = Math.min((timestamp - start) / dur, 1);
            const ease = 1 - Math.pow(1 - prog, 3); // ease-out-cubic
            const cur  = Math.round(ease * end);
            el.textContent = cur + (suffix ? ' ' + suffix.trim() : '');
            if (prog < 1) requestAnimationFrame(step);
            else el.textContent = raw; // restore exact value
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 1 }
    );

    stats.forEach(s => observer.observe(s));
  }

  /* ─── Instagram Grid Hover Text ──────────────────────────────── */
  function initIGGrid() {
    // Add subtle tilt effect to IG cells
    const cells = document.querySelectorAll('.ig-cell');
    cells.forEach(cell => {
      cell.addEventListener('mousemove', (e) => {
        const rect = cell.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        cell.style.transform = `perspective(400px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
      });
      cell.addEventListener('mouseleave', () => {
        cell.style.transform = '';
        cell.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ─── Magazine Tilt on Hero ──────────────────────────────────── */
  function initMagTilt() {
    const wraps = document.querySelectorAll('.magazine-book');
    wraps.forEach(book => {
      book.addEventListener('mousemove', (e) => {
        const rect = book.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
        book.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.04)`;
        book.style.transition = 'transform 0.1s';
      });
      book.addEventListener('mouseleave', () => {
        book.style.transform = '';
        book.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ─── Back to Top on Logo Click ──────────────────────────────── */
  function initLogoScroll() {
    const brand = document.querySelector('.nav-brand');
    if (!brand) return;
    brand.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── Init All ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNav();
    initActiveLinks();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initFAQ();
    initFileUpload();
    initOrderForm();
    initPortfolioStagger();
    initHeroParallax();
    initCounters();
    initIGGrid();
    initMagTilt();
    initLogoScroll();
  });

})();
