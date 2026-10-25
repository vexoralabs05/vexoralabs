/**
 * Vexora Labs – Cinematic Animation Engine & Core Logic
 * GSAP-powered scroll animations, counter system, navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNavLink();
    initCounterAnimation();
    initHeroParticles();
    initSmoothScrollLinks();
    initFloatingWhatsApp();

    // Initialize AOS (if loaded)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: 'phone'
        });
    }

    // Initialize GSAP ScrollTrigger animations (if loaded)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGsapAnimations();
    }
});

/* ── Mobile Navigation ── */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.toggle('hidden');
        document.body.classList.toggle('no-scroll', !isHidden);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isHidden ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars text-xl';
        });
    });
}

/* ── Active Nav Link Highlighter ── */
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ── Animated Counters (Intersection Observer) ── */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2200; // ms
    const startTime = performance.now();
    const startValue = 0;

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
        
        el.textContent = prefix + currentValue.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = prefix + target.toLocaleString() + suffix;
        }
    }

    requestAnimationFrame(update);
}

/* ── Hero Floating Particles ── */
function initHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const PARTICLE_COUNT = 30;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.5 + 0.2;

        particle.style.cssText = `
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
        `;

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
}

/* ── Smooth Scroll for Anchor Links ── */
function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ── Floating WhatsApp Widget ── */
function initFloatingWhatsApp() {
    if (document.getElementById('wa-float-widget')) return;

    const widget = document.createElement('a');
    widget.id = 'wa-float-widget';
    widget.className = 'wa-float';
    widget.href = `https://wa.me/${VEXORA_DATA.business.whatsappNumber}?text=${encodeURIComponent('Hello Vexora Labs! 👋 I need help with VPN or Software.')}`;
    widget.target = '_blank';
    widget.rel = 'noopener noreferrer';
    widget.title = 'Chat on WhatsApp';
    widget.innerHTML = `
        <i class="fa-brands fa-whatsapp"></i>
        <span class="wa-ping"></span>
    `;
    document.body.appendChild(widget);
}

