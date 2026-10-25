/* Pricing page: rate sheet + bundle calculator, all generated from data.js */
(function () {
  'use strict';
  var V = window.Vexora, D = V.data;

  /* VPN cards */
  var vpnGrid = V.$('#vpn-plan-grid');
  if (vpnGrid) {
    vpnGrid.innerHTML = D.vpnPlans.map(function (p) {
      return '<div class="bg-[#121217] p-5 rounded-2xl border ' + (p.popular ? 'border-brand-500/40' : 'border-[#242436]') + ' flex flex-col justify-between relative">' +
        (p.popular ? '<span class="absolute -top-3 left-4 bg-brand-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">Best value</span>' : '') +
        (p.vip ? '<span class="absolute -top-3 left-4 bg-white text-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">VIP</span>' : '') +
        '<div><span class="text-xs ' + (p.popular ? 'text-brand-400' : 'text-gray-400') + ' font-semibold uppercase">' + V.esc(p.tier) + '</span>' +
        '<div class="text-3xl font-black text-white mt-1">' + V.esc(p.label) + '</div>' +
        '<div class="text-2xl font-bold ' + (p.popular ? 'text-brand-400' : p.vip ? 'text-white' : 'text-gray-300') + ' mt-2">' + V.money(p.price) + ' LKR</div>' +
        '<p class="text-[11px] text-gray-500 mt-1">' + V.esc(p.note) + '</p></div>' +
        '<a href="vpn.html" class="mt-5 w-full py-2 rounded-xl ' + (p.popular ? 'bg-brand-600 hover:bg-brand-500 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-200') + ' text-xs font-semibold text-center transition-all">Configure plan</a></div>';
    }).join('');
  }

  /* software table */
  var LABELS = { design: 'Design & Media', ai: 'AI & Cloud', office: 'Office Suite', windows: 'Operating System' };
  var ICONS = { design: 'fa-palette text-brand-400', ai: 'fa-robot text-amber-400', office: 'fa-file-word text-sky-400', windows: 'fa-windows text-sky-400' };
  var tbody = V.$('#software-table-body');
  if (tbody) {
    tbody.innerHTML = D.softwares.map(function (s) {
      var brand = s.category === 'windows' ? 'fa-brands' : 'fa-solid';
      return '<tr class="hover:bg-white/[0.02]">' +
        '<td class="py-4 px-4 font-bold text-white"><span class="flex items-center gap-2 min-w-[14rem]"><i class="' + brand + ' ' + ICONS[s.category] + '" aria-hidden="true"></i>' + V.esc(s.name) + '</span></td>' +
        '<td class="py-4 px-4 text-xs text-gray-400 whitespace-nowrap">' + V.esc(LABELS[s.category]) + '</td>' +
        '<td class="py-4 px-4 font-bold text-white font-mono whitespace-nowrap">' + V.money(s.price) + ' LKR</td>' +
        '<td class="py-4 px-4 text-xs text-gray-300">' + V.esc((s.features || []).slice(-1)[0] || '') + '</td>' +
        '<td class="py-4 px-4 text-right"><button type="button" data-order="' + V.esc(s.id) + '" class="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Order</button></td></tr>';
    }).join('');
    tbody.addEventListener('click', function (e) { var b = e.target.closest('[data-order]'); if (b) window.orderSoftwareViaWhatsApp(b.getAttribute('data-order')); });
  }

  /* calculator inputs */
  var vpnBox = V.$('#calc-vpn-options');
  if (vpnBox) {
    var opts = [{ id: 'none', label: 'No VPN', price: 0 }].concat(D.vpnPlans);
    vpnBox.innerHTML = opts.map(function (p, i) {
      return '<label class="cursor-pointer text-center p-3 rounded-xl border border-[#272738] bg-[#101017] has-[:checked]:border-brand-500 has-[:checked]:bg-brand-500/10 hover:border-gray-500 transition-all">' +
        '<input type="radio" name="calc_vpn" value="' + p.price + '" data-label="' + V.esc(p.label + ' VPN') + '" class="sr-only"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="block text-xs font-bold text-white">' + V.esc(p.label) + '</span>' +
        '<span class="block text-[11px] ' + (p.popular ? 'text-brand-400 font-semibold' : 'text-gray-400') + '">' + V.money(p.price) + ' LKR</span></label>';
    }).join('');
  }
  var softBox = V.$('#calc-software-checkboxes');
  if (softBox) {
    softBox.innerHTML = D.softwares.map(function (s) {
      return '<label class="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#272738] bg-[#101017] hover:border-gray-500 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-500/10 cursor-pointer transition-all">' +
        '<span class="flex items-center gap-3 min-w-0"><input type="checkbox" value="' + s.price + '" data-name="' + V.esc(s.name) + '" class="calc-soft-check rounded"><span class="text-xs font-bold text-white">' + V.esc(s.name) + '</span></span>' +
        '<span class="text-xs font-mono font-bold text-gray-300 whitespace-nowrap">' + V.money(s.price) + ' LKR</span></label>';
    }).join('');
  }

  /* calculator logic */
  var items = [], total = 0;
  window.updateBundleCalc = function () {
    items = []; total = 0;
    var vpn = V.$('input[name="calc_vpn"]:checked');
    if (vpn && parseInt(vpn.value, 10) > 0) { var p = parseInt(vpn.value, 10); items.push({ name: vpn.getAttribute('data-label'), price: p }); total += p; }
    V.$$('.calc-soft-check:checked').forEach(function (c) { var p = parseInt(c.value, 10); items.push({ name: c.getAttribute('data-name'), price: p }); total += p; });

    var list = V.$('#bundle-items-list'), totalEl = V.$('#bundle-total-price'), btn = V.$('#bundle-checkout-btn');
    if (!items.length) {
      list.innerHTML = '<p class="text-gray-500 italic">Pick a VPN plan or software to see your total.</p>';
      totalEl.textContent = '0 LKR'; btn.disabled = true; btn.classList.add('opacity-50');
    } else {
      list.innerHTML = items.map(function (i) {
        return '<div class="flex justify-between items-center gap-3 text-xs text-gray-300 py-1.5 border-b border-[#1f1f2e]"><span>' + V.esc(i.name) + '</span><span class="font-mono font-bold text-white whitespace-nowrap">' + V.money(i.price) + ' LKR</span></div>';
      }).join('');
      totalEl.textContent = V.money(total) + ' LKR'; btn.disabled = false; btn.classList.remove('opacity-50');
    }
  };
  window.orderBundleViaWhatsApp = function () {
    if (!items.length) return;
    V.openWhatsApp('🛍️ *CUSTOM DIGITAL BUNDLE ORDER - VEXORA LABS*\n\nHello! I would like to order the following bundle:\n\n' +
      items.map(function (i, n) { return (n + 1) + '. *' + i.name + '* - ' + V.money(i.price) + ' LKR'; }).join('\n') +
      '\n\n💰 *Total Bundle Price:* ' + V.money(total) + ' LKR\n\nPlease send me your payment details and setup instructions. Thank you!');
  };
  document.addEventListener('change', function (e) { if (e.target.matches('input[name="calc_vpn"], .calc-soft-check')) window.updateBundleCalc(); });
  window.updateBundleCalc();
})();
