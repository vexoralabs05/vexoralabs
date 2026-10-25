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
      tagline: 'Digital Store • Sri Lanka',
      whatsappNumber: '94727397294',          // international format, digits only
      displayPhone: '+94 72 739 7294',
      currency: 'LKR',
      social: {
        tiktok: 'https://www.tiktok.com/@vexora_lab',
        facebook: 'https://www.facebook.com/share/1FaZW1dVMD/',
        instagram: 'https://instagram.com/vexora_labss',
        telegram: 'https://t.me/vexoralabs'
      }
    },

    /* ---- VPN data plans (valid 30 days) -------------------------------- */
    vpnPlans: [
      { id: 'vpn-100',  label: '100 GB',    gb: 100,  price: 160, tier: 'Starter',    note: 'Light browsing' },
      { id: 'vpn-150',  label: '150 GB',    gb: 150,  price: 200, tier: 'Standard',   note: 'Everyday use' },
      { id: 'vpn-200',  label: '200 GB',    gb: 200,  price: 260, tier: 'Economy',    note: 'Social & video calls' },
      { id: 'vpn-250',  label: '250 GB',    gb: 250,  price: 300, tier: 'Plus',       note: 'Gaming & HD streaming', popular: true },
      { id: 'vpn-300',  label: '300 GB',    gb: 300,  price: 360, tier: 'Advanced',   note: 'Streaming' },
      { id: 'vpn-400',  label: '400 GB',    gb: 400,  price: 400, tier: 'Power User', note: 'Heavy downloads' },
      { id: 'vpn-500',  label: '500 GB',    gb: 500,  price: 500, tier: 'Heavy Duty', note: '4K streaming' },
      { id: 'vpn-unl',  label: 'Unlimited', gb: null, price: 700, tier: 'Ultimate',   note: 'No data limits', vip: true }
    ],

    /* ---- VPN configurations by carrier --------------------------------- */
    /* Replace / extend these with your real config list. Required fields:
       id, name, network (Dialog | Mobitel | SLT | Airtel | Hutch),
       ipType ('Singapore Direct' | 'Sri Lankan IP'), speed                  */
    vpnConfigs: [
      { id: 'cfg-dialog-sg-vless',  name: 'Dialog 4G — Singapore Direct (VLESS)',  network: 'Dialog',  ipType: 'Singapore Direct', speed: 'Up to 100 Mbps' },
      { id: 'cfg-dialog-sg-vmess',  name: 'Dialog 4G — Singapore Direct (VMess)',  network: 'Dialog',  ipType: 'Singapore Direct', speed: 'Up to 100 Mbps' },
      { id: 'cfg-dialog-lk',        name: 'Dialog 4G — Sri Lankan IP',             network: 'Dialog',  ipType: 'Sri Lankan IP',    speed: 'Up to 60 Mbps'  },
      { id: 'cfg-mobitel-sg-vless', name: 'Mobitel 4G — Singapore Direct (VLESS)', network: 'Mobitel', ipType: 'Singapore Direct', speed: 'Up to 100 Mbps' },
      { id: 'cfg-mobitel-sg-trojan',name: 'Mobitel 4G — Singapore Direct (Trojan)',network: 'Mobitel', ipType: 'Singapore Direct', speed: 'Up to 80 Mbps'  },
      { id: 'cfg-mobitel-lk',       name: 'Mobitel 4G — Sri Lankan IP',            network: 'Mobitel', ipType: 'Sri Lankan IP',    speed: 'Up to 60 Mbps'  },
      { id: 'cfg-slt-sg-vless',     name: 'SLT Fibre — Singapore Direct (VLESS)',  network: 'SLT',     ipType: 'Singapore Direct', speed: 'Up to 200 Mbps' },
      { id: 'cfg-slt-sg-vmess',     name: 'SLT 4G / ADSL — Singapore Direct (VMess)', network: 'SLT',  ipType: 'Singapore Direct', speed: 'Up to 100 Mbps' },
      { id: 'cfg-slt-lk',           name: 'SLT Fibre — Sri Lankan IP',             network: 'SLT',     ipType: 'Sri Lankan IP',    speed: 'Up to 100 Mbps' },
      { id: 'cfg-airtel-sg-vless',  name: 'Airtel 4G — Singapore Direct (VLESS)',  network: 'Airtel',  ipType: 'Singapore Direct', speed: 'Up to 80 Mbps'  },
      { id: 'cfg-airtel-lk',        name: 'Airtel 4G — Sri Lankan IP',             network: 'Airtel',  ipType: 'Sri Lankan IP',    speed: 'Up to 50 Mbps'  },
      { id: 'cfg-hutch-sg-vless',   name: 'Hutch 4G — Singapore Direct (VLESS)',   network: 'Hutch',   ipType: 'Singapore Direct', speed: 'Up to 80 Mbps'  },
      { id: 'cfg-hutch-lk',         name: 'Hutch 4G — Sri Lankan IP',              network: 'Hutch',   ipType: 'Sri Lankan IP',    speed: 'Up to 50 Mbps'  }
    ],

    /* ---- Software catalogue -------------------------------------------- */
    /* category: design | ai | office | windows                              */
    softwares: [
      { id: 'soft-canva',  name: 'Canva Pro Account',                 category: 'design',  price: 300,  originalPrice: 1500, badge: 'Best Seller',
        description: 'Premium templates, Magic AI studio, background remover and 100M+ assets.',
        features: ['All premium templates', 'Magic AI design tools', 'Background remover', '1 year warranty'] },
      { id: 'soft-capcut', name: 'CapCut Pro',                        category: 'design',  price: 800,
        description: 'Pro video editing features unlocked, without watermarks.',
        features: ['Pro effects & filters', 'No watermark export', 'Cloud storage', 'Pro features unlocked'] },
      { id: 'soft-adobe',  name: 'Adobe Creative Cloud All Apps',     category: 'design',  price: 3500, badge: 'Hot',
        description: 'Photoshop, Illustrator, Premiere Pro and more in one suite.',
        features: ['20+ creative apps', 'Photoshop & Illustrator', 'Premiere Pro & After Effects', 'Setup help included'] },
      { id: 'soft-gemini', name: 'Google Gemini Advanced / AI Pro',   category: 'ai',      price: 1200, originalPrice: 3200, badge: 'Trending',
        description: 'Google’s most capable AI model, with a long context window and code execution.',
        features: ['Advanced Gemini models', '1M token context window', 'Works from Sri Lanka', 'Setup help included'] },
      { id: 'soft-ms2019', name: 'Microsoft Office 2019 Pro Plus',    category: 'office',  price: 900,
        description: 'Word, Excel, PowerPoint, Outlook and Access for one PC.',
        features: ['Word, Excel, PowerPoint', 'Outlook & Access', 'Offline install', 'Lifetime validity'] },
      { id: 'soft-ms2021', name: 'Microsoft Office 2021 Pro Plus',    category: 'office',  price: 900,
        description: 'The 2021 desktop Office suite with modern collaboration features.',
        features: ['Word, Excel, PowerPoint', 'Outlook, Access & Publisher', 'Offline install', 'Lifetime validity'] },
      { id: 'soft-ms2024', name: 'Microsoft Office 2024 Pro Plus',    category: 'office',  price: 1000, badge: 'New',
        description: 'The latest 2024 edition of the Office desktop suite.',
        features: ['Latest 2024 apps', 'Word, Excel, PowerPoint', 'Outlook & Access', 'Setup help included'] },
      { id: 'soft-win10',  name: 'Windows 10 Pro Key',                category: 'windows', price: 900,
        description: 'Activation key for Windows 10 Pro.',
        features: ['Removes watermark', 'BitLocker & Remote Desktop', 'Lifetime validity', 'Setup help included'] },
      { id: 'soft-win11',  name: 'Windows 11 Pro Key',                category: 'windows', price: 900, originalPrice: 3800, badge: 'Popular',
        description: 'Activation key for Windows 11 Pro.',
        features: ['Removes watermark', 'BitLocker & Remote Desktop', 'Copilot ready', 'Lifetime validity'] }
    ]
  };

  root.VEXORA_DATA = VEXORA_DATA;
})(typeof window !== 'undefined' ? window : this);
