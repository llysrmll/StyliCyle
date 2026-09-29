// rental.js - load on rental.html (after common.js)

const listings = [
  {
    title: "Evening Gown",
    detail: "Perfect for formal events — ₱650/day",
    image: "../Images/evening.jpg"
  },
  {
    title: "Tuxedo Suit",
    detail: "Classic suit for weddings — ₱850/day",
    image: "../Images/tuxedo.jpg"
  },
  {
    title: "Bridal Gown",
    detail: "Elegant wedding dress — ₱1200/day",
    image: "../Images/bridal.jpg"
  }
];

if (document.getElementById("rentalListings")) {
  renderList("rentalListings", listings, item => `
    <div class="listing-card">
      <img src="${item.image}" alt="${item.title}">
      <div class="listing-card-content">
        <strong>${item.title}</strong>
        <span>${item.detail}</span>
      </div>
    </div>
  `);
}

document.getElementById("rentalForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  showToast("Rental listing submitted for review.");
  this.reset();
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