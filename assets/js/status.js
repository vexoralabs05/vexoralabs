(function(){
'use strict';
var DATA_URL='data/status.json', $=function(id){return document.getElementById(id);};
var esc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var labels={up:'Operational',down:'Offline',degraded:'Degraded performance',maintenance:'Under maintenance',unknown:'Unknown'};
function date(v){if(!v)return 'Time unavailable';var d=new Date(v);return isNaN(d)?String(v):d.toLocaleString();}
function pct(v){return typeof v==='number'?v.toFixed(2)+'%':'—';}
function metric(label,value){return value==null?'':'<span class="status-metric"><b>'+esc(label)+'</b> '+esc(value)+'</span>';}
function render(data){
 var services=Array.isArray(data.services)?data.services:[], incidents=Array.isArray(data.incidents)?data.incidents:[], maintenance=Array.isArray(data.maintenance)?data.maintenance:[];
 var counts={up:0,down:0,unknown:0};services.forEach(function(s){counts[s.status]=(counts[s.status]||0)+1;});
 var overall=services.length&&counts.down===0&&counts.unknown===0?'up':counts.down?'down':'unknown';
 $('overall-card').dataset.state=overall;
 $('overall-label').textContent=overall==='up'?'All Systems Operational':overall==='down'?'Service disruption detected':'Some monitor data is unavailable';
 $('overall-pill').textContent=labels[overall];
 $('overall-card').querySelector('.overall-icon i').className=overall==='up'?'fa-solid fa-circle-check':overall==='down'?'fa-solid fa-circle-xmark':'fa-solid fa-circle-question';
 $('updated-label').textContent='PXN snapshot polled: '+date(data.updatedAt);
 $('stat-total').textContent=services.length;$('stat-up').textContent=counts.up;$('stat-issues').textContent=counts.down+counts.unknown;
 $('stat-sync').textContent=data.updatedAt?new Date(data.updatedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—';
 var groups={};services.forEach(function(s){(groups[s.group||'Services']=groups[s.group||'Services']||[]).push(s);});
 $('service-list').innerHTML=Object.keys(groups).map(function(g){return '<div class="service-group-title">'+esc(g)+'</div>'+groups[g].map(function(s){
  var state=s.status||'unknown', resources=metric('Ping',s.ping==null?null:s.ping+' ms')+metric('24h uptime',pct(s.uptime24h))+metric('CPU',s.cpu==null?null:s.cpu+'%')+metric('RAM',s.memory==null?null:s.memory+'%')+metric('Disk',s.disk==null?null:s.disk+'%');
  return '<article class="service-row"><div class="service-main"><div class="service-name">'+esc(s.name)+'</div><div class="service-meta">'+esc(s.message||s.type||'Service monitor')+'</div><div class="status-metrics">'+resources+'</div></div><span class="service-status state-'+esc(state)+'">'+labels[state]+'</span></article>';
 }).join('');}).join('');
 var ih=$('incident-list');
 ih.className=incidents.length?'':'status-empty';
 ih.innerHTML=incidents.length?incidents.map(function(i){return '<article class="incident-card"><div class="incident-title">'+esc(i.title)+'</div><div class="incident-desc">'+esc(i.description)+'</div><div class="incident-date">'+esc(date(i.updatedAt||i.createdAt))+' · '+esc(i.status||'Update')+'</div></article>';}).join(''):'<i class="fa-solid fa-circle-check"></i><strong>No incident records</strong>';
 if(maintenance.length){
  var mh=document.getElementById('maintenance-list');
  if(!mh){mh=document.createElement('div');mh.id='maintenance-list';ih.parentNode.insertBefore(mh,ih.nextSibling);}
  mh.innerHTML='<h2 class="text-2xl font-extrabold text-white mt-10 mb-5">Maintenance history</h2>'+maintenance.map(function(m){return '<article class="incident-card"><div class="incident-title">'+esc(m.title)+'</div><div class="incident-desc">'+esc(m.description)+'</div><div class="incident-date">'+esc(date(m.startDate))+' – '+esc(date(m.endDate))+' · '+(m.active?'Active':'Inactive')+'</div></article>';}).join('');
 }
}
function load(){fetch(DATA_URL+'?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw Error(r.status);return r.json();}).then(render).catch(function(){$('updated-label').textContent='Unable to load status data';});}
var menu=$('status-menu-btn'),mobile=$('status-mobile-menu');if(menu&&mobile)menu.addEventListener('click',function(){var open=mobile.classList.contains('hidden');mobile.classList.toggle('hidden',!open);menu.setAttribute('aria-expanded',String(open));});
$('status-year').textContent=new Date().getFullYear();load();setInterval(load,60000);
})();