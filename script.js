/* ═══════════════════════════════════════════════════════════════
   IVORY ISSUE CO — script.js
   ─────────────────────────────────────────────────────────────
   UPDATE CONFIG below with your real details before going live.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     SITE CONFIG — change these values once, they update everywhere
  ══════════════════════════════════════════════════════════════ */
  const CONFIG = {
    whatsapp:  '919999999999',             // e.g. '919876543210'
    email:     'orders@ivoryissueco.com',  // receives form emails
    upiId:     'orders@ivoryissueco',      // shown & copied on payment page
    instagram: 'https://instagram.com/_ivoryissueco',
  };

  /* Price matrix — matches select option values */
  const PRICES = {
    birthday:        { A5: 399,  A4: 699 },
    anniversary:     { A5: 499,  A4: 799 },
    'main-character':{ A5: 399,  A4: 699 },
    farewell:        { A5: 449,  A4: 749 },
    friendship:      { A5: 399,  A4: 699 },
    custom:          { A5: 499,  A4: 499 },
  };

  const TYPE_LABELS = {
    birthday:         'Birthday Magazine',
    anniversary:      'Anniversary Magazine',
    'main-character': 'Main Character Magazine',
    farewell:         'Farewell Magazine',
    friendship:       'Friendship Magazine',
    custom:           'Custom Magazine',
  };

  /* ══════════════════════════════════════════════════════════════
     UTILITY
  ══════════════════════════════════════════════════════════════ */
  const $  = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  function showToast(msg, bg = '#1C1917') {
    $$('.ic-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'ic-toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position:'fixed', bottom:'2rem', left:'50%',
      transform:'translateX(-50%)', background: bg,
      color:'#fff', padding:'0.65em 1.5em', borderRadius:'100px',
      fontSize:'0.875rem', fontWeight:'600', zIndex:'9999',
      pointerEvents:'none', boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
      transition:'opacity 0.35s, transform 0.35s',
      whiteSpace:'nowrap',
    });
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2200);
    setTimeout(() => t.remove(), 2700);
  }

  function buildWAUrl(text) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  /* ══════════════════════════════════════════════════════════════
     PRELOADER
  ══════════════════════════════════════════════════════════════ */
  function initPreloader() {
    const loader = $('preloader');
    if (!loader) return;
    document.body.style.overflow = 'hidden';
    let timerDone = false, loadDone = false;
    const done  = () => { loader.classList.add('done'); document.body.style.overflow = ''; triggerHeroAnim(); };
    const check = () => { if (timerDone && loadDone) done(); };
    setTimeout(() => { timerDone = true; check(); }, 2000);
    if (document.readyState === 'complete') { loadDone = true; check(); }
    else window.addEventListener('load', () => { loadDone = true; check(); });
  }

  function triggerHeroAnim() {
    $$('.fade-up').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 100));
  }

  /* ══════════════════════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initActiveLinks() {
    const sections = $$('section[id]');
    const links    = $$('.nav-link');
    if (!sections.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  function initMobileMenu() {
    const toggle  = $('navToggle');
    const menu    = $('navMenu');
    const overlay = $('navOverlay');
    if (!toggle || !menu) return;
    const open  = () => { menu.classList.add('open'); overlay && overlay.classList.add('visible'); toggle.classList.add('open'); toggle.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
    const close = () => { menu.classList.remove('open'); overlay && overlay.classList.remove('visible'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
    toggle.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
    overlay && overlay.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) close(); });
  }

  /* ══════════════════════════════════════════════════════════════
     SMOOTH SCROLL + FORM PRE-FILL
     Any link with data-fill-type will:
       1. Smooth-scroll to #order
       2. Pre-select the magazine type
       3. Trigger the price preview
  ══════════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').split('?')[0];
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });

      /* Pre-fill form if data-fill-type is present */
      const fillType = a.dataset.fillType;
      if (fillType) {
        /* Wait for scroll to settle then fill */
        setTimeout(() => prefillForm(fillType), 600);
      }
    });
  }

  function prefillForm(type) {
    const sel = $('magType');
    if (!sel) return;
    sel.value = type;
    sel.classList.add('prefilled');
    setTimeout(() => sel.classList.remove('prefilled'), 1200);
    /* Fire change event so price preview updates */
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    /* Briefly highlight the field */
    sel.focus();
  }

  /* ══════════════════════════════════════════════════════════════
     WHATSAPP MINI BUTTONS (pricing cards)
  ══════════════════════════════════════════════════════════════ */
  function initWAMiniButtons() {
    $$('[data-wa-type]').forEach(btn => {
      /* Build URL dynamically so CONFIG.whatsapp is always used */
      btn.addEventListener('click', e => {
        e.preventDefault();
        const type  = btn.dataset.waType;
        const label = btn.dataset.waLabel || TYPE_LABELS[type] || type;
        const msg   = `Hi Ivory Issue Co! 👋\n\nI'd like to order a *${label}*.\nPlease help me get started!\n\n— Sent from your website`;
        window.open(buildWAUrl(msg), '_blank', 'noopener,noreferrer');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════════════════════════ */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => io.observe(el));
  }

  function initCardStagger() {
    $$('.port-card,.price-card,.review-card,.about-card,.hiw-step,.pay-method-card').forEach(card => {
      card.style.cssText += 'opacity:0;transform:translateY(28px);transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)';
      new IntersectionObserver(([e], obs) => {
        if (e.isIntersecting) { card.style.opacity='1'; card.style.transform='translateY(0)'; obs.disconnect(); }
      }, { threshold: 0.07 }).observe(card);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     DYNAMIC PRICE PREVIEW IN ORDER FORM
  ══════════════════════════════════════════════════════════════ */
  function initPricePreview() {
    const typeSelect  = $('magType');
    const sizeRadios  = $$('input[name="paperSize"]');
    const preview     = $('pricePreview');
    const ppPrice     = $('ppPrice');
    const ppType      = $('ppType');
    if (!typeSelect || !preview) return;

    function update() {
      const type    = typeSelect.value;
      const sizeEl  = document.querySelector('input[name="paperSize"]:checked');
      const size    = sizeEl ? sizeEl.value : null;

      if (!type || !size) { preview.style.display = 'none'; return; }

      const priceData = PRICES[type];
      if (!priceData) { preview.style.display = 'none'; return; }

      const price = priceData[size];
      ppPrice.textContent = `₹${price}`;
      ppType.textContent  = `${TYPE_LABELS[type]} · ${size} Size`;
      preview.style.display = 'block';
    }

    typeSelect.addEventListener('change', update);
    sizeRadios.forEach(r => r.addEventListener('change', update));
  }

  /* ══════════════════════════════════════════════════════════════
     FAQ ACCORDION
  ══════════════════════════════════════════════════════════════ */
  function initFAQ() {
    $$('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-q');
      const ans = item.querySelector('.faq-a');
      if (!btn || !ans) return;
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        $$('.faq-item').forEach(o => {
          const ob = o.querySelector('.faq-q'), oa = o.querySelector('.faq-a');
          if (ob && oa && ob !== btn) { ob.setAttribute('aria-expanded','false'); oa.setAttribute('hidden',''); }
        });
        if (open) { btn.setAttribute('aria-expanded','false'); ans.setAttribute('hidden',''); }
        else       { btn.setAttribute('aria-expanded','true');  ans.removeAttribute('hidden'); }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     COPY UPI ID
  ══════════════════════════════════════════════════════════════ */
  window.copyUPI = function () {
    const copy = () => showToast('✓  UPI ID copied!', '#25D366');
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(CONFIG.upiId).then(copy).catch(fallback);
    else fallback();
    function fallback() {
      const ta = Object.assign(document.createElement('textarea'), { value: CONFIG.upiId, style: 'position:fixed;opacity:0' });
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); copy(); } catch(_) {}
      document.body.removeChild(ta);
    }
  };

  /* ══════════════════════════════════════════════════════════════
     FILE UPLOAD PREVIEW
  ══════════════════════════════════════════════════════════════ */
  function initFileUpload() {
    const drop    = $('fileDrop');
    const input   = $('payFile');
    const preview = $('filePreview');
    if (!drop || !input || !preview) return;
    const show = file => {
      if (!file) return;
      const ui = drop.querySelector('.file-drop-ui');
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => {
          preview.innerHTML = `<img src="${ev.target.result}" alt="Screenshot"><span>${file.name}</span>`;
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
    drop.addEventListener('dragover',  ev => { ev.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', ()  => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', ev => {
      ev.preventDefault(); drop.classList.remove('drag-over');
      if (ev.dataTransfer.files[0]) { input.files = ev.dataTransfer.files; show(ev.dataTransfer.files[0]); }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     ORDER FORM — VALIDATION + WHATSAPP SUBMISSION
  ══════════════════════════════════════════════════════════════ */
  function initOrderForm() {
    const form    = $('orderForm');
    const success = $('formSuccess');
    if (!form || !success) return;

    const waNum = form.dataset.wa    || CONFIG.whatsapp;
    const email = form.dataset.email || CONFIG.email;

    /* Wire direct WA button */
    const waBtn = $('waDirectBtn');
    if (waBtn) waBtn.href = buildWAUrl("Hi Ivory Issue Co! 👋 I'd like to place a magazine order. Please help me get started!");
    const waFallback = $('waFallbackBtn');
    if (waFallback) waFallback.href = `https://wa.me/${waNum}`;

    /* ── Validation rules ── */
    const rules = [
      { id:'fname',     errId:'fnameErr',  test: v => v.trim().length >= 2,
        msg:'Please enter your full name.' },
      { id:'waNum',     errId:'waErr',     test: v => /^[+\d\s()\-]{7,16}$/.test(v.trim()),
        msg:'Please enter a valid WhatsApp number.' },
      { id:'emailAddr', errId:'emailErr',  test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg:'Please enter a valid email address.' },
      { id:'magType',   errId:'typeErr',   test: v => v !== '',
        msg:'Please select a magazine type.' },
    ];

    const showE  = (id,m) => { const el=$(id); if(el){el.textContent=m; el.classList.add('show');} };
    const hideE  = id     => { const el=$(id); if(el){el.textContent=''; el.classList.remove('show');} };
    const setE   = id     => { const f=$(id); if(f) f.classList.add('error'); };
    const clearE = id     => { const f=$(id); if(f) f.classList.remove('error'); };

    rules.forEach(({id,errId}) => {
      const f = $(id);
      if (f) {
        f.addEventListener('input',  () => { hideE(errId); clearE(id); });
        f.addEventListener('change', () => { hideE(errId); clearE(id); });
      }
    });

    form.addEventListener('submit', ev => {
      ev.preventDefault();
      let valid = true;

      rules.forEach(({id,errId,test,msg}) => {
        const f = $(id); hideE(errId); clearE(id);
        if (!test(f ? f.value : '')) { showE(errId,msg); setE(id); valid = false; }
      });

      const sizeEl = form.querySelector('input[name="paperSize"]:checked');
      hideE('sizeErr');
      if (!sizeEl) { showE('sizeErr','Please select A4 or A5.'); valid = false; }

      if (!valid) {
        const first = form.querySelector('.error, .form-err.show');
        if (first) first.scrollIntoView({ behavior:'smooth', block:'center' });
        return;
      }

      const order = {
        name:     $('fname').value.trim(),
        whatsapp: $('waNum').value.trim(),
        email:    $('emailAddr').value.trim(),
        type:     $('magType').value,
        size:     sizeEl.value,
        notes:    $('notes').value.trim(),
      };

      const price = PRICES[order.type] ? `₹${PRICES[order.type][order.size]}` : 'TBD';

      const btn = form.querySelector('.btn-submit');
      if (btn) { btn.disabled = true; btn.innerHTML = 'Opening WhatsApp… <span class="btn-arrow">→</span>'; }

      /* Build WhatsApp message */
      const msg =
        `🎉 *New Order — Ivory Issue Co*\n\n` +
        `*Name:* ${order.name}\n` +
        `*WhatsApp:* ${order.whatsapp}\n` +
        `*Email:* ${order.email}\n` +
        `*Magazine:* ${TYPE_LABELS[order.type] || order.type}\n` +
        `*Size:* ${order.size}\n` +
        `*Price:* ${price}\n` +
        `*Notes:* ${order.notes || 'None'}\n\n` +
        `💳 I have made the payment. Screenshot to follow in this chat.`;

      const waURL = buildWAUrl(msg);

      /* Open WhatsApp */
      window.open(waURL, '_blank', 'noopener,noreferrer');

      /* Email backup (fire-and-forget) */
      if (email) {
        const fd = new FormData(form);
        fd.append('_subject',  `New Order from ${order.name} — ${TYPE_LABELS[order.type]}`);
        fd.append('_template', 'box');
        fd.append('_captcha',  'false');
        fetch(`https://formsubmit.co/ajax/${email}`, { method:'POST', body:fd }).catch(()=>{});
      }

      /* Show success */
      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        const fb = $('waFallbackBtn');
        if (fb) fb.href = waURL;
        success.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 500);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SCROLL TO TOP
  ══════════════════════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = $('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () =>
      btn.classList.toggle('visible', window.scrollY > 600), { passive: true }
    );
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ══════════════════════════════════════════════════════════════
     HERO PARALLAX + MAGAZINE TILT
  ══════════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const glow = document.querySelector('.hero-glow');
    if (!glow) return;
    let tick = false;
    window.addEventListener('scroll', () => {
      if (!tick) { requestAnimationFrame(() => { if (window.scrollY < window.innerHeight) glow.style.transform=`translateY(${window.scrollY*.14}px)`; tick=false; }); tick=true; }
    }, { passive:true });
  }

  function initMagTilt() {
    $$('.magazine-book').forEach(book => {
      book.addEventListener('mousemove', e => {
        const r = book.getBoundingClientRect();
        const x = ((e.clientX-r.left)/r.width -.5)*14;
        const y = ((e.clientY-r.top) /r.height-.5)*14;
        book.style.cssText += `;transition:transform .08s;transform:perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.04)`;
      });
      book.addEventListener('mouseleave', () => {
        book.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        book.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     INSTAGRAM TILT
  ══════════════════════════════════════════════════════════════ */
  function initIGTilt() {
    $$('.ig-cell').forEach(cell => {
      cell.addEventListener('mousemove', e => {
        const r = cell.getBoundingClientRect();
        const x = ((e.clientX-r.left)/r.width -.5)*8;
        const y = ((e.clientY-r.top) /r.height-.5)*8;
        cell.style.transform = `perspective(400px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
      });
      cell.addEventListener('mouseleave', () => {
        cell.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1)';
        cell.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     HERO STAT COUNTERS
  ══════════════════════════════════════════════════════════════ */
  function initCounters() {
    $$('.hero-stat strong').forEach(el => {
      const raw = el.textContent;
      const num = parseFloat(raw.replace(/[^0-9.]/g,''));
      if (isNaN(num) || num === 0) return;
      new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        let start = 0;
        const step = ts => {
          if (!start) start=ts;
          const p = Math.min((ts-start)/1200,1), ease=1-Math.pow(1-p,3);
          el.textContent = Math.round(ease*num) + raw.replace(/[0-9.]/g,'').trim();
          if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }, {threshold:1}).observe(el);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SYNC ALL WA LINKS TO CONFIG
  ══════════════════════════════════════════════════════════════ */
  function syncWALinks() {
    $$('a[href*="wa.me"]').forEach(a => {
      try {
        const u   = new URL(a.href);
        const txt = u.searchParams.get('text');
        a.href = txt
          ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(decodeURIComponent(txt))}`
          : `https://wa.me/${CONFIG.whatsapp}`;
      } catch(_) {}
    });
  }

  /* ══════════════════════════════════════════════════════════════
     INIT ALL
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    syncWALinks();
    initPreloader();
    initNav();
    initActiveLinks();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCardStagger();
    initFAQ();
    initPricePreview();
    initWAMiniButtons();
    initFileUpload();
    initOrderForm();
    initScrollTop();
    initHeroParallax();
    initMagTilt();
    initIGTilt();
    initCounters();

    /* Logo click → top */
    const brand = document.querySelector('.nav-brand');
    if (brand) brand.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  });

})();