/* ── GSAP Scroll-Triggered Animations ── */
function initGsapAnimations() {
    // Hero Title Cinematic Entry
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        gsap.from(heroTitle, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.3
        });
    }

    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) {
        gsap.from(heroSub, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.6
        });
    }

    const heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas) {
        gsap.from(heroCtas, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.9
        });
    }

    // Parallax glow orbs
    document.querySelectorAll('.glow-orb').forEach(orb => {
        gsap.to(orb, {
            y: -40,
            scrollTrigger: {
                trigger: orb.closest('section') || orb.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // Stagger card entries
    document.querySelectorAll('.stagger-cards').forEach(container => {
        const cards = container.querySelectorAll('.vx-card');
        if (cards.length) {
            gsap.from(cards, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });
}

/* ── WhatsApp Order Generators ── */
function orderSoftwareViaWhatsApp(softwareId) {
    const item = VEXORA_DATA.softwares.find(s => s.id === softwareId);
    if (!item) return;

    const msg = `👋 *HELLO VEXORA LABS!* 🚀\n\n` +
        `I want to purchase:\n\n` +
        `🖥️ *Product:* ${item.name}\n` +
        `📁 *Category:* ${item.category}\n` +
        `💰 *Price:* ${item.priceLKR.toLocaleString()} LKR\n\n` +
        `Please share payment details. Thank you!`;

    window.open(`https://wa.me/${VEXORA_DATA.business.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── VPN Modal System ── */
let activeVpnConfig = null;
let activeVpnPlan = null;

function openVpnModal(configId) {
    const config = VEXORA_DATA.vpnConfigs.find(c => c.id === configId);
    if (!config) return;

    activeVpnConfig = config;
    activeVpnPlan = null;

    const modal = document.getElementById('vpn-order-modal');
    if (!modal) return;

    document.getElementById('modal-vpn-title').textContent = config.name;
    document.getElementById('modal-vpn-network').textContent = `${config.network} • ${config.type}`;
    document.getElementById('modal-vpn-total').textContent = 'Select a plan';

    const btn = document.getElementById('modal-vpn-checkout-btn');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-50', 'cursor-not-allowed'); }

    const grid = document.getElementById('modal-vpn-plans-grid');
    if (grid) {
        grid.innerHTML = VEXORA_DATA.vpnPlans.map(plan => {
            const badge = plan.badge ? `<span class="absolute -top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-lg z-10">${plan.badge}</span>` : '';
            const icon = plan.icon ? `<i class="fa-solid ${plan.icon} text-lg mb-1 block text-red-400"></i>` : '';
            return `
                <label class="relative block cursor-pointer group">
                    <input type="radio" name="modal_vpn_plan" value="${plan.id}" class="sr-only plan-selector-radio" onchange="selectVpnPlan('${plan.id}')">
                    ${badge}
                    <div class="rounded-xl border border-[#1e1e2a] bg-[#0e0e12] p-4 hover:border-gray-600 transition-all flex flex-col items-center text-center relative">
                        <div class="absolute top-2.5 left-2.5 w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                            <div class="w-2 h-2 rounded-full bg-red-500 opacity-0 scale-0 transition-all radio-dot"></div>
                        </div>
                        ${icon}
                        <span class="text-sm font-extrabold text-white">${plan.gb}</span>
                        <span class="text-[11px] text-gray-500 uppercase font-semibold">${plan.tier}</span>
                        <span class="text-xs font-bold text-red-400 mt-1 plan-price-text">${plan.priceLKR} LKR</span>
                    </div>
                </label>
            `;
        }).join('');
    }

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        const box = modal.querySelector('.modal-box');
        if (box) { box.classList.remove('scale-95'); box.classList.add('scale-100'); }
    });
    document.body.classList.add('modal-open');
}

function selectVpnPlan(planId) {
    const plan = VEXORA_DATA.vpnPlans.find(p => p.id === planId);
    if (!plan) return;
    activeVpnPlan = plan;
    const el = document.getElementById('modal-vpn-total');
    if (el) el.textContent = `${plan.priceLKR.toLocaleString()} LKR`;
    const btn = document.getElementById('modal-vpn-checkout-btn');
    if (btn) { btn.disabled = false; btn.classList.remove('opacity-50', 'cursor-not-allowed'); }
}

function closeVpnModal() {
    const modal = document.getElementById('vpn-order-modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    const box = modal.querySelector('.modal-box');
    if (box) { box.classList.remove('scale-100'); box.classList.add('scale-95'); }
    setTimeout(() => { modal.classList.add('hidden'); document.body.classList.remove('modal-open'); }, 250);
}

function submitVpnOrder() {
    if (!activeVpnConfig || !activeVpnPlan) return;
    const msg = `🚀 *VPN ORDER — VEXORA LABS*\n\n` +
        `📡 *Config:* ${activeVpnConfig.name}\n` +
        `📶 *Network:* ${activeVpnConfig.network}\n` +
        `🌐 *Routing:* ${activeVpnConfig.type}\n` +
        `📊 *Data:* ${activeVpnPlan.gb} (${activeVpnPlan.tier})\n` +
        `💰 *Total:* ${activeVpnPlan.priceLKR} LKR\n\n` +
        `Please send payment details!`;
    window.open(`https://wa.me/${VEXORA_DATA.business.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    closeVpnModal();
}

/* ── Toast Notification ── */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 z-[999] px-5 py-3 rounded-xl border font-medium text-sm shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-[-20px] opacity-0 ${
        type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : 'bg-[#16161e] border-[#2a2a3c] text-white'
    }`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-info text-red-400'}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.classList.remove('translate-y-[-20px]', 'opacity-0'); });
    setTimeout(() => { toast.classList.add('opacity-0'); setTimeout(() => toast.remove(), 300); }, 3500);
}

function copyToClipboard(text, successMsg = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg, 'success')).catch(() => showToast('Copy failed', 'error'));
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVpnModal(); });
