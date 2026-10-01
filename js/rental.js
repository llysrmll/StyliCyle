// rental.js - load on rental.html (after common.js)

async function loadListings() {
  const list = document.getElementById("rentalListings");
  if (!list) return;

  const res = await api("rental/list.php");
  if (!res.success) {
    showToast(res.error || "Could not load listings.");
    return;
  }
  if (res.rentals.length === 0) {
    list.innerHTML = "<li>You have no listings yet. Submit your first item!</li>";
    return;
  }

  renderList("rentalListings", res.rentals, item => `
    <div class="listing-card">
      ${item.image ? `<img src="../${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ""}
      <div class="listing-card-content">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.category)} · Size ${escapeHtml(item.size)} · ₱${Number(item.price_per_day).toLocaleString()}/day</span>
        <span>Status: ${escapeHtml(item.status)}</span>
      </div>
    </div>
  `);
}

document.getElementById("rentalForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = this;
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  // FormData picks up every input by its name="" attribute, including the photo
  const res = await api("rental/create.php", { method: "POST", body: new FormData(form) });
  submitBtn.disabled = false;

  if (res.success) {
    showToast("Rental listing submitted for review.");
    form.reset();
    loadListings();
  } else {
    showToast(res.error || "Could not submit listing.");
  }
});

document.getElementById("rentalMyListingsBtn")?.addEventListener("click", () => {
  showToast("Showing your saved listings.");
  document.getElementById("rentalListings")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("rentalViewMessagesBtn")?.addEventListener("click", () => {
  window.location.href = "chatbox.html";
});

document.getElementById("rentalNotificationsBtn")?.addEventListener("click", () => {
  showToast("No rental notifications found.");
});

loadListings();
