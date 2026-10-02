const today = new Date();
const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(today);
const rupiah = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
const shortDate = (iso) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${iso}T00:00:00`));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const plans = [
  { id: "PLN-001", name: "Fiber Home 20", speed: "20 Mbps", price: 175000, interval: "Bulanan", customers: 42, active: true },
  { id: "PLN-002", name: "Fiber Home 50", speed: "50 Mbps", price: 275000, interval: "Bulanan", customers: 28, active: true },
  { id: "PLN-003", name: "Fiber Pro 100", speed: "100 Mbps", price: 425000, interval: "Bulanan", customers: 12, active: true }
];
const customers = [
  { id: "CUS-0241", name: "Rizky Pratama", email: "rizky.p@email.id", phone: "0812 4455 0192", area: "Cempaka Putih", planId: "PLN-002", status: "active", joined: "2026-02-14" },
  { id: "CUS-0240", name: "Nadia Safitri", email: "nadia.s@email.id", phone: "0813 8810 2234", area: "Rawamangun", planId: "PLN-001", status: "active", joined: "2026-02-12" },
  { id: "CUS-0239", name: "Budi Santoso", email: "budi.s@email.id", phone: "0856 0021 8831", area: "Matraman", planId: "PLN-003", status: "active", joined: "2026-02-10" },
  { id: "CUS-0238", name: "Siti Rahmawati", email: "siti.r@email.id", phone: "0812 9341 2257", area: "Cempaka Putih", planId: "PLN-001", status: "inactive", joined: "2026-02-08" },
  { id: "CUS-0237", name: "Dimas Saputra", email: "dimas.s@email.id", phone: "0821 7720 5581", area: "Senen", planId: "PLN-002", status: "active", joined: "2026-02-04" },
  { id: "CUS-0236", name: "Ayu Lestari", email: "ayu.l@email.id", phone: "0819 6621 0098", area: "Rawamangun", planId: "PLN-001", status: "active", joined: "2026-01-28" }
];
const invoices = [
  { id: `INV-${today.getFullYear()}-0241`, customerId: "CUS-0241", period: monthName, amount: 275000, due: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-10`, status: "pending" },
  { id: `INV-${today.getFullYear()}-0240`, customerId: "CUS-0240", period: monthName, amount: 175000, due: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-08`, status: "paid" },
  { id: `INV-${today.getFullYear()}-0239`, customerId: "CUS-0239", period: monthName, amount: 425000, due: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`, status: "overdue" },
  { id: `INV-${today.getFullYear()}-0238`, customerId: "CUS-0238", period: monthName, amount: 175000, due: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-05`, status: "pending" },
  { id: `INV-${today.getFullYear()}-0237`, customerId: "CUS-0237", period: monthName, amount: 275000, due: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-02`, status: "paid" }
];
const routers = [
  { id: "RTR-001", name: "Gateway Cempaka", host: "192.168.20.1", port: 8729, site: "Cempaka Putih", secretRef: "MIKROTIK_CEMPAKA_SECRET", tls: true },
  { id: "RTR-002", name: "Gateway Rawamangun", host: "192.168.30.1", port: 8729, site: "Rawamangun", secretRef: "MIKROTIK_RAWAMANGUN_SECRET", tls: true }
];
const planMappings = [
  { routerId: "RTR-001", planId: "PLN-001", targetType: "PPP Profile", targetName: "HOME-20M" },
  { routerId: "RTR-001", planId: "PLN-002", targetType: "PPP Profile", targetName: "HOME-50M" },
  { routerId: "RTR-002", planId: "PLN-003", targetType: "Simple Queue", targetName: "PRO-100M" }
];
const acsInstances = [
  { id: "ACS-001", name: "GenieACS Jakarta", baseUrl: "http://genieacs-nbi.internal:7557", site: "Jakarta", secretRef: "GENIEACS_NBI_JAKARTA_SECRET", tls: false },
  { id: "ACS-002", name: "GenieACS Backup", baseUrl: "https://acs-backup.internal:7557", site: "Backup", secretRef: "GENIEACS_NBI_BACKUP_SECRET", tls: true }
];
const deviceLinks = [
  { id: "DEV-001", customerId: "CUS-0241", acsId: "ACS-001", deviceId: "00236D-ABCDEF123456", manufacturer: "Huawei", model: "HG8245H5", lastInform: "2026-10-02T08:42:00" },
  { id: "DEV-002", customerId: "CUS-0240", acsId: "ACS-001", deviceId: "ZTEGCC-1234567890AB", manufacturer: "ZTE", model: "F670L", lastInform: "2026-10-02T08:31:00" },
  { id: "DEV-003", customerId: "CUS-0237", acsId: "ACS-002", deviceId: "TPLINK-AB1234567890", manufacturer: "TP-Link", model: "Archer C5v", lastInform: "2026-10-01T22:16:00" }
];
let currentPage = "dashboard";
let activeModal = null;
let toastTimer;
let invoiceSequence = 242;

const pageContent = document.querySelector("#page-content");
const modal = document.querySelector("#form-modal");
const modalFields = document.querySelector("#modal-fields");
const entityForm = document.querySelector("#entity-form");

