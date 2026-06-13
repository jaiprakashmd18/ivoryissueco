/* ═══════════════════════════════════════════════════════════════
   IVORY ISSUE CO — Main JavaScript
   ─────────────────────────────────────────────────────────────
   TO CUSTOMISE: update the CONFIG values below with your real
   WhatsApp number, email, and UPI ID before going live.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Site Configuration ─────────────────────────────────────
     Replace these with your real details before deployment.
  ─────────────────────────────────────────────────────────────── */
  const CONFIG = {
    whatsapp: '919999999999',              // e.g. '919876543210'
    email:    'orders@ivoryissueco.com',   // FormSubmit recipient
    upiId:    'orders@ivoryissueco',       // shown on payment page
    instagram:'https://instagram.com/_ivoryissueco',
  };

  /* ─── Sync all WhatsApp links with CONFIG ───────────────────── */
  function syncWhatsAppLinks() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      const url   = new URL(a.href);
      const text  = url.searchParams.get('text') || '';
      a.href = `https://wa.me/${CONFIG.whatsapp}${text ? '?text=' + encodeURIComponent(decodeURIComponent(text)) : ''}`;
    });
  }

  /* ─── Preloader ─────────────────────────────────────────────── */
  function initPreloader() {
    const loader = document.getElementById('preloader');
    if (!loader) return;

    document.body.style.overflow = 'hidden';
    let timerDone = false;
    let loadDone  = false;

    const done = () => {
      loader.classList.add('done');
      document.body.style.overflow = '';
      triggerHeroAnimations();
    };
    const check = () => { if (timerDone && loadDone) done(); };

    setTimeout(() => { timerDone = true; check(); }, 2000);

    if (document.readyState === 'complete') { loadDone = true; check(); }
    else window.addEventListener('load', () => { loadDone = true; check(); });
  }

  /* ─── Hero Animations ───────────────────────────────────────── */
  function triggerHeroAnimations() {
    document.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  }

  /* ─── Sticky Navigation ─────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Active Nav Link on Scroll ─────────────────────────────── */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle(
            'active', l.getAttribute('href') === '#' + entry.target.id
          ));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }

  /* ─── Mobile Menu ────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle  = document.getElementById('navToggle');
    const menu    = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    if (!toggle || !menu) return;

    const open = () => {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () =>
      menu.classList.contains('open') ? close() : open()
    );
    if (overlay) overlay.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  }

  /* ─── Smooth Scroll ──────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 72;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      });
    });
  }

  /* ─── Scroll Reveal ──────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ─── Portfolio + Pricing Card Stagger ───────────────────────── */
  function initCardStagger() {
    const cards = document.querySelectorAll(
      '.port-card, .price-card, .review-card, .about-card, .hiw-step, .pay-method-card'
    );
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(28px)';
      card.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)';
      io.observe(card);
    });
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
    const text = CONFIG.upiId;
    const copy = () => showToast('✓  UPI ID copied!', '#25D366');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copy).catch(fallback);
    } else { fallback(); }

    function fallback() {
      const ta = Object.assign(document.createElement('textarea'), {
        value: text, style: 'position:fixed;opacity:0'
      });
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); copy(); } catch (_) {}
      document.body.removeChild(ta);
    }
  };

  function showToast(msg, bg = '#1C1917') {
    const old = document.querySelector('.ic-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'ic-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '2rem', left: '50%',
      transform: 'translateX(-50%) translateY(0)',
      background: bg, color: '#fff',
      padding: '0.65em 1.5em', borderRadius: '100px',
      fontSize: '0.875rem', fontWeight: '600',
      zIndex: '9999', pointerEvents: 'none',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      transition: 'opacity 0.35s, transform 0.35s',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(8px)';
      }, 2200);
      setTimeout(() => t.remove(), 2700);
    }));
  }

  /* ─── File Upload Preview ────────────────────────────────────── */
  function initFileUpload() {
    const drop    = document.getElementById('fileDrop');
    const input   = document.getElementById('payFile');
    const preview = document.getElementById('filePreview');
    if (!drop || !input || !preview) return;

    const show = file => {
      if (!file) return;
      const ui = drop.querySelector('.file-drop-ui');
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          preview.innerHTML = `<img src="${e.target.result}" alt="Payment screenshot">
            <span>${file.name}</span>`;
          preview.style.display = 'flex';
          if (ui) ui.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = `<span style="font-size:1.5rem">📄</span><span>${file.name}</span>`;
        preview.style.display = 'flex';
        if (ui) ui.style.display = 'none';
      }
    };

    input.addEventListener('change', () => { if (input.files[0]) show(input.files[0]); });

    drop.addEventListener('dragover',  e => { e.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drag-over');
      if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; show(e.dataTransfer.files[0]); }
    });
  }

  /* ─── Build WhatsApp Order Message ──────────────────────────── */
  function buildWhatsAppMessage(data) {
    const typeLabels = {
      birthday: 'Birthday Magazine',
      anniversary: 'Anniversary Magazine',
      'main-character': 'Main Character Magazine',
      farewell: 'Farewell Magazine',
      friendship: 'Friendship Magazine',
      custom: 'Custom Magazine',
    };
    return (
      `🎉 *New Order — Ivory Issue Co*\n\n` +
      `*Name:* ${data.name}\n` +
      `*WhatsApp:* ${data.whatsapp}\n` +
      `*Email:* ${data.email}\n` +
      `*Magazine Type:* ${typeLabels[data.type] || data.type}\n` +
      `*Paper Size:* ${data.size}\n` +
      `*Notes:* ${data.notes || 'None'}\n\n` +
      `💳 Payment screenshot will be sent separately in this chat.`
    );
  }

  /* ─── Form Validation & WhatsApp Submission ──────────────────── */
  function initOrderForm() {
    const form    = document.getElementById('orderForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    const waNum   = form.dataset.wa    || CONFIG.whatsapp;
    const email   = form.dataset.email || CONFIG.email;

    /* Update direct WhatsApp button href dynamically */
    const waDirectBtn = document.getElementById('waDirectBtn');
    if (waDirectBtn) {
      waDirectBtn.href = `https://wa.me/${waNum}?text=${encodeURIComponent("Hi Ivory Issue Co! I'd like to place a magazine order.")}`;
    }
    const waFallback = document.getElementById('waFallbackBtn');
    if (waFallback) waFallback.href = `https://wa.me/${waNum}`;

    /* Validation rules */
    const rules = [
      { id: 'fname',     errId: 'fnameErr', test: v => v.trim().length >= 2,
        msg: 'Please enter your full name.' },
      { id: 'waNum',     errId: 'waErr',    test: v => /^[+\d\s()\-]{7,16}$/.test(v.trim()),
        msg: 'Please enter a valid WhatsApp number.' },
      { id: 'emailAddr', errId: 'emailErr', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Please enter a valid email address.' },
      { id: 'magType',   errId: 'typeErr',  test: v => v !== '',
        msg: 'Please select a magazine type.' },
    ];

    const showErr = (id, msg) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.classList.add('show'); }
    };
    const hideErr = id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('show'); }
    };
    const setErr   = id => { const f = document.getElementById(id); if (f) f.classList.add('error'); };
    const clearErr = id => { const f = document.getElementById(id); if (f) f.classList.remove('error'); };

    /* Real-time clear */
    rules.forEach(({ id, errId }) => {
      const f = document.getElementById(id);
      if (f) f.addEventListener('input',  () => { hideErr(errId); clearErr(id); });
      if (f) f.addEventListener('change', () => { hideErr(errId); clearErr(id); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      rules.forEach(({ id, errId, test, msg }) => {
        const f = document.getElementById(id);
        const v = f ? f.value : '';
        hideErr(errId); clearErr(id);
        if (!test(v)) { showErr(errId, msg); setErr(id); valid = false; }
      });

      /* Check paper size */
      const sizeChecked = form.querySelector('input[name="paperSize"]:checked');
      hideErr('sizeErr');
      if (!sizeChecked) { showErr('sizeErr', 'Please select A4 or A5.'); valid = false; }

      if (!valid) {
        const first = form.querySelector('.error, .form-err.show');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      /* Build order data */
      const orderData = {
        name:     document.getElementById('fname').value.trim(),
        whatsapp: document.getElementById('waNum').value.trim(),
        email:    document.getElementById('emailAddr').value.trim(),
        type:     document.getElementById('magType').value,
        size:     sizeChecked.value,
        notes:    document.getElementById('notes').value.trim(),
      };

      /* Loading state */
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Opening WhatsApp…'; }

      /* 1. Open WhatsApp with pre-filled message */
      const waMsg = buildWhatsAppMessage(orderData);
      const waURL = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
      const waWin = window.open(waURL, '_blank');

      /* 2. Try FormSubmit.co email (fire and forget) */
      if (email) {
        const fd = new FormData(form);
        fd.append('_subject', `New Magazine Order from ${orderData.name}`);
        fd.append('_template', 'box');
        fd.append('_captcha', 'false');
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST', body: fd,
        }).catch(() => { /* silent — WA is the primary channel */ });
      }

      /* 3. Success state */
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        /* Update fallback button */
        const fb = document.getElementById('waFallbackBtn');
        if (fb) fb.href = waURL;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    });
  }

  /* ─── Hero Parallax ──────────────────────────────────────────── */
  function initHeroParallax() {
    const glow = document.querySelector('.hero-glow');
    if (!glow) return;
    let tick = false;
    window.addEventListener('scroll', () => {
      if (!tick) {
        requestAnimationFrame(() => {
          if (window.scrollY < window.innerHeight)
            glow.style.transform = `translateY(${window.scrollY * 0.14}px)`;
          tick = false;
        });
        tick = true;
      }
    }, { passive: true });
  }

  /* ─── Magazine 3D Tilt ───────────────────────────────────────── */
  function initMagTilt() {
    document.querySelectorAll('.magazine-book').forEach(book => {
      book.addEventListener('mousemove', e => {
        const r = book.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
        book.style.transition = 'transform 0.08s';
        book.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.04)`;
      });
      book.addEventListener('mouseleave', () => {
        book.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        book.style.transform = '';
      });
    });
  }

  /* ─── Instagram cell hover tilt ──────────────────────────────── */
  function initIGTilt() {
    document.querySelectorAll('.ig-cell').forEach(cell => {
      cell.addEventListener('mousemove', e => {
        const r = cell.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
        cell.style.transform = `perspective(400px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
      });
      cell.addEventListener('mouseleave', () => {
        cell.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
        cell.style.transform = '';
      });
    });
  }

  /* ─── Animate counters in hero stats ────────────────────────── */
  function initCounters() {
    const stats = document.querySelectorAll('.hero-stat strong');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const raw = el.textContent;
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (isNaN(num) || num === 0) return;
        let start = 0;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1200, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * num) + raw.replace(/[0-9.]/g, '').trim();
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = raw;
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 1 });
    stats.forEach(s => io.observe(s));
  }

  /* ─── Logo click = scroll top ────────────────────────────────── */
  function initLogoScroll() {
    const brand = document.querySelector('.nav-brand');
    if (brand) brand.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ─── Init All ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    syncWhatsAppLinks();
    initPreloader();
    initNav();
    initActiveLinks();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCardStagger();
    initFAQ();
    window.copyUPI = window.copyUPI; /* expose globally */
    initFileUpload();
    initOrderForm();
    initHeroParallax();
    initMagTilt();
    initIGTilt();
    initCounters();
    initLogoScroll();
  });

})();
