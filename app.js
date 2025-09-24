/* ==========================================
   KONFIGURASI
========================================== */
const WHATSAPP_NUMBER = "6281997718002"; // (+62)81997718002
const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* =========================
   TAB SWITCHER (TopUp/Deskripsi/FAQ)
========================= */
(function initTabs(){
  const tabs = document.querySelectorAll(".tabs .tab");
  const panels = document.querySelectorAll(".tab-panel");
  if (!tabs.length || !panels.length) return;

  // Pastikan hanya 1 panel aktif di awal
  if (!document.querySelector(".tab-panel.active")) {
    panels.forEach(p => p.classList.remove("active"));
    panels[0].classList.add("active");
    tabs[0].classList.add("active");
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // toggle active
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected","false");
      });
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected","true");
      const target = document.querySelector(tab.dataset.target);
      if (target){
        target.classList.add("active");
        // biar ke-scroll rapi di mobile
        target.scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  });
})();
/* ==========================================
   DRAWER (menu samping)
========================================== */
const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");

document.getElementById("menuBtn")?.addEventListener("click", () => {
  drawer?.classList.add("open");
  scrim?.classList.add("show");
});
document.getElementById("closeDrawer")?.addEventListener("click", closeDrawer);
scrim?.addEventListener("click", closeDrawer);

function closeDrawer(){
  drawer?.classList.remove("open");
  scrim?.classList.remove("show");
}

/* ==========================================
   SEARCH (inline di header index) — live filter
========================================== */
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

if (searchInput){
  const items = [
    ...document.querySelectorAll(".game-card"),
    ...document.querySelectorAll(".poster")
  ];

  const filter = () => {
    const q = (searchInput.value || "").toLowerCase().trim();
    items.forEach(el => {
      const key = (el.dataset.title || el.textContent || "").toLowerCase();
      el.style.display = key.includes(q) ? "" : "none";
    });
  };

  searchInput.addEventListener("input", filter);
  clearSearch?.addEventListener("click", () => {
    searchInput.value = "";
    filter();
    searchInput.focus();
  });
}

/* ==========================================
   TABS (Top Up / Deskripsi / FAQ) – FIXED
   Support banyak grup tabs per halaman
========================================== */
document.querySelectorAll(".tabs").forEach(group => {
  const tabs = group.querySelectorAll(".tab");
  const root = group.closest("main") || document;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // nonaktifkan semua tab di grup ini
      tabs.forEach(t => t.classList.remove("active"));
      // nonaktifkan semua panel yang masih 1 konteks halaman
      root.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      // aktifkan tab & panel target
      tab.classList.add("active");
      const target = root.querySelector(tab.dataset.target);
      if (target) target.classList.add("active");
    });
  });
});

/* ==========================================
   CHAT / CS → WhatsApp
========================================== */
document.getElementById("chatBtn")?.addEventListener("click", (e) => {
  if (e.currentTarget.tagName.toLowerCase() !== "a") {
    const text = "Halo admin, mau tanya soal top up 🙌";
    window.open(waLink(text), "_blank");
  }
});

/* ==========================================
   BELI SEKARANG → WhatsApp (halaman detail)
========================================== */
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const form = e.target.closest("form");
    const game = e.target.dataset.game || document.querySelector(".logo")?.textContent || "Game";

    // paket dipilih?
    const chosen = form.querySelector("input[type=radio]:checked");
    if (!chosen) return alert("Pilih nominal dulu ya 🙏");

    // ambil field akun
    const rows = form.querySelectorAll(".form-row");
    const fields = [];
    rows.forEach(r => {
      const label = r.querySelector("label")?.innerText?.trim() || "Data";
      const input = r.querySelector("input[type=text]");
      const val = input?.value?.trim() || "";
      fields.push([label, val]);
    });

    // validasi field
    const anyEmpty = fields.some(([,v]) => v.length === 0);
    if (fields.length && anyEmpty) return alert("Lengkapi data akun dulu ya ✍️");

    const nominal = chosen.value;
    const price = Number(chosen.dataset.price || 0).toLocaleString("id-ID");

    const parts = [
      "Halo admin, saya mau top up 🙏",
      `Game: ${game}`,
      `Paket: ${nominal}`,
      `Harga: Rp${price}`,
      fields.length ? "\nData Akun:" : ""
    ];
    fields.forEach(([k,v]) => parts.push(`- ${k}: ${v}`));
    parts.push("\nArahkan pembayaran via WhatsApp ini ya.");

    window.open(waLink(parts.join("\n")), "_blank");
  });
});
