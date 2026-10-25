/* Contact page: builds a pre-filled WhatsApp ticket */
(function () {
  'use strict';
  var V = window.Vexora, D = V.data;

  var select = V.$('#contact-interest');
  if (select) {
    var opts = D.vpnPlans.filter(function (p) { return p.popular || p.vip || p.gb === 100; }).map(function (p) { return 'VPN Config (' + p.label + ' - ' + V.money(p.price) + ' LKR)'; })
      .concat(D.softwares.map(function (s) { return s.name + ' (' + V.money(s.price) + ' LKR)'; }))
      .concat(['Website / Web Development Quote', 'Connection Troubleshooting Help']);
    select.innerHTML = opts.map(function (o) { return '<option value="' + V.esc(o) + '">' + V.esc(o) + '</option>'; }).join('');
    var wanted = new URLSearchParams(location.search).get('interest');   // contact.html?interest=web
    if (wanted === 'web') select.value = 'Website / Web Development Quote';
  }

  window.handleContactSubmit = function (e) {
    e.preventDefault();
    var name = V.$('#contact-name').value.trim();
    if (!name) { V.$('#contact-name').focus(); return; }
    var carrier = V.$('#contact-carrier').value;
    var interest = V.$('#contact-interest').value;
    var device = (V.$('input[name="device_platform"]:checked') || {}).value || 'Not specified';
    var notes = V.$('#contact-notes').value.trim();
    V.openWhatsApp('💬 *NEW INQUIRY TICKET: VEXORA LABS*\n\n' +
      '👤 *Customer Name:* ' + name + '\n' +
      '📶 *Carrier Network:* ' + carrier + '\n' +
      '🎯 *Interested Item:* ' + interest + '\n' +
      '📱 *Device Platform:* ' + device + '\n' +
      (notes ? '📝 *Notes:* ' + notes + '\n' : '') +
      '\nPlease let me know how to proceed with payment and delivery.');
  };
})();
