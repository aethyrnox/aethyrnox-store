/* ==========================================
   KONFIGURASI
========================================== */
const WHATSAPP_NUMBER = "6281997718002"; // (+62)81997718002
const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

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
   SEARCH (inline di header) — live filter
   Bekerja untuk .game-card (Populer) & .poster (Catalog)
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

  // event
  searchInput.addEventListener("input", filter);
  clearSearch?.addEventListener("click", () => {
    searchInput.value = "";
    filter();
    searchInput.focus();
  });
}

/* ==========================================
   CHAT / CS → WhatsApp
========================================== */
document.getElementById("chatBtn")?.addEventListener("click", (e) => {
  // kalau chatBtn adalah <a>, biarkan default; kalau button, buka manual
  if (e.currentTarget.tagName.toLowerCase() !== "a") {
    const text = "Halo admin, mau tanya soal top up 🙌";
    window.open(waLink(text), "_blank");
  }
});

/* ==========================================
   BELI SEKARANG → WhatsApp (halaman detail)
   - Ambil pilihan paket (radio)
   - Ambil field akun (UID/Server/Riot ID/Player ID)
   - Format pesan dan buka WA
========================================== */
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const form = e.target.closest("form");
    const game = e.target.dataset.game || document.querySelector(".logo")?.textContent || "Game";

    // pastikan paket dipilih
    const chosen = form.querySelector("input[type=radio]:checked");
    if (!chosen) return alert("Pilih nominal dulu ya 🙏");

    // ambil field
    const rows = form.querySelectorAll(".form-row");
    const fields = [];
    rows.forEach(r => {
      const label = r.querySelector("label")?.innerText?.trim() || "Data";
      const input = r.querySelector("input[type=text]");
      const val = input?.value?.trim() || "";
      fields.push([label, val]);
    });

    // validasi field wajib
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