function customerFor(id) { return customers.find((customer) => customer.id === id); }
function planFor(id) { return plans.find((plan) => plan.id === id); }
function customerName(id) { return customerFor(id)?.name || "Pelanggan tidak ditemukan"; }
function statusTag(status) {
  const labels = { active: "Aktif", inactive: "Nonaktif", paid: "Lunas", pending: "Menunggu", overdue: "Terlambat", draft: "Draft" };
  return `<span class="status status-${escapeHtml(status)}">${labels[status] || escapeHtml(status)}</span>`;
}
function initials(name) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function customerCell(customer, index) {
  return `<div class="person-cell"><span class="avatar-mini color-${index % 4}">${escapeHtml(initials(customer.name))}</span><span><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.id)}</small></span></div>`;
}
function heading(eyebrow, title, subtitle, action = "") {
  return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</div>`;
}
function emptyRow(columns, message) {
  return `<tr><td colspan="${columns}"><div class="empty-state">${message}</div></td></tr>`;
}
function invoiceRows(source) {
  if (!source.length) return emptyRow(6, "Belum ada tagihan yang cocok.");
  return source.map((invoice) => {
    const customer = customerFor(invoice.customerId);
    return `<tr>
      <td><strong>${escapeHtml(invoice.id)}</strong></td>
      <td>${customer ? customerCell(customer, 0) : escapeHtml(invoice.customerId)}</td>
      <td>${escapeHtml(invoice.period)}</td>
      <td>${rupiah(invoice.amount)}</td>
      <td>${shortDate(invoice.due)}</td>
      <td>${statusTag(invoice.status)}</td>
      <td>${invoice.status === "pending" || invoice.status === "overdue" ? `<button class="row-action" data-action="mark-paid" data-id="${escapeHtml(invoice.id)}">Tandai lunas</button>` : "—"}</td>
    </tr>`;
  }).join("");
}
function customerRows(source) {
  if (!source.length) return emptyRow(6, "Pelanggan tidak ditemukan.");
  return source.map((customer, index) => {
    const plan = planFor(customer.planId);
    return `<tr>
      <td>${customerCell(customer, index)}</td>
      <td>${escapeHtml(customer.phone)}</td>
      <td>${escapeHtml(plan?.name || "Belum ada paket")}</td>
      <td>${escapeHtml(customer.area)}</td>
      <td>${statusTag(customer.status)}</td>
      <td>${shortDate(customer.joined)}</td>
    </tr>`;
  }).join("");
}
function statsGrid() {
  const activeCustomers = customers.filter((customer) => customer.status === "active").length;
  const outstanding = invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const metrics = [
    ["Total pelanggan aktif", activeCustomers.toLocaleString("id-ID"), "♙", "Terdaftar di sistem"],
    ["Tagihan belum dibayar", rupiah(outstanding), "◷", `${invoices.filter((invoice) => invoice.status === "overdue").length} tagihan melewati jatuh tempo`],
    ["Pendapatan bulan ini", rupiah(paid), "↗", `Periode ${monthName}`],
    ["Paket aktif", plans.filter((plan) => plan.active).length.toLocaleString("id-ID"), "◈", "Tersedia untuk pelanggan"]
  ];
  return `<div class="stats-grid">${metrics.map(([label, value, icon, foot]) => `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-foot">${foot}</div></article>`).join("")}</div>`;
}
function renderDashboard() {
  const recentInvoices = [...invoices].slice(0, 4);
  return `${heading("RINGKASAN BISNIS", "Selamat pagi, Dina 👋", `Berikut kondisi billing ${escapeHtml(monthName)}.` , `<button class="button button-primary" data-action="create-invoice"><span class="button-symbol">＋</span> Buat tagihan</button>`)}
    ${statsGrid()}
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-heading"><div><h2>Tagihan terbaru</h2><p>Pantau status pembayaran pelanggan</p></div><button class="text-link" data-nav="invoices">Lihat semua →</button></div>
        <div class="table-wrap"><table><thead><tr><th>ID TAGIHAN</th><th>PELANGGAN</th><th>JATUH TEMPO</th><th>JUMLAH</th><th>STATUS</th></tr></thead><tbody>${recentInvoices.map((invoice) => {
          const customer = customerFor(invoice.customerId);
          return `<tr><td><strong>${escapeHtml(invoice.id)}</strong></td><td>${customer ? customerCell(customer, 0) : escapeHtml(invoice.customerId)}</td><td>${shortDate(invoice.due)}</td><td>${rupiah(invoice.amount)}</td><td>${statusTag(invoice.status)}</td></tr>`;
        }).join("")}</tbody></table></div>
      </section>
      <section class="panel activity-panel">
        <div class="panel-heading"><div><h2>Aktivitas terbaru</h2><p>Pembaruan hari ini</p></div><button class="text-link" data-action="activity-info">•••</button></div>
        <div class="activity-list">
          <div class="activity-item"><span class="activity-mark">✓</span><div class="activity-copy"><strong>Pembayaran diterima</strong><br>INV-${today.getFullYear()}-0240 · ${rupiah(175000)}<small>12 menit lalu</small></div></div>
          <div class="activity-item"><span class="activity-mark warn">＋</span><div class="activity-copy"><strong>Pelanggan baru ditambahkan</strong><br>Rizky Pratama · Fiber Home 50<small>1 jam lalu</small></div></div>
          <div class="activity-item"><span class="activity-mark">▤</span><div class="activity-copy"><strong>Tagihan dibuat</strong><br>${escapeHtml(monthName)} · 5 tagihan<small>Hari ini, 08.30</small></div></div>
        </div>
      </section>
    </div>
    <div class="prototype-note" id="prototype-note">Tampilan prototipe dengan data contoh. Data hanya tersimpan selama halaman terbuka dan belum terhubung ke server atau GenieACS.</div>`;
}
function renderCustomers() {
  const action = `<button class="button button-primary" data-action="add-customer"><span class="button-symbol">＋</span> Tambah pelanggan</button>`;
  return `${heading("MANAJEMEN PELANGGAN", "Pelanggan", "Kelola akun pelanggan dan paket internet yang digunakan.", action)}
    <section class="panel">
      <div class="table-toolbar"><div class="toolbar-group"><label class="search-box"><span>⌕</span><input id="table-search" type="search" placeholder="Cari nama, ID, atau nomor..." aria-label="Cari pelanggan"></label><select class="filter-select" id="status-filter" aria-label="Filter status"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></div><div class="toolbar-group"><button class="button button-secondary" data-action="export-customers">↓ Ekspor</button></div></div>
      <div class="table-wrap"><table class="table-main"><thead><tr><th>NAMA PELANGGAN</th><th>NOMOR TELEPON</th><th>PAKET</th><th>AREA</th><th>STATUS</th><th>BERGABUNG</th></tr></thead><tbody id="table-body">${customerRows(customers)}</tbody></table></div>
    </section>
    <div class="prototype-note">Data demo. Tambah pelanggan hanya mengubah data sementara di browser.</div>`;
}
function renderPlans() {
  const action = `<button class="button button-primary" data-action="add-plan"><span class="button-symbol">＋</span> Tambah paket</button>`;
  return `${heading("KATALOG LAYANAN", "Paket internet", "Atur pilihan paket dan harga layanan untuk pelanggan.", action)}
    <div class="plan-grid">${plans.map((plan, index) => `<article class="plan-card">
      <div class="plan-card-header"><span class="stat-icon">${["⌁", "◉", "✳"][index % 3]}</span>${statusTag(plan.active ? "active" : "inactive")}</div>
      <h2>${escapeHtml(plan.name)}</h2><p>Paket internet fiber untuk koneksi stabil di rumah maupun usaha.</p>
      <div class="plan-price">${rupiah(plan.price)}<small> / ${escapeHtml(plan.interval.toLowerCase())}</small></div>
      <div class="plan-meta"><span>Kecepatan</span><strong>${escapeHtml(plan.speed)}</strong></div>
      <div class="plan-card-footer"><span class="stat-foot">${plan.customers} pelanggan</span><button class="row-action" data-action="plan-info" data-id="${escapeHtml(plan.id)}">Detail paket</button></div>
    </article>`).join("")}</div>
    <div class="prototype-note">Harga dan paket pada layar ini adalah data contoh, belum menjadi katalog layanan aktif.</div>`;
}
function renderInvoices() {
  const outstanding = invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
  const action = `<button class="button button-primary" data-action="create-invoice"><span class="button-symbol">＋</span> Buat tagihan</button>`;
  return `${heading("PENAGIHAN", "Tagihan", "Kelola tagihan bulanan dan pantau status pembayarannya.", action)}
    <div class="invoice-highlight"><div><p>Total tagihan belum lunas · ${escapeHtml(monthName)}</p><strong>${rupiah(outstanding)}</strong><span class="highlight-note">${invoices.filter((invoice) => invoice.status !== "paid").length} tagihan belum lunas</span></div><button class="button button-secondary" data-action="create-invoice">＋ Generate tagihan bulan ini</button></div>
    <section class="panel">
      <div class="table-toolbar"><div class="toolbar-group"><label class="search-box"><span>⌕</span><input id="table-search" type="search" placeholder="Cari ID atau pelanggan..." aria-label="Cari tagihan"></label><select class="filter-select" id="status-filter" aria-label="Filter status"><option value="all">Semua status</option><option value="pending">Menunggu</option><option value="paid">Lunas</option><option value="overdue">Terlambat</option></select></div><div class="toolbar-group"><button class="button button-secondary" data-action="export-invoices">↓ Ekspor</button></div></div>
      <div class="table-wrap"><table class="table-main"><thead><tr><th>ID TAGIHAN</th><th>PELANGGAN</th><th>PERIODE</th><th>JUMLAH</th><th>JATUH TEMPO</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody id="table-body">${invoiceRows(invoices)}</tbody></table></div>
    </section>
    <div class="prototype-note">Generate tagihan memakai pelanggan dan paket contoh. Di aplikasi produksi, pembuatan tagihan wajib idempoten per periode.</div>`;
}

function renderRouters() {
  const action = `<button class="button button-primary" data-action="add-router"><span class="button-symbol">＋</span> Tambah router</button>`;
  const routerCards = routers.length ? routers.map((router) => `<article class="router-card">
    <div class="router-card-top"><span class="router-glyph">⌁</span><span class="router-demo-state">Contoh · belum diuji</span></div>
    <h2>${escapeHtml(router.name)}</h2><p class="router-site">${escapeHtml(router.site)}</p>
    <div class="router-endpoint"><span class="router-led"></span><code>${escapeHtml(router.host)}:${router.port}</code><span class="protocol-badge">${router.tls ? "API-SSL" : "API"}</span></div>
    <div class="router-details"><div><span>Referensi secret</span><strong>${escapeHtml(router.secretRef)}</strong></div><div><span>Port API</span><strong>${router.port} · ${router.tls ? "TLS aktif" : "Tanpa TLS"}</strong></div></div>
    <div class="router-card-footer"><span class="router-caption">Kredensial tidak disimpan di UI</span><button class="button button-secondary button-small" data-action="test-router" data-id="${escapeHtml(router.id)}">Uji koneksi · demo</button></div>
  </article>`).join("") : `<div class="empty-state">Belum ada router. Tambahkan metadata dan referensi secret dari backend.</div>`;
  const mappingRows = planMappings.length ? planMappings.map((mapping) => {
    const router = routers.find((entry) => entry.id === mapping.routerId);
    const plan = planFor(mapping.planId);
    if (!router || !plan) return "";
    return `<tr><td><strong>${escapeHtml(plan.name)}</strong><small class="table-subline">${escapeHtml(plan.speed)} · ${rupiah(plan.price)}/bulan</small></td><td>${escapeHtml(router.name)}<small class="table-subline">${escapeHtml(router.site)}</small></td><td><span class="mapping-type">${escapeHtml(mapping.targetType)}</span></td><td><code class="mapping-code">${escapeHtml(mapping.targetName)}</code></td><td><span class="status status-draft">Contoh</span></td></tr>`;
  }).join("") : emptyRow(5, "Belum ada pemetaan paket.");
  return `${heading("AKSES JARINGAN", "Router MikroTik", "Kelola metadata router dan pemetaan paket ke profil layanan.", action)}
    <section class="router-notice"><span class="router-notice-icon">i</span><div><strong>Mode prototipe — tidak ada koneksi ke router</strong><p>Uji koneksi dan konfigurasi di bawah hanya interaksi demo. Koneksi produksi harus dijalankan oleh backend dengan API-SSL, firewall management, dan secret dari vault.</p></div></section>
    <div class="router-overview">
      <div><span class="eyebrow">ROUTER TERDAFTAR</span><strong>${routers.length}</strong><small>metadata contoh</small></div>
      <div><span class="eyebrow">PEMETAAN PAKET</span><strong>${planMappings.length}</strong><small>profil layanan contoh</small></div>
      <div><span class="eyebrow">KREDENSIAL</span><strong>Backend only</strong><small>rahasia tidak disimpan di browser</small></div>
    </div>
    <div class="section-heading"><div><h2>Router terdaftar</h2><p>Batasi akses alamat manajemen router hanya dari jaringan backend billing.</p></div></div>
    <div class="router-grid">${routerCards}</div>
    <section class="panel router-mappings">
      <div class="panel-heading"><div><h2>Pemetaan paket ke profil router</h2><p>Hubungkan paket billing ke PPP Profile atau Simple Queue yang sudah dibuat di MikroTik.</p></div><button class="button button-secondary button-small" data-action="add-mapping" ${!routers.length || !plans.length ? "disabled" : ""}>＋ Tambah pemetaan</button></div>
      <div class="table-wrap"><table class="table-main"><thead><tr><th>PAKET BILLING</th><th>ROUTER</th><th>JENIS TARGET</th><th>NAMA TARGET</th><th>STATUS</th></tr></thead><tbody>${mappingRows}</tbody></table></div>
    </section>
    <div class="router-flow"><div class="router-flow-title"><span class="eyebrow">BATAS OTOMATISASI</span><strong>Billing tidak langsung memutus pelanggan</strong></div><p>Invoice terlambat tidak otomatis menonaktifkan PPPoE atau queue. Kebijakan masa tenggang, status penangguhan, persetujuan operator, dan pemulihan layanan harus ditentukan sebelum backend mengirim perubahan ke router.</p></div>`;
}

function deviceLinkRows(source) {
  if (!source.length) return emptyRow(6, "Belum ada perangkat yang terhubung ke pelanggan.");
  return source.map((device) => {
    const customer = customerFor(device.customerId);
    const acs = acsInstances.find((entry) => entry.id === device.acsId);
    return `<tr>
      <td><strong>${escapeHtml(device.deviceId)}</strong><small class="table-subline">${escapeHtml(device.id)}</small></td>
      <td>${escapeHtml(device.manufacturer)} <strong>${escapeHtml(device.model)}</strong></td>
      <td>${customer ? customerCell(customer, 0) : escapeHtml(device.customerId)}</td>
      <td>${escapeHtml(acs?.name || "ACS tidak ditemukan")}</td>
      <td>${shortDate(device.lastInform.slice(0, 10))}<small class="table-subline">${escapeHtml(device.lastInform.slice(11, 16))} · data contoh</small></td>
      <td><button class="row-action" data-action="unlink-device" data-id="${escapeHtml(device.id)}">Lepas tautan</button></td>
    </tr>`;
  }).join("");
}
function renderGenieacs() {
  const action = `<button class="button button-primary" data-action="add-acs"><span class="button-symbol">＋</span> Tambah koneksi ACS</button>`;
  const acsCards = acsInstances.length ? acsInstances.map((acs) => `<article class="acs-card">
    <div class="acs-card-top"><span class="acs-glyph">◉</span><span class="router-demo-state">Contoh · belum disinkronkan</span></div>
    <h2>${escapeHtml(acs.name)}</h2><p class="router-site">${escapeHtml(acs.site)}</p>
    <div class="router-endpoint"><span class="router-led"></span><code>${escapeHtml(acs.baseUrl)}</code><span class="protocol-badge">${acs.tls ? "HTTPS" : "HTTP"}</span></div>
    <div class="router-details"><div><span>Referensi secret backend</span><strong>${escapeHtml(acs.secretRef)}</strong></div><div><span>Perangkat tertaut</span><strong>${deviceLinks.filter((device) => device.acsId === acs.id).length} perangkat</strong></div></div>
    <div class="router-card-footer"><span class="router-caption">NBI hanya diakses backend</span><button class="button button-secondary button-small" data-action="sync-acs" data-id="${escapeHtml(acs.id)}">Sinkronisasi · demo</button></div>
  </article>`).join("") : `<div class="empty-state">Belum ada koneksi ACS. Tambahkan URL NBI internal dan referensi secret backend.</div>`;
  return `${heading("INVENTARIS PERANGKAT", "GenieACS", "Hubungkan identitas pelanggan billing dengan perangkat CPE yang dikelola ACS.", action)}
    <section class="router-notice acs-notice"><span class="router-notice-icon">i</span><div><strong>Mode prototipe — NBI tidak dipanggil dari browser</strong><p>URL dan perangkat di bawah hanya contoh. Integrasi produksi harus memakai adapter backend ke GenieACS NBI yang berada di jaringan privat. NBI tidak boleh diekspos langsung ke internet.</p></div></section>
    <div class="router-overview">
      <div><span class="eyebrow">KONEKSI ACS</span><strong>${acsInstances.length}</strong><small>metadata contoh</small></div>
      <div><span class="eyebrow">PERANGKAT TERTAUT</span><strong>${deviceLinks.length}</strong><small>dari data contoh</small></div>
      <div><span class="eyebrow">SUMBER IDENTITAS</span><strong>Device ID</strong><small>dipetakan ke akun billing</small></div>
    </div>
    <div class="section-heading"><div><h2>Instance GenieACS</h2><p>Konfigurasikan URL NBI internal; browser tidak menghubungi endpoint ini.</p></div></div>
    <div class="acs-grid">${acsCards}</div>
    <section class="panel router-mappings">
      <div class="panel-heading"><div><h2>Pemetaan CPE ke pelanggan</h2><p>Hubungkan serial / device ID dari GenieACS dengan akun billing yang tepat.</p></div><button class="button button-secondary button-small" data-action="link-device" ${!acsInstances.length || !customers.length ? "disabled" : ""}>＋ Tautkan perangkat</button></div>
      <div class="table-toolbar"><label class="search-box"><span>⌕</span><input id="device-table-search" type="search" placeholder="Cari device ID atau pelanggan..." aria-label="Cari perangkat GenieACS"></label></div>
      <div class="table-wrap"><table class="table-main"><thead><tr><th>DEVICE ID / SERIAL</th><th>MODEL CPE</th><th>AKUN BILLING</th><th>INSTANCE ACS</th><th>INFORM TERAKHIR</th><th>AKSI</th></tr></thead><tbody id="device-table-body">${deviceLinkRows(deviceLinks)}</tbody></table></div>
    </section>
    <div class="router-flow"><div class="router-flow-title"><span class="eyebrow">BATAS INTEGRASI</span><strong>ACS mengelola CPE; billing mengelola akun</strong></div><p>Gunakan NBI untuk membaca identitas perangkat sesuai kebutuhan. Jangan menganggap device ID sebagai identitas pelanggan tanpa verifikasi operator. Sinkronisasi dan provisioning harus idempoten, tercatat, serta berjalan di backend dengan akses terbatas.</p></div>`;
}

const renderers = { dashboard: renderDashboard, customers: renderCustomers, plans: renderPlans, invoices: renderInvoices, routers: renderRouters, genieacs: renderGenieacs };
const pageNames = { dashboard: "Ringkasan", customers: "Pelanggan", plans: "Paket internet", invoices: "Tagihan", routers: "Router MikroTik", genieacs: "GenieACS" };
function renderPage(page = currentPage) {
  currentPage = page;
  pageContent.innerHTML = renderers[page]();
  document.querySelector("#breadcrumb-current").textContent = pageNames[page];
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
  document.querySelector("#customer-count").textContent = customers.length;
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}
function openModal(type) {
  activeModal = type;
  if (type === "acs") {
    document.querySelector("#modal-eyebrow").textContent = "GENIEACS NBI";
    document.querySelector("#modal-title").textContent = "Tambah koneksi GenieACS";
    document.querySelector("#modal-submit").textContent = "Simpan metadata";
    modalFields.innerHTML = `<div class="form-fields">
      <div class="field-group"><label for="acsName">Nama koneksi</label><input class="field-input" id="acsName" name="acsName" required maxlength="60" placeholder="Contoh: GenieACS Jakarta"></div>
      <div class="field-group"><label for="acsUrl">URL dasar NBI</label><input class="field-input" id="acsUrl" name="acsUrl" type="url" required maxlength="240" placeholder="https://genieacs-nbi.internal:7557"></div>
      <div class="field-group"><label for="acsSite">Lokasi / site</label><input class="field-input" id="acsSite" name="acsSite" required maxlength="60" placeholder="Contoh: Jakarta"></div>
      <div class="field-group"><label for="acsSecretRef">Referensi secret / proxy auth backend</label><input class="field-input" id="acsSecretRef" name="acsSecretRef" required maxlength="64" pattern="[A-Z][A-Z0-9_]{2,63}" placeholder="GENIEACS_NBI_SITE_SECRET"><small class="field-hint">Nama referensi saja, jangan masukkan API key atau password ke form browser.</small></div>
      <div class="acs-form-warning">NBI dapat mengubah perangkat dan sering tidak menyediakan autentikasi aplikasi bawaan. Isolasi jaringan dan lindungi dengan firewall / reverse proxy.</div>
    </div>`;
    modal.showModal();
    modal.querySelector("input")?.focus();
    return;
  }
  if (type === "device-link") {
    document.querySelector("#modal-eyebrow").textContent = "IDENTITAS CPE";
    document.querySelector("#modal-title").textContent = "Tautkan perangkat ke pelanggan";
    document.querySelector("#modal-submit").textContent = "Simpan tautan";
    modalFields.innerHTML = `<div class="form-fields">
      <div class="field-group"><label for="deviceAcsId">Instance GenieACS</label><select class="field-select" id="deviceAcsId" name="deviceAcsId" required>${acsInstances.map((acs) => `<option value="${escapeHtml(acs.id)}">${escapeHtml(acs.name)} — ${escapeHtml(acs.site)}</option>`).join("")}</select></div>
      <div class="field-group"><label for="deviceId">Device ID / serial number persis dari GenieACS</label><input class="field-input" id="deviceId" name="deviceId" required maxlength="160" placeholder="Contoh: 00236D-ABCDEF123456"><small class="field-hint">Pastikan device ID unik di instance ACS yang dipilih.</small></div>
      <div class="field-grid"><div class="field-group"><label for="manufacturer">Manufacturer</label><input class="field-input" id="manufacturer" name="manufacturer" maxlength="80" placeholder="Huawei"></div><div class="field-group"><label for="deviceModel">Model</label><input class="field-input" id="deviceModel" name="deviceModel" maxlength="80" placeholder="HG8245H5"></div></div>
      <div class="field-group"><label for="deviceCustomerId">Akun pelanggan billing</label><select class="field-select" id="deviceCustomerId" name="deviceCustomerId" required>${customers.filter((customer) => customer.status === "active").map((customer) => `<option value="${escapeHtml(customer.id)}">${escapeHtml(customer.name)} — ${escapeHtml(customer.id)}</option>`).join("")}</select></div>
      <div class="acs-form-warning">Tautan ini contoh lokal. Device ID perlu diverifikasi operator sebelum provisioning atau perubahan layanan.</div>
    </div>`;
    modal.showModal();
    modal.querySelector("input")?.focus();
    return;
  }
  if (type === "router") {
    document.querySelector("#modal-eyebrow").textContent = "KONEKSI MANAJEMEN";
    document.querySelector("#modal-title").textContent = "Tambah router MikroTik";
    document.querySelector("#modal-submit").textContent = "Simpan metadata";
    modalFields.innerHTML = `<div class="form-fields">
      <div class="field-group"><label for="routerName">Nama router</label><input class="field-input" id="routerName" name="routerName" required maxlength="60" placeholder="Contoh: Gateway Cempaka"></div>
      <div class="field-grid"><div class="field-group"><label for="routerHost">Alamat manajemen</label><input class="field-input" id="routerHost" name="routerHost" required maxlength="253" placeholder="router.internal atau IP"></div><div class="field-group"><label for="routerPort">Port API</label><input class="field-input" id="routerPort" name="routerPort" type="number" min="1" max="65535" value="8729" required></div></div>
      <div class="field-group"><label for="routerSite">Lokasi / site</label><input class="field-input" id="routerSite" name="routerSite" required maxlength="60" placeholder="Contoh: Cempaka Putih"></div>
      <div class="field-group"><label for="secretRef">Nama referensi secret backend</label><input class="field-input" id="secretRef" name="secretRef" required maxlength="64" pattern="[A-Z][A-Z0-9_]{2,63}" placeholder="MIKROTIK_SITE_SECRET"><small class="field-hint">Masukkan nama secret manager saja, bukan username atau password router.</small></div>
      <label class="security-check"><input type="checkbox" name="tls" checked><span><strong>Gunakan API-SSL / TLS</strong><small>Backend perlu memverifikasi sertifikat router.</small></span></label>
      <div class="router-form-warning">Data hanya disimpan di memori prototipe. Koneksi produksi harus ditangani backend.</div>
    </div>`;
    modal.showModal();
    modal.querySelector("input")?.focus();
    return;
  }
  if (type === "mapping") {
    document.querySelector("#modal-eyebrow").textContent = "PEMETAAN LAYANAN";
    document.querySelector("#modal-title").textContent = "Peta paket ke profil router";
    document.querySelector("#modal-submit").textContent = "Simpan pemetaan";
    modalFields.innerHTML = `<div class="form-fields">
      <div class="field-group"><label for="mappingPlan">Paket billing</label><select class="field-select" id="mappingPlan" name="mappingPlan" required>${plans.map((plan) => `<option value="${escapeHtml(plan.id)}">${escapeHtml(plan.name)} — ${escapeHtml(plan.speed)}</option>`).join("")}</select></div>
      <div class="field-group"><label for="mappingRouter">Router</label><select class="field-select" id="mappingRouter" name="mappingRouter" required>${routers.map((router) => `<option value="${escapeHtml(router.id)}">${escapeHtml(router.name)} — ${escapeHtml(router.site)}</option>`).join("")}</select></div>
      <div class="field-group"><label for="targetType">Jenis target RouterOS</label><select class="field-select" id="targetType" name="targetType" required><option>PPP Profile</option><option>Simple Queue</option></select></div>
      <div class="field-group"><label for="targetName">Nama profil / queue di router</label><input class="field-input" id="targetName" name="targetName" required maxlength="80" placeholder="Contoh: HOME-50M"></div>
      <div class="router-form-warning">Pemetaan hanya dicatat di prototipe; perubahan konfigurasi pelanggan tidak dikirim ke MikroTik.</div>
    </div>`;
    modal.showModal();
    modal.querySelector("input")?.focus();
    return;
  }
  const isCustomer = type === "customer";
  document.querySelector("#modal-eyebrow").textContent = isCustomer ? "DATA PELANGGAN" : "KATALOG LAYANAN";
  document.querySelector("#modal-title").textContent = isCustomer ? "Tambah pelanggan" : "Tambah paket";
  document.querySelector("#modal-submit").textContent = isCustomer ? "Simpan pelanggan" : "Simpan paket";
  modalFields.innerHTML = isCustomer ? `<div class="form-fields">
    <div class="field-group"><label for="name">Nama lengkap</label><input class="field-input" id="name" name="name" required maxlength="80" placeholder="Contoh: Budi Santoso"></div>
    <div class="field-group"><label for="phone">Nomor telepon</label><input class="field-input" id="phone" name="phone" required maxlength="24" placeholder="08xx xxxx xxxx"></div>
    <div class="field-group"><label for="email">Email <span class="field-hint">(opsional)</span></label><input class="field-input" id="email" name="email" type="email" maxlength="120" placeholder="nama@email.id"></div>
    <div class="field-group"><label for="area">Area layanan</label><input class="field-input" id="area" name="area" required maxlength="60" placeholder="Contoh: Cempaka Putih"></div>
    <div class="field-group"><label for="planId">Paket internet</label><select class="field-select" id="planId" name="planId" required>${plans.map((plan) => `<option value="${escapeHtml(plan.id)}">${escapeHtml(plan.name)} — ${rupiah(plan.price)}</option>`).join("")}</select></div>
  </div>` : `<div class="form-fields">
    <div class="field-group"><label for="planName">Nama paket</label><input class="field-input" id="planName" name="planName" required maxlength="60" placeholder="Contoh: Fiber Home 30"></div>
    <div class="field-group"><label for="speed">Kecepatan</label><input class="field-input" id="speed" name="speed" required maxlength="20" placeholder="Contoh: 30 Mbps"></div>
    <div class="field-group"><label for="price">Harga bulanan (Rp)</label><input class="field-input" id="price" name="price" type="number" min="1" step="1000" required placeholder="200000"></div>
  </div>`;
  modal.showModal();
  modal.querySelector("input")?.focus();
}
function createInvoice() {
  const activeCustomers = customers.filter((customer) => customer.status === "active");
  const created = [];
  activeCustomers.forEach((customer) => {
    const exists = invoices.some((invoice) => invoice.customerId === customer.id && invoice.period === monthName);
    const plan = planFor(customer.planId);
    if (exists || !plan) return;
    const due = new Date(today.getFullYear(), today.getMonth(), 10);
    invoices.unshift({
      id: `INV-${today.getFullYear()}-${String(invoiceSequence++).padStart(4, "0")}`,
      customerId: customer.id,
      period: monthName,
      amount: plan.price,
      due: `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}`,
      status: "pending"
    });
    created.push(customer.id);
  });
  renderPage("invoices");
  showToast(created.length ? `${created.length} tagihan contoh berhasil dibuat.` : "Tidak ada tagihan baru untuk periode ini.");
}
function filterCurrentTable() {
  const search = document.querySelector("#table-search");
  const statusFilter = document.querySelector("#status-filter");
  const body = document.querySelector("#table-body");
  if (!search || !statusFilter || !body) return;
  const query = search.value.trim().toLowerCase();
  const status = statusFilter.value;
  if (currentPage === "customers") {
    const filtered = customers.filter((customer) => {
      const matchesSearch = [customer.name, customer.id, customer.phone, customer.email, customer.area].join(" ").toLowerCase().includes(query);
      return matchesSearch && (status === "all" || customer.status === status);
    });
    body.innerHTML = customerRows(filtered);
  } else {
    const filtered = invoices.filter((invoice) => [invoice.id, customerName(invoice.customerId), invoice.period].join(" ").toLowerCase().includes(query) && (status === "all" || invoice.status === status));
    body.innerHTML = invoiceRows(filtered);
  }
}
function filterDeviceTable() {
  const search = document.querySelector("#device-table-search");
  const body = document.querySelector("#device-table-body");
  if (!search || !body) return;
  const query = search.value.trim().toLowerCase();
  body.innerHTML = deviceLinkRows(deviceLinks.filter((device) => {
    const customer = customerFor(device.customerId);
    const acs = acsInstances.find((entry) => entry.id === device.acsId);
    return [device.deviceId, device.manufacturer, device.model, customer?.name, customer?.id, acs?.name].join(" ").toLowerCase().includes(query);
  }));
}
function exportCurrent() {
  const rows = currentPage === "customers"
    ? [["ID", "Nama", "Telepon", "Email", "Area", "Paket", "Status"], ...customers.map((customer) => [customer.id, customer.name, customer.phone, customer.email, customer.area, planFor(customer.planId)?.name || "", customer.status])]
    : [["ID", "Pelanggan", "Periode", "Jumlah", "Jatuh tempo", "Status"], ...invoices.map((invoice) => [invoice.id, customerName(invoice.customerId), invoice.period, invoice.amount, invoice.due, invoice.status])];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${currentPage}-${monthKey}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("File CSV berhasil diunduh.");
}

document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  renderPage(button.dataset.page);
  document.querySelector("#sidebar").classList.remove("open");
}));
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(today);
pageContent.addEventListener("input", () => { filterCurrentTable(); filterDeviceTable(); });
pageContent.addEventListener("change", filterCurrentTable);
pageContent.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) { renderPage(nav.dataset.nav); return; }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  switch (action.dataset.action) {
    case "add-customer": openModal("customer"); break;
    case "add-plan": openModal("plan"); break;
    case "add-router": openModal("router"); break;
    case "add-mapping":
      if (routers.length && plans.length) openModal("mapping");
      else showToast("Tambahkan router dan paket terlebih dahulu.");
      break;
    case "test-router": {
      const router = routers.find((entry) => entry.id === action.dataset.id);
      if (router) showToast(`Simulasi saja: browser tidak menghubungi ${router.host}:${router.port}.`);
      break;
    }
    case "add-acs": openModal("acs"); break;
    case "link-device":
      if (acsInstances.length && customers.some((customer) => customer.status === "active")) openModal("device-link");
      else showToast("Tambahkan koneksi ACS dan pelanggan aktif terlebih dahulu.");
      break;
    case "sync-acs": {
      const acs = acsInstances.find((entry) => entry.id === action.dataset.id);
      if (acs) showToast(`Simulasi: browser tidak meminta data ke ${acs.name}.`);
      break;
    }
    case "unlink-device": {
      const index = deviceLinks.findIndex((device) => device.id === action.dataset.id);
      if (index >= 0 && window.confirm("Lepas tautan perangkat demo dari pelanggan?")) {
        deviceLinks.splice(index, 1);
        renderPage("genieacs");
        showToast("Tautan demo perangkat dihapus.");
      }
      break;
    }
    case "create-invoice": createInvoice(); break;
    case "export-customers":
    case "export-invoices": exportCurrent(); break;
    case "mark-paid": {
      const invoice = invoices.find((entry) => entry.id === action.dataset.id);
      if (invoice) { invoice.status = "paid"; renderPage("invoices"); showToast("Status tagihan demo diperbarui menjadi lunas."); }
      break;
    }
    case "plan-info": {
      const plan = planFor(action.dataset.id);
      if (plan) showToast(`${plan.name} · ${plan.speed} · ${rupiah(plan.price)} per bulan.`);
      break;
    }
    case "activity-info": showToast("Aktivitas ini adalah data contoh."); break;
  }
});
entityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(entityForm);
  if (activeModal === "acs") {
    const rawUrl = String(values.get("acsUrl")).trim();
    let endpoint;
    try { endpoint = new URL(rawUrl); } catch { showToast("Masukkan URL NBI yang valid."); return; }
    if (!["http:", "https:"].includes(endpoint.protocol) || endpoint.username || endpoint.password) { showToast("Gunakan URL HTTP(S) tanpa kredensial di alamat."); return; }
    const secretRef = String(values.get("acsSecretRef")).trim();
    if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(secretRef)) { showToast("Gunakan referensi secret backend yang valid."); return; }
    acsInstances.push({
      id: `ACS-${String(acsInstances.length + 1).padStart(3, "0")}`,
      name: String(values.get("acsName")).trim(),
      baseUrl: endpoint.toString().replace(/\/$/, ""),
      site: String(values.get("acsSite")).trim(),
      secretRef,
      tls: endpoint.protocol === "https:"
    });
    renderPage("genieacs");
    showToast("Metadata ACS demo disimpan; NBI belum dihubungi.");
  } else if (activeModal === "device-link") {
    const acsId = String(values.get("deviceAcsId"));
    const customerId = String(values.get("deviceCustomerId"));
    const deviceId = String(values.get("deviceId")).trim();
    const acs = acsInstances.find((entry) => entry.id === acsId);
    const customer = customerFor(customerId);
    if (!acs || !customer || customer.status !== "active") { showToast("Pilih ACS dan pelanggan aktif yang tersedia."); return; }
    if (deviceLinks.some((entry) => entry.acsId === acsId && entry.deviceId.toLowerCase() === deviceId.toLowerCase())) { showToast("Device ID tersebut sudah tertaut di instance ACS ini."); return; }
    deviceLinks.unshift({
      id: `DEV-${String(Math.max(0, ...deviceLinks.map((entry) => Number(entry.id.slice(-3)))) + 1).padStart(3, "0")}`,
      customerId,
      acsId,
      deviceId,
      manufacturer: String(values.get("manufacturer")).trim() || "Belum diketahui",
      model: String(values.get("deviceModel")).trim() || "Belum diketahui",
      lastInform: today.toISOString().slice(0, 16)
    });
    renderPage("genieacs");
    showToast("Perangkat demo ditautkan ke akun billing.");
  } else if (activeModal === "customer") {
    const planId = String(values.get("planId"));
    const plan = planFor(planId);
    if (!plan) { showToast("Pilih paket yang tersedia terlebih dahulu."); return; }
    const id = `CUS-${String(Math.max(0, ...customers.map((entry) => Number(entry.id.slice(-4)))) + 1).padStart(4, "0")}`;
    customers.unshift({ id, name: String(values.get("name")).trim(), email: String(values.get("email")).trim(), phone: String(values.get("phone")).trim(), area: String(values.get("area")).trim(), planId, status: "active", joined: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` });
    plan.customers += 1;
    renderPage("customers");
    showToast("Pelanggan demo berhasil ditambahkan.");
  } else if (activeModal === "plan") {
    const price = Number(values.get("price"));
    if (!Number.isFinite(price) || price <= 0) { showToast("Masukkan harga yang valid."); return; }
    plans.push({ id: `PLN-${String(plans.length + 1).padStart(3, "0")}`, name: String(values.get("planName")).trim(), speed: String(values.get("speed")).trim(), price, interval: "Bulanan", customers: 0, active: true });
    renderPage("plans");
    showToast("Paket demo berhasil ditambahkan.");
  } else if (activeModal === "router") {
    const port = Number(values.get("routerPort"));
    const secretRef = String(values.get("secretRef")).trim();
    if (!Number.isInteger(port) || port < 1 || port > 65535) { showToast("Port API harus di antara 1 dan 65535."); return; }
    if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(secretRef)) { showToast("Gunakan nama referensi secret backend yang valid."); return; }
    routers.push({
      id: `RTR-${String(routers.length + 1).padStart(3, "0")}`,
      name: String(values.get("routerName")).trim(),
      host: String(values.get("routerHost")).trim(),
      port,
      site: String(values.get("routerSite")).trim(),
      secretRef,
      tls: values.has("tls")
    });
    renderPage("routers");
    showToast("Metadata router demo ditambahkan; belum terhubung ke MikroTik.");
  } else if (activeModal === "mapping") {
    const routerId = String(values.get("mappingRouter"));
    const planId = String(values.get("mappingPlan"));
    const router = routers.find((entry) => entry.id === routerId);
    const plan = planFor(planId);
    if (!router || !plan) { showToast("Pilih router dan paket yang tersedia."); return; }
    const existing = planMappings.find((entry) => entry.routerId === routerId && entry.planId === planId);
    const mapping = { routerId, planId, targetType: String(values.get("targetType")), targetName: String(values.get("targetName")).trim() };
    if (existing) Object.assign(existing, mapping);
    else planMappings.push(mapping);
    renderPage("routers");
    showToast("Pemetaan paket demo disimpan.");
  }
  modal.close();
  entityForm.reset();
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
renderPage();
