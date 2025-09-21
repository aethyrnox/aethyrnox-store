// ====== KONFIG ======
const WHATSAPP_NUMBER = "6281997718002"; // (+62)81997718002
const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ====== Tabs (semua halaman) ======
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const target = document.querySelector(tab.dataset.target);
    if (target) target.classList.add("active");
  });
});

// ====== Drawer (kalau ada di halaman) ======
const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");
const menuBtn = document.getElementById("menuBtn");
const closeDrawerBtn = document.getElementById("closeDrawer");

function openDrawer(){ drawer?.classList.add("open"); scrim?.classList.add("show"); }
function closeDrawer(){ drawer?.classList.remove("open"); scrim?.classList.remove("show"); }

menuBtn?.addEventListener("click", openDrawer);
closeDrawerBtn?.addEventListener("click", closeDrawer);
scrim?.addEventListener("click", closeDrawer);

// ====== Search demo ======
const searchBtn = document.getElementById("searchBtn");
searchBtn?.addEventListener("click", () => alert("Cari game favoritmu ✨ (UI demo)"));

// ====== Chat/CS langsung ke WhatsApp ======
const chatBtn = document.getElementById("chatBtn");
chatBtn?.addEventListener("click", () => {
  const text = "Halo admin, mau tanya soal top up 🙌";
  window.open(waLink(text), "_blank");
});

// ====== Handler BELI -> kirim ke WhatsApp ======
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const form = e.target.closest("form");
    const game = e.target.dataset.game || "Game";

    // validasi pilihan paket
    const chosen = form.querySelector("input[type=radio]:checked");
    if (!chosen) return alert("Pilih nominal dulu ya 🙏");

    // ambil pasangan label + input text (UID, server, dsb)
    const rows = form.querySelectorAll(".form-row");
    const fields = [];
    rows.forEach(r => {
      const label = r.querySelector("label")?.innerText?.trim() || "Data";
      const input = r.querySelector("input[type=text]");
      const val = input?.value?.trim() || "";
      fields.push([label, val]);
    });

    // pastikan input text (kalau ada) terisi semua
    const anyEmpty = fields.some(([,v]) => v.length === 0);
    if (fields.length && anyEmpty) return alert("Lengkapi data akun dulu ya ✍️");

    const nominal = chosen.value;
    const price = Number(chosen.dataset.price || 0).toLocaleString("id-ID");

    // susun pesan WhatsApp
    const lines = [
      "Halo admin, saya mau top up 🙏",
      `Game: ${game}`,
      `Paket: ${nominal}`,
      `Harga: Rp${price}`,
      fields.length ? "\nData Akun:" : ""
    ];
    fields.forEach(([k,v]) => lines.push(`- ${k}: ${v}`));
    lines.push("\nMetode pembayaran: via WhatsApp ini.");

    const message = lines.join("\n");
    window.open(waLink(message), "_blank");
  });
});
