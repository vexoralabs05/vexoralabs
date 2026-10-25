/* VPN page: config grid, carrier filter, search, order modal, rate sheet */
(function () {
  'use strict';
  var V = window.Vexora;
  if (!V) { console.error('Vexora shared script did not load. Check assets/js/main.js.'); return; }
  var D = V.data || {};
  D.vpnConfigs = Array.isArray(D.vpnConfigs) ? D.vpnConfigs : [];
  D.vpnPlans = Array.isArray(D.vpnPlans) ? D.vpnPlans : [];
  var state = { carrier: 'all', query: '', selectedId: null };

  var CARRIER_STYLE = {
    Dialog:  'bg-red-500/10 text-red-400 border-red-500/20',
    Airtel:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Hutch:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Mobitel: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    SLT:     'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  var grid = V.$('#vpn-grid'), empty = V.$('#no-results'), modal = V.$('#vpn-order-modal');
  var lastFocus = null;

  function filtered() {
    var q = state.query.toLowerCase().trim();
    return D.vpnConfigs.filter(function (c) {
      var okCarrier = state.carrier === 'all' || c.network === state.carrier;
      var okQuery = !q || [c.name, c.network, c.speed, c.ipType].join(' ').toLowerCase().indexOf(q) !== -1;
      return okCarrier && okQuery;
    });
  }

  function renderCards() {
    var list = filtered();
    var count = V.$('#vpn-count');
    if (count) count.textContent = list.length + (list.length === 1 ? ' config' : ' configs');
    if (!grid) return;
    if (!list.length) { grid.innerHTML = ''; if (empty) empty.classList.remove('hidden'); return; }
    if (empty) empty.classList.add('hidden');
    grid.innerHTML = list.map(function (c) {
      var ipType = String(c.ipType || 'Sri Lankan IP');
      var sg = ipType.toLowerCase().indexOf('singapore') !== -1;
      return '<div class="vx-card group rounded-xl overflow-hidden">' +
        '<div class="p-5 flex flex-col h-full">' +
          '<div class="flex items-center justify-between mb-4 gap-2">' +
            '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ' + (CARRIER_STYLE[c.network] || 'bg-gray-500/10 text-gray-400 border-gray-500/20') + '"><i class="fa-solid fa-signal text-[10px]" aria-hidden="true"></i>' + V.esc(c.network) + '</span>' +
            '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ' + (sg ? 'bg-brand-500/10 text-brand-400' : 'bg-emerald-500/10 text-emerald-400') + '"><i class="fa-solid ' + (sg ? 'fa-bolt' : 'fa-earth-asia') + ' text-[9px]" aria-hidden="true"></i>' + V.esc(sg ? 'Singapore Direct' : 'Sri Lankan IP') + '</span>' +
          '</div>' +
          '<h3 class="text-white font-semibold text-sm mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">' + V.esc(c.name) + '</h3>' +
          '<div class="flex items-center gap-2 mb-4 mt-auto pt-1"><i class="fa-solid fa-gauge-high text-gray-600 text-xs" aria-hidden="true"></i><span class="text-gray-400 text-xs">' + V.esc(c.speed || 'Speed varies by network') + '</span></div>' +
          '<button type="button" data-config="' + V.esc(c.id) + '" class="open-modal w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-white text-sm font-semibold rounded-lg transition-all border border-brand-500/20 hover:border-brand-500"><i class="fa-solid fa-gear text-xs" aria-hidden="true"></i>Configure plan</button>' +
        '</div></div>';
    }).join('');
    V.reveal(grid.parentNode);
    grid.classList.add('revealed');
  }

  /* ---- plan list inside the modal & rate sheet are generated from data.js ---- */
  function renderPlans() {
    var box = V.$('#modal-plans');
    if (box) {
      box.innerHTML = D.vpnPlans.map(function (p, i) {
        var val = p.label + ' - LKR ' + V.money(p.price);
        return '<div class="plan-option relative">' +
          (p.popular ? '<div class="absolute -top-2 left-4 px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded z-10">POPULAR</div>' : '') +
          '<label class="flex items-center justify-between p-4 rounded-xl bg-[#0c0c0e] border ' + (p.popular ? 'border-brand-500/30' : 'border-[#1e1e2a]') + ' cursor-pointer hover:border-brand-500/40 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-500/5">' +
            '<div class="flex items-center gap-3">' +
              '<input type="radio" name="vpn-plan" value="' + V.esc(val) + '" class="w-4 h-4"' + (p.popular ? ' checked' : '') + '>' +
              '<div><span class="text-white font-medium text-sm">' + V.esc(p.label) + '</span><p class="text-gray-500 text-xs">' + V.esc(p.note) + '</p></div>' +
            '</div><span class="text-brand-400 font-bold text-sm">LKR ' + V.money(p.price) + '</span>' +
          '</label></div>';
      }).join('');
    }
    var body = V.$('#rate-sheet-body');
    if (body) {
      body.innerHTML = D.vpnPlans.map(function (p) {
        var perGb = p.gb ? (p.price / p.gb).toFixed(2) : '—';
        var tag = p.popular ? ' <span class="text-[10px] px-1.5 py-0.5 bg-brand-500/20 text-brand-400 rounded font-semibold">POPULAR</span>'
                : p.vip ? ' <span class="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded font-semibold">MAX</span>' : '';
        return '<tr class="hover:bg-white/[0.02] transition-colors' + (p.popular ? ' bg-brand-500/[0.03]' : '') + '">' +
          '<td class="px-6 py-4 font-medium text-white whitespace-nowrap">' + V.esc(p.tier) + tag + '</td>' +
          '<td class="px-6 py-4 text-gray-300 whitespace-nowrap">' + V.esc(p.label) + '</td>' +
          '<td class="px-6 py-4 text-brand-400 font-semibold">' + V.money(p.price) + '</td>' +
          '<td class="px-6 py-4 text-gray-400">' + perGb + '</td>' +
          '<td class="px-6 py-4 text-gray-400 whitespace-nowrap">' + V.esc(p.note) + '</td></tr>';
      }).join('');
    }
  }

  /* ---- modal (focus is moved in, trapped, and restored on close) ---- */
  function focusables() { var content = V.$('#modal-content'); return content ? V.$$('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', content).filter(function (el) { return !el.hidden && el.getClientRects().length; }) : []; }

  window.openVpnModal = function (id) {
    if (!modal) { V.toast('Order dialog is unavailable. Please refresh the page.', 'error'); return; }
    var cfg = D.vpnConfigs.filter(function (c) { return String(c.id) === String(id); })[0];
    if (!cfg) { V.toast('This configuration could not be found. Please refresh the page.', 'error'); return; }
    state.selectedId = cfg.id;
    lastFocus = document.activeElement;
    V.$('#modal-config-name').textContent = cfg ? cfg.name : 'Select a plan';
    V.$('#modal-config-network').textContent = cfg ? cfg.network + ' • ' + cfg.ipType : 'Choose your data package';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var checked = V.$('input[name="vpn-plan"]:checked') || V.$('input[name="vpn-plan"]');
    if (checked) { checked.checked = true; checked.focus(); }
  };
  window.closeVpnModal = function () {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    state.selectedId = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  window.vpnCheckout = function () {
    var picked = V.$('input[name="vpn-plan"]:checked');
    if (!picked) { V.toast('Please select a plan first.', 'error'); return; }
    var cfg = D.vpnConfigs.filter(function (c) { return String(c.id) === String(state.selectedId); })[0];
    V.openWhatsApp(
      "Hi Vexora Labs! 🔒\n\nI'd like to order a VPN configuration:\n\n" +
      '📋 Config: ' + (cfg ? cfg.name : 'Not specified') + '\n' +
      '📦 Plan: ' + picked.value + '\n\n' +
      'Please share the payment details and setup instructions. Thank you!'
    );
    window.closeVpnModal();
  };

  /* ---- events ---- */
  if (grid) grid.addEventListener('click', function (e) {
    var target = e.target;
    var b = target && target.closest ? target.closest('.open-modal') : null;
    if (b) window.openVpnModal(b.getAttribute('data-config'));
  });
  var ACTIVE = ['active', 'bg-brand-500', 'text-white', 'shadow-lg', 'shadow-brand-500/25'];
  var IDLE = ['bg-[#111116]', 'border', 'border-[#1e1e2a]', 'text-gray-400'];
  var tabs = V.$$('.carrier-tab');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove.apply(b.classList, ACTIVE); b.classList.add.apply(b.classList, IDLE); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.remove.apply(btn.classList, IDLE); btn.classList.add.apply(btn.classList, ACTIVE); btn.setAttribute('aria-pressed', 'true');
      state.carrier = btn.getAttribute('data-carrier');
      renderCards();
    });
  });
  var search = V.$('#vpn-search'), t;
  if (search) search.addEventListener('input', function (e) { clearTimeout(t); t = setTimeout(function () { state.query = e.target.value; renderCards(); }, 200); });
  var backdrop = V.$('#modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', window.closeVpnModal);
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') { window.closeVpnModal(); return; }
    if (e.key === 'Tab') {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* deep link: vpn.html?carrier=Dialog */
  var qp = new URLSearchParams(location.search).get('carrier');
  if (qp) { var tab = V.$('.carrier-tab[data-carrier="' + qp.replace(/[^A-Za-z]/g, '') + '"]'); if (tab) { state.carrier = tab.getAttribute('data-carrier'); } }

  renderPlans();
  if (modal) modal.setAttribute('aria-hidden', modal.classList.contains('hidden') ? 'true' : 'false');
  if (state.carrier !== 'all') { var t0 = V.$('.carrier-tab[data-carrier="' + state.carrier + '"]'); if (t0) t0.click(); } else { renderCards(); }
})();
