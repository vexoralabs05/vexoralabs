/* ==========================================================================
   Vexora Labs — shared behaviour for every page.
   Depends on: assets/js/data.js (VEXORA_DATA). Works without any CDN script.
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.VEXORA_DATA || { business: { whatsappNumber: '94727397294' }, softwares: [], vpnPlans: [], vpnConfigs: [] };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return Number(n || 0).toLocaleString('en-US'); }
  function whatsappUrl(text) {
    var base = 'https://wa.me/' + DATA.business.whatsappNumber;
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }
  function openWhatsApp(text) {
    var win = window.open(whatsappUrl(text), '_blank');
    if (win) { win.opener = null; }
    else { window.location.href = whatsappUrl(text); } // fallback only when the popup is blocked
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(message, type) {
    var el = $('#vx-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vx-toast';
      el.className = 'vx-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.dataset.type = type || 'success';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------- scroll reveal (replaces the AOS library) ---------- */
  var revealObserver = null;
  function observeReveal(root) {
    var targets = $$('[data-aos]', root).concat($$('.stagger-cards', root));
    if (!targets.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (el) { el.classList.add('aos-animate', 'revealed'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
          setTimeout(function () { el.classList.add('aos-animate', 'revealed'); }, delay);
          revealObserver.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    targets.forEach(function (el) {
      if (!el.classList.contains('aos-animate') && !el.classList.contains('revealed')) revealObserver.observe(el);
    });
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    var btn = $('#mobile-menu-btn');
    var menu = $('#mobile-menu');
    var icon = $('#menu-icon');
    if (!btn || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (icon) icon.className = (open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars') + ' text-xl';
    }
    btn.setAttribute('aria-controls', 'mobile-menu');
    setOpen(false);
    btn.addEventListener('click', function () { setOpen(menu.classList.contains('hidden')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) setOpen(false); });
  }

  /* ---------- highlight the current page in the navigation ---------- */
  function initActiveNav() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === '') page = 'index.html';
    $$('header a[href$=".html"]').forEach(function (a) {
      var target = a.getAttribute('href').split('#')[0].toLowerCase();
      if (target === page && !a.hasAttribute('data-keep-style')) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('is-current');
      }
    });
  }

  /* ---------- animated counters ---------- */
  function initCounters() {
    var counters = $$('[data-counter]');
    if (!counters.length) return;

    function format(el, value) {
      el.textContent = Math.round(value).toLocaleString('en-US') + (el.getAttribute('data-suffix') || '');
    }
    function run(el) {
      var end = parseFloat(el.getAttribute('data-counter')) || 0;
      if (reduceMotion) { format(el, end); return; }
      var start = null, duration = 1600;
      function tick(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        format(el, end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if (!('IntersectionObserver' in window)) { counters.forEach(function (el) { format(el, parseFloat(el.getAttribute('data-counter'))); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero particles ---------- */
  function initParticles() {
    var host = $('#hero-particles');
    if (!host || reduceMotion) return;
    var count = window.innerWidth < 640 ? 14 : 28;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'particle';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = 9 + Math.random() * 14 + 's';
      s.style.animationDelay = -Math.random() * 20 + 's';
      var size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size + 'px';
      host.appendChild(s);
    }
  }

  /* ---------- back to top ---------- */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    document.body.appendChild(btn);
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { btn.classList.toggle('show', window.scrollY > 600); ticking = false; });
    }, { passive: true });
  }

  /* ---------- footer year ---------- */
  function initYear() {
    var y = new Date().getFullYear();
    $$('#footer-year, #footerYear, [data-year]').forEach(function (el) { el.textContent = y; });
  }

  /* ---------- public functions used by inline onclick="" handlers ---------- */
  window.orderSoftwareViaWhatsApp = function (id) {
    var sw = (DATA.softwares || []).filter(function (s) { return s.id === id; })[0];
    var lines = ['Hello Vexora Labs! 👋', '', "I'd like to order:", '📦 *' + (sw ? sw.name : 'Software') + '*'];
    if (sw) lines.push('💰 Price: LKR ' + money(sw.price));
    lines.push('', 'Please share payment & delivery details. Thank you!');
    openWhatsApp(lines.join('\n'));
  };

  window.toggleFaq = function (btn) {
    var item = btn.closest('.faq-item');
    if (!item) return;
    var wasActive = item.classList.contains('active');
    $$('.faq-item.active').forEach(function (el) {
      el.classList.remove('active');
      var b = $('.faq-toggle', el);
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) { item.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
  };

  window.copyToClipboard = function (text, message) {
    function done() { toast(message || 'Copied to clipboard'); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) done(); else toast('Could not copy. Please copy it manually.', 'error');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  };

  window.Vexora = {
    data: DATA, esc: esc, money: money, whatsappUrl: whatsappUrl, openWhatsApp: openWhatsApp,
    toast: toast, reveal: observeReveal, $: $, $$: $$, reduceMotion: reduceMotion
  };

  /* ---------- boot ---------- */
  function boot() {
    initMenu();
    initActiveNav();
    initYear();
    initCounters();
    initParticles();
    initBackToTop();
    observeReveal(document);
    document.dispatchEvent(new CustomEvent('vexora:ready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
