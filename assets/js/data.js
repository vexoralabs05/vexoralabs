/* ==========================================================================
   Vexora Labs — single source of truth for prices, plans and contact details.
   Edit values here and every page (home, VPN, software, pricing, contact)
   updates automatically.
   ========================================================================== */
(function (root) {
  'use strict';

  var VEXORA_DATA = {
    business: {
      name: 'Vexora Labs',
      tagline: "Sri Lanka's Premier Digital Store & VPN Provider",
      whatsappNumber: '94727397294',
      displayPhone: '+94 72 739 7294',
      currency: 'LKR',
      social: {
        tiktok: 'https://www.tiktok.com/@vexora_lab?_r=1&_t=ZS-9AT9QMRMRku',
        facebook: 'https://www.facebook.com/share/1FaZW1dVMD/',
        instagram: 'https://instagram.com/vexora_labss?cplk=MWQ4Znk3cWp0bjgzeg%3D%3D',
        telegram: 'https://t.me/vexoralabs'
      },
      serverLocations: ["Singapore (Ultra-Low Latency)", "Sri Lankan IP Nodes"],
      averagePing: "35ms - 48ms",
      uptime: "99.98%",
      services: [
          "V2Ray & VPN Configurations",
          "Software Licensing & Accounts",
          "Professional Web Development",
          "UI/UX Design & Branding"
      ]
    },

    /* ---- VPN data plans (valid 30 days) -------------------------------- */
    vpnPlans: [
      { id: 'vpn-100',  label: '100 GB',    gb: 100,  price: 160, tier: 'Starter',    note: 'Light browsing', badge: '' },
      { id: 'vpn-150',  label: '150 GB',    gb: 150,  price: 200, tier: 'Standard',   note: 'Everyday use', badge: '' },
      { id: 'vpn-200',  label: '200 GB',    gb: 200,  price: 260, tier: 'Economy',    note: 'Social & video calls', badge: '' },
      { id: 'vpn-250',  label: '250 GB',    gb: 250,  price: 300, tier: 'Plus',       note: 'Gaming & HD streaming', popular: true, badge: 'Best Value' },
      { id: 'vpn-300',  label: '300 GB',    gb: 300,  price: 360, tier: 'Advanced',   note: 'Streaming', badge: '' },
      { id: 'vpn-400',  label: '400 GB',    gb: 400,  price: 400, tier: 'Power User', note: 'Heavy downloads', popular: true, badge: 'Most Popular' },
      { id: 'vpn-500',  label: '500 GB',    gb: 500,  price: 500, tier: 'Heavy Duty', note: '4K streaming', badge: '' },
      { id: 'vpn-unl',  label: 'Unlimited', gb: null, price: 700, tier: 'Ultimate',   note: 'No data limits', vip: true, badge: 'VIP Pro', icon: 'fa-infinity', popular: true }
    ],

    /* ---- VPN configurations by carrier --------------------------------- */
    vpnConfigs: [
      // AIRTEL
      { id: "airtel-1", network: "Airtel", name: "AIRTEL 135/260 YOUTUBE", ipType: "Singapore Direct", lowPing: true, speed: "Up to 80 Mbps" },
      { id: "airtel-2", network: "Airtel", name: "AIRTEL 135/260 YOUTUBE (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 75 Mbps", hasSLIP: true },
      { id: "airtel-3", network: "Airtel", name: "AIRTEL TIKTOK 297/997", ipType: "Singapore Direct", lowPing: true, speed: "Up to 85 Mbps" },
      { id: "airtel-4", network: "Airtel", name: "AIRTEL TIKTOK 297/997 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 80 Mbps", hasSLIP: true },
      { id: "airtel-5", network: "Airtel", name: "AIRTEL ZOOM 215", ipType: "Singapore Direct", lowPing: true, speed: "Up to 90 Mbps" },
      { id: "airtel-6", network: "Airtel", name: "AIRTEL ZOOM 215 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 85 Mbps", hasSLIP: true },

      // DIALOG
      { id: "dialog-1", network: "Dialog", name: "DIALOG SIM VIDEO CONFERENCING 724", ipType: "Singapore Direct", lowPing: true, speed: "Up to 110 Mbps" },
      { id: "dialog-2", network: "Dialog", name: "DIALOG SIM VIDEO CONFERENCING 724 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 100 Mbps", hasSLIP: true },
      { id: "dialog-3", network: "Dialog", name: "DIALOG SOCIAL MEDIA 348/488", ipType: "Singapore Direct", lowPing: true, speed: "Up to 95 Mbps" },
      { id: "dialog-4", network: "Dialog", name: "DIALOG SOCIAL MEDIA 348/488 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 90 Mbps", hasSLIP: true },
      { id: "dialog-5", network: "Dialog", name: "DIALOG TIKTOK 297/997 (Mobile SIM)", ipType: "Singapore Direct", lowPing: true, speed: "Up to 105 Mbps" },
      { id: "dialog-6", network: "Dialog", name: "DIALOG TIKTOK 297/997 (Mobile SIM - Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 100 Mbps", hasSLIP: true },
      { id: "dialog-7", network: "Dialog", name: "DIALOG ZOOM 298/724 (Home Broadband Router)", ipType: "Singapore Direct", lowPing: true, speed: "Up to 120 Mbps" },
      { id: "dialog-8", network: "Dialog", name: "DIALOG ZOOM 298/724 (Router - Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 115 Mbps", hasSLIP: true },

      // HUTCH
      { id: "hutch-1", network: "Hutch", name: "HUTCH ZOOM 224", ipType: "Singapore Direct", lowPing: true, speed: "Up to 65 Mbps" },
      { id: "hutch-2", network: "Hutch", name: "HUTCH ZOOM 224 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 60 Mbps", hasSLIP: true },

      // MOBITEL
      { id: "mobitel-1", network: "Mobitel", name: "MOBITEL ZOOM (Android Only, IP Hunt Needed)", ipType: "Singapore Direct", lowPing: true, speed: "Up to 130 Mbps", note: "IP Hunt required" },
      { id: "mobitel-2", network: "Mobitel", name: "MOBITEL ZOOM (Android Only, IP Hunt - Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 120 Mbps", hasSLIP: true, note: "IP Hunt required" },

      // SLT
      { id: "slt-1", network: "SLT", name: "SLT NETFLIX (Fibre, 4G, ADSL)", ipType: "Singapore Direct", lowPing: true, speed: "Up to 300 Mbps (Fibre)" },
      { id: "slt-2", network: "SLT", name: "SLT NETFLIX (Fibre, 4G, ADSL - Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 280 Mbps (Fibre)", hasSLIP: true },
      { id: "slt-3", network: "SLT", name: "SLT ZOOM (Fibre, 4G, ADSL)", ipType: "Singapore Direct", lowPing: true, speed: "Up to 300 Mbps (Fibre)" },
      { id: "slt-4", network: "SLT", name: "SLT ZOOM (Fibre, 4G, ADSL - Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 280 Mbps (Fibre)", hasSLIP: true },
      { id: "slt-5", network: "SLT", name: "SLT ZOOM PREPAID 235", ipType: "Singapore Direct", lowPing: true, speed: "Up to 100 Mbps" },
      { id: "slt-6", network: "SLT", name: "SLT ZOOM PREPAID 235 (Sri Lankan IP)", ipType: "Sri Lankan IP", lowPing: true, speed: "Up to 95 Mbps", hasSLIP: true }
    ],

    /* ---- Software catalogue -------------------------------------------- */
    softwares: [
      {
        id: "soft-gemini", name: "Google Gemini Advanced / AI Pro", category: "ai", price: 1200, originalPrice: 3200,
        badge: "Trending Hot 🔥", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40", icon: "fa-brain",
        description: "Full access to Google's most capable AI model (Gemini 1.5 Pro). Solves Sri Lankan location restrictions, with 1M context window and cloud storage.",
        features: ["Full Gemini 1.5 Pro & Ultra Reasoning", "Fixes 'Location Not Available' restrictions", "Code execution & file analysis suite", "Instant delivery & activation instructions", "100% private and guaranteed access"],
        bestFor: "Developers, researchers, content creators & students", highlight: "Solves Antigravity & AI location blocks"
      },
      {
        id: "soft-canva", name: "Canva Pro Account", category: "design", price: 300, originalPrice: 1500,
        badge: "Best Seller ⭐", badgeColor: "bg-brand-500/20 text-brand-400 border-brand-500/40", icon: "fa-palette",
        description: "Unlock all premium templates, magical AI tools, Brand Kit, and 100M+ premium assets on your own personal Canva account.",
        features: ["Magic AI Studio & Background Remover", "100M+ Premium Stock Photos, Videos & Audio", "Brand Kits, Custom Fonts & SVG Export", "Unlimited Cloud Storage", "Full replacement warranty"],
        bestFor: "Graphic designers, marketers & social media managers", highlight: "Instant activation via WhatsApp"
      },
      {
        id: "soft-capcut", name: "CapCut Pro", category: "design", price: 800, originalPrice: 2400,
        badge: "Creator Choice 🎬", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40", icon: "fa-video",
        description: "Create viral TikToks, Reels, and YouTube videos with CapCut Pro unlocked features, pro transitions, auto-captions, and 4K 60FPS export.",
        features: ["All Pro AI Effects, Filters & Transitions", "Auto AI Subtitles & Voice Enhancer", "No Watermark & Full 4K 60fps Export", "PC and Mobile cross-platform support", "Cloud Space for video projects"],
        bestFor: "TikTokers, YouTubers & Reels creators", highlight: "Ultra high speed rendering"
      },
      {
        id: "soft-ms2024", name: "Microsoft Office 2024 Pro Plus", category: "office", price: 1000, originalPrice: 4500,
        badge: "New 2024 ⚡", badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40", icon: "fa-file-lines",
        description: "The brand new Microsoft Office 2024 suite. Packed with enhanced performance, modern UI, and lifetime offline activation.",
        features: ["Full Suite: Word, Excel, PowerPoint, Outlook, OneNote", "Latest 2024 release with modern UI updates", "Lifetime offline license (No monthly subscriptions)", "Official Microsoft installation files", "Seamless Windows 11 & Windows 10 support"],
        bestFor: "Business professionals, offices & university students", highlight: "One-time purchase, lifetime valid"
      },
      {
        id: "soft-win11", name: "Windows 11 Pro Retail Key", category: "windows", price: 900, originalPrice: 3800,
        badge: "100% Genuine 🛡️", badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/40", icon: "fa-windows",
        description: "Permanent official Retail activation key for Windows 11 Pro. Binds to your Microsoft account or motherboard hardware.",
        features: ["Official Retail License Key (Not temporary volume MAK)", "Binds to hardware / Reinstallable on same PC", "Enables BitLocker encryption & Hyper-V", "Unlocks Windows Copilot & Remote Desktop", "Instant digital key delivery via WhatsApp"],
        bestFor: "New PC builders & Windows 11 Home upgraders", highlight: "Direct online Microsoft activation"
      },
      {
        id: "soft-adobe", name: "Adobe Creative Cloud All Apps", category: "design", price: 3500, originalPrice: 14000,
        badge: "Master Suite 💎", badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40", icon: "fa-wand-magic-sparkles",
        description: "The complete Adobe master creative suite. Includes Photoshop, Premiere Pro, Illustrator, After Effects, Lightroom, and more.",
        features: ["Photoshop, Premiere Pro, Illustrator, After Effects", "Adobe Firefly Generative AI integration", "Lightroom Classic & InDesign included", "Windows & macOS compatibility", "Comprehensive setup assistance included"],
        bestFor: "Video editors, 3D artists, photographers & agency teams", highlight: "20+ creative applications"
      },
      {
        id: "soft-ms2021", name: "Microsoft Office 2021 Pro Plus", category: "office", price: 900, originalPrice: 3500,
        badge: "Most Popular 📌", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", icon: "fa-briefcase",
        description: "Rock-solid lifetime Microsoft Office 2021 edition. Trusted worldwide by businesses and institutions for flawless performance.",
        features: ["Word, Excel, PowerPoint, Access, Outlook, Publisher", "Single PC permanent activation", "Full offline functionality without internet required", "Compatible with Windows 10 & 11", "Zero recurring subscription fees"],
        bestFor: "Office workstations, accountants & home PCs", highlight: "Zero recurring fees"
      },
      {
        id: "soft-ms2019", name: "Microsoft Office 2019 Pro Plus", category: "office", price: 900, originalPrice: 2800,
        badge: "Stable Choice 📑", badgeColor: "bg-gray-500/20 text-gray-400 border-gray-500/40", icon: "fa-folder-open",
        description: "Lightweight, ultra-stable Office 2019 edition. Ideal for legacy laptops, budget PCs, and low-spec workstations.",
        features: ["Word, Excel, PowerPoint, Outlook & Access", "Low system resource footprint", "Lifetime offline license key", "Instant WhatsApp digital delivery", "Free remote setup assistance if needed"],
        bestFor: "Older laptops, low RAM PCs & standard office tasks", highlight: "Super lightweight & stable"
      },
      {
        id: "soft-win10", name: "Windows 10 Pro Retail Key", category: "windows", price: 900, originalPrice: 3200,
        badge: "Official Key 💻", badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40", icon: "fa-laptop",
        description: "Genuine retail product key for Windows 10 Professional (32-bit & 64-bit). Removes watermark and unlocks full security features.",
        features: ["Lifetime Retail Activation Key", "Unlocks Windows Defender Advanced Threat Protection", "Remote Desktop (RDP) Host enabled", "Official Microsoft download & upgrade link provided", "100% money-back activation guarantee"],
        bestFor: "Gamers & office computers running Windows 10", highlight: "Permanent removal of 'Activate Windows'"
      }
    ],

    /* ---- CLIENT APPS & SETUP GUIDES ------------------------------------ */
    clientApps: [
      {
        platform: "Windows PC", name: "NetMod HTTP", badge: "Windows 10 / 11", icon: "fa-windows", iconColor: "text-blue-400",
        downloadUrl: "https://sourceforge.net/projects/netmodhttp/", tutorialUrl: "https://youtu.be/K9kGPvGb0E0",
        description: "High speed proxy tunnel client for Windows. Supports V2Ray, SSH, VMess, VLess and Trojan protocols with TUN virtual adapter."
      },
      {
        platform: "Android Phone / Tablet", name: "NetMod Syna", badge: "Android 8+", icon: "fa-android", iconColor: "text-emerald-400",
        downloadUrl: "https://play.google.com/store/apps/details?id=com.netmod.syna&pcampaignid=web_share", tutorialUrl: "https://youtu.be/IwqjGQw6xmk",
        description: "Official Android app for importing Vexora Labs configs. One-tap connect, battery-efficient, built-in IP hunt assistant for Mobitel."
      },
      {
        platform: "iPhone / iPad", name: "NPV Tunnel", badge: "iOS 14+", icon: "fa-apple", iconColor: "text-gray-200",
        downloadUrl: "https://apps.apple.com/us/app/npv-tunnel/id1629465476", tutorialUrl: "https://youtu.be/GcYkA3CQ1uY",
        description: "Top rated iOS proxy utility available directly on Apple App Store. Lightweight, no jailbreak required, zero battery drain."
      },
      {
        platform: "MacBook / macOS", name: "Fair VPN", badge: "macOS Ventura / Sonoma", icon: "fa-laptop", iconColor: "text-purple-400",
        downloadUrl: "https://apps.apple.com/us/app/fair-vpn/id1533873488", tutorialUrl: "https://youtu.be/GcYkA3CQ1uY",
        description: "Native macOS client for Apple Silicon M1/M2/M3 and Intel Macs. Easy config URL or file import with instant Singapore connectivity."
      }
    ]
  };

  root.VEXORA_DATA = VEXORA_DATA;
})(typeof window !== 'undefined' ? window : this);