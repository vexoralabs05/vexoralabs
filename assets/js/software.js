/* Software store: category filter, search, card rendering */
(function () {
  'use strict';
  var V = window.Vexora, D = V.data;
  var state = { category: 'all', query: '' };
  var grid = V.$('#softwareGrid'), empty = V.$('#noResults');

  var ICONS = [['canva', 'fa-solid fa-palette'], ['adobe', 'fa-solid fa-wand-magic-sparkles'], ['capcut', 'fa-solid fa-film'],
    ['gemini', 'fa-solid fa-robot'], ['chatgpt', 'fa-solid fa-brain'], ['office', 'fa-solid fa-file-word'], ['windows', 'fa-brands fa-windows']];
  var LABELS = { design: 'Design & Video', ai: 'AI & Cloud', office: 'MS Office', windows: 'Windows Keys' };

  function icon(name) {
    var n = name.toLowerCase();
    for (var i = 0; i < ICONS.length; i++) if (n.indexOf(ICONS[i][0]) !== -1) return ICONS[i][1];
    return 'fa-solid fa-box';
  }
  function badgeClass(b) {
    var l = b.toLowerCase();
    if (l.indexOf('new') !== -1) return 'badge-new';
    if (l.indexOf('sale') !== -1 || l.indexOf('deal') !== -1) return 'badge-sale';
    return 'badge-hot';
  }

  function render() {
    var q = state.query.toLowerCase();
    var items = D.softwares.filter(function (s) {
      return (state.category === 'all' || s.category === state.category) &&
        (!q || [s.name, s.description, LABELS[s.category]].join(' ').toLowerCase().indexOf(q) !== -1);
    });
    var count = V.$('#softwareCount');
    if (count) count.textContent = items.length + (items.length === 1 ? ' product' : ' products');

    if (!items.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');

    grid.innerHTML = items.map(function (s) {
      var off = s.originalPrice ? Math.round((1 - s.price / s.originalPrice) * 100) : 0;
      return '<article class="vx-card flex flex-col">' +
        (s.badge ? '<span class="absolute top-4 right-4 ' + badgeClass(s.badge) + ' text-xs font-bold px-2.5 py-1 rounded-full">' + V.esc(s.badge) + '</span>' : '') +
        '<div class="p-5 sm:p-6 flex flex-col flex-1">' +
          '<div class="flex items-start gap-4 mb-4 pr-16">' +
            '<div class="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><i class="' + icon(s.name) + ' text-brand-400 text-xl" aria-hidden="true"></i></div>' +
            '<div class="min-w-0"><h3 class="text-white font-bold text-base leading-snug">' + V.esc(s.name) + '</h3><span class="text-gray-500 text-xs">' + V.esc(LABELS[s.category] || s.category) + '</span></div>' +
          '</div>' +
          '<p class="text-gray-400 text-sm leading-relaxed mb-4">' + V.esc(s.description) + '</p>' +
          '<ul class="space-y-2 mb-5 flex-1">' + (s.features || []).slice(0, 4).map(function (f) {
            return '<li class="flex items-center gap-2 text-gray-400 text-xs"><i class="fa-solid fa-check text-brand-400 text-[10px] flex-shrink-0" aria-hidden="true"></i><span>' + V.esc(f) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="price-tag p-3.5 mb-4 flex items-center justify-between">' +
            '<div><div class="text-white font-bold text-lg">LKR ' + V.money(s.price) + '</div>' +
            (s.originalPrice ? '<span class="text-gray-500 line-through text-sm">LKR ' + V.money(s.originalPrice) + '</span>' : '') + '</div>' +
            (off ? '<span class="bg-brand-500/15 text-brand-400 text-xs font-bold px-2 py-1 rounded-lg">' + off + '% OFF</span>' : '') +
          '</div>' +
          '<button type="button" data-order="' + V.esc(s.id) + '" class="order-btn w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"><i class="fa-brands fa-whatsapp text-base" aria-hidden="true"></i>Order on WhatsApp</button>' +
        '</div></article>';
    }).join('');
    grid.classList.remove('revealed');
    requestAnimationFrame(function () { requestAnimationFrame(function () { grid.classList.add('revealed'); }); });
  }

  window.resetFilters = function () {
    state.category = 'all'; state.query = '';
    V.$('#softwareSearch').value = '';
    V.$$('.filter-tab').forEach(function (t) { var on = t.getAttribute('data-category') === 'all'; t.classList.toggle('active', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    render();
  };

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-order]');
    if (b) window.orderSoftwareViaWhatsApp(b.getAttribute('data-order'));
  });
  V.$$('.filter-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      V.$$('.filter-tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      tab.classList.add('active'); tab.setAttribute('aria-pressed', 'true');
      state.category = tab.getAttribute('data-category');
      render();
    });
  });
  var timer;
  V.$('#softwareSearch').addEventListener('input', function (e) { clearTimeout(timer); timer = setTimeout(function () { state.query = e.target.value.trim(); render(); }, 200); });

  /* deep link: software.html?category=windows */
  var cat = new URLSearchParams(location.search).get('category');
  var tab = cat && V.$('.filter-tab[data-category="' + cat.replace(/[^a-z]/g, '') + '"]');
  if (tab) tab.click(); else render();
})();
