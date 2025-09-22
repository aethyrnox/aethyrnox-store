// ====== KONFIG ======
const WHATSAPP_NUMBER = "6281997718002";
const waLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ====== Drawer ======
const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");
document.getElementById("menuBtn")?.addEventListener("click", () => {
  drawer?.classList.add("open"); scrim?.classList.add("show");
});
document.getElementById("closeDrawer")?.addEventListener("click", closeDrawer);
scrim?.addEventListener("click", closeDrawer);
function closeDrawer(){ drawer?.classList.remove("open"); scrim?.classList.remove("show"); }

// ====== Search demo (icon) ======
document.getElementById("searchBtn")?.addEventListener("click", () => {
  document.getElementById("searchInput")?.focus();
});

// ====== Live Search (index) ======
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
if (searchInput){
  const items = [
    ...document.querySelectorAll(".game-card"),
    ...document.querySelectorAll(".poster")
  ];
  const filter = () => {
    const q = searchInput.value.toLowerCase().trim();
    items.forEach(el => {
      const key = (el.dataset.title || el.textContent).toLowerCase();
      el.style.display = key.includes(q) ? "" : "none";
    });
  };
  searchInput.addEventListener("input", filter);
  clearSearch?.addEventListener("click", () => {
    searchInput.value = ""; filter(); searchInput.focus();
  });
}

// ====== Beli via WhatsApp (tetap berlaku di halaman detail) ======
document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const form = e.target.closest("form");
    const game = e.target.dataset.game || "Game";
    const chosen = form.querySelector("input[type=radio]:checked");
    if (!chosen) return alert("Pilih nominal dulu ya 🙏");

    const rows = form.querySelectorAll(".form-row");
    const fields = [];
    rows.forEach(r => {
      const label = r.querySelector("label")?.innerText?.trim() || "Data";
      const input = r.querySelector("input[type=text]");
      const val = input?.value?.trim() || "";
      fields.push([label, val]);
    });
    const anyEmpty = fields.some(([,v]) => v.length === 0);
    if (fields.length && anyEmpty) return alert("Lengkapi data akun dulu ya ✍️");

    const nominal = chosen.value;
    const price = Number(chosen.dataset.price || 0).toLocaleString("id-ID");

    const lines = [
      "Halo admin, saya mau top up 🙏",
      `Game: ${game}`,
      `Paket: ${nominal}`,
      `Harga: Rp${price}`,
      fields.length ? "\nData Akun:" : ""
    ];
    fields.forEach(([k,v]) => lines.push(`- ${k}: ${v}`));
    lines.push("\nArahkan pembayaran via WhatsApp ini ya.");

    window.open(waLink(lines.join("\n")), "_blank");
  });
});
