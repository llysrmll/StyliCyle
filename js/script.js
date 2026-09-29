document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const middleName = document.getElementById("middleName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const age = document.getElementById("age").value;
  const agreeTermsSignup = document.getElementById("agreeTermsSignup")?.checked;

  if (!agreeTermsSignup) {
    alert("You must agree to the Terms and Conditions to register.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (isNaN(age) || age <= 0) {
    alert("Please enter a valid age.");
    return;
  }
  if (!firstName || !lastName || !email) {
    alert("Please fill in all required fields.");
    return;
  }

  // Simulate sending verification code
  alert("Verification code sent to " + email);

  // Hide form and show 2FA setup
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("twoFactorSetup").style.display = "block";

  // Store temp user data
  localStorage.setItem("tempUser", JSON.stringify({ firstName, middleName, lastName, email, password, age }));
});

document.getElementById("verifyCodeBtn")?.addEventListener("click", function() {
  const code = document.getElementById("twoFactorCode").value.trim();
  if (code === "123456") { // Simulate correct code
    const tempUser = JSON.parse(localStorage.getItem("tempUser"));
    // Save user with 2FA enabled
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ ...tempUser, twoFactorEnabled: true });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("tempUser");
    alert("Registration successful! 2FA enabled.");
    window.location.href = "home.html";
  } else {
    alert("Invalid code. Please try again.");
  }
});

document.getElementById("resendCodeBtn")?.addEventListener("click", function() {
  alert("Code resent.");
});

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const agreeTermsLogin = document.getElementById("agreeTermsLogin")?.checked;

  if (agreeTermsLogin === false) {
    alert("Please agree to the Terms and Conditions before logging in.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  if (user.twoFactorEnabled) {
    // Show 2FA
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("twoFactorLogin").style.display = "block";
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Verification code sent to " + user.email);
  } else {
    alert("Login successful!");
    window.location.href = "home.html";
  }
});

document.getElementById("verifyLoginCodeBtn")?.addEventListener("click", function() {
  const code = document.getElementById("loginTwoFactorCode").value.trim();
  if (code === "123456") { // Simulate correct code
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Invalid code. Please try again.");
  }
});

document.getElementById("resendLoginCodeBtn")?.addEventListener("click", function() {
  alert("Code resent.");
});

const profileNameEl = document.getElementById("profileName");
const contactNumberEl = document.getElementById("contactNumber");
if (profileNameEl) {
  const savedName = localStorage.getItem("userName") || profileNameEl.value || "Guest User";
  profileNameEl.value = savedName;
}
if (contactNumberEl) {
  contactNumberEl.value = localStorage.getItem("contactNumber") || contactNumberEl.value || "";
}
if (profileNameEl) {
  profileNameEl.addEventListener("blur", function () {
    const name = profileNameEl.value.trim() || "Guest User";
    profileNameEl.value = name;
    localStorage.setItem("userName", name);
  });
}
if (contactNumberEl) {
  contactNumberEl.addEventListener("blur", function () {
    const number = contactNumberEl.value.trim();
    localStorage.setItem("contactNumber", number);
  });
}

const profileImageInput = document.getElementById("profileImageInput");
const profileAvatarImg = document.getElementById("profileAvatarImg");
if (profileImageInput && profileAvatarImg) {
  const savedImage = localStorage.getItem("profileImageData");
  if (savedImage) {
    profileAvatarImg.src = savedImage;
  }

  profileImageInput.addEventListener("change", function () {
    const file = this.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const result = event.target?.result;
      if (typeof result === "string") {
        profileAvatarImg.src = result;
        localStorage.setItem("profileImageData", result);
      }
    };
    reader.readAsDataURL(file);
  });
}

const notifications = [
  { title: "Website partnership update posted", time: "Just now" },
  { title: "New rental request", time: "2 min ago" },
  { title: "Message from admin", time: "25 min ago" },
  { title: "Profile verified", time: "1 day ago" }
];

const notificationDetails = [
  {
    title: "Partnership Update",
    message: "Our website just announced a new partnership profile with Event Couture for suit and gown rentals.",
  },
  {
    title: "Your Profile Updated",
    message: "Your partnership profile information was refreshed with the latest contact details and items.",
  }
];

const listings = [
  {
    title: "Evening Gown",
    detail: "Perfect for formal events — ₱650/day",
    image: "evening.jpg"
  },
  {
    title: "Tuxedo Suit",
    detail: "Classic suit for weddings — ₱850/day",
    image: "tuxedo.jpg"
  },
  {
    title: "Bridal Gown",
    detail: "Elegant wedding dress — ₱1200/day",
    image: "bridal.jpg"
  }
];

const profilePosts = [
  {
    title: "Silver Sequin Gown",
    detail: "Perfect for parties and evening events.",
    image: "evening.jpg"
  },
  {
    title: "Black Tuxedo Suit",
    detail: "Sharp wedding and formal event attire.",
    image: "tuxedo.jpg"
  },
  {
    title: "Ivory Bridal Gown",
    detail: "Elegant and timeless bridal choice.",
    image: "bridal.jpg"
  }
];

function 
showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-banner";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 260);
  }, 2800);
}

function renderList(elementId, items, formatItem) {
  const list = document.getElementById(elementId);
  if (!list) return;
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = formatItem(item);
    list.appendChild(li);
  });
}

function showNotifications() {
  const info = document.getElementById("homeNotificationInfo");
  const homeList = document.getElementById("homeNotifications");

  if (info) {
    info.classList.remove("hidden");
    info.innerHTML = `
      <h4>Here’s what updated</h4>
      <p><strong>${notificationDetails[0].title}:</strong> ${notificationDetails[0].message}</p>
      <p><strong>${notificationDetails[1].title}:</strong> ${notificationDetails[1].message}</p>
    `;
  }

  if (homeList) {
    homeList.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  showToast("Updated info shown in the notifications section.");
}

function addChatMessage(text, isUser) {
  const windowEl = document.querySelector(".chat-window");
  if (!windowEl) return;

  const messageEl = document.createElement("div");
  messageEl.className = `message ${isUser ? "user" : "bot"}`;
  messageEl.innerHTML = `<div class="message-text"></div>`;
  messageEl.querySelector(".message-text").textContent = text;
  windowEl.appendChild(messageEl);
  windowEl.scrollTop = windowEl.scrollHeight;
}

const chatForm = document.getElementById("chatForm");
chatForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = chatForm.querySelector("input");
  if (!input || !input.value.trim()) return;
  const message = input.value.trim();
  addChatMessage(message, true);
  input.value = "";
  setTimeout(() => addChatMessage("Thanks for your message! An agent will reply shortly.", false), 700);
});

document.getElementById("rentalForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  showToast("Rental listing submitted for review.");
  this.reset();
});

if (document.getElementById("homeNotifications")) {
  renderList("homeNotifications", notifications, item => `${item.title}<span>${item.time}</span>`);
}

if (document.getElementById("chatNotifications")) {
  renderList("chatNotifications", notifications, item => `${item.title}<span>${item.time}</span>`);
}

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

if (document.getElementById("postsContainer")) {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";
  profilePosts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "profile-post-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="profile-post-card-content">
        <strong>${item.title}</strong>
        <span>${item.detail}</span>
      </div>
    `;
    postsContainer.appendChild(card);
  });
}

const homePostRentalBtn = document.getElementById("homePostRentalBtn");
homePostRentalBtn?.addEventListener("click", () => {
  window.location.href = "rental.html";
});

const homeOpenMessagesBtn = document.getElementById("homeOpenMessagesBtn");
homeOpenMessagesBtn?.addEventListener("click", () => {
  window.location.href = "chatbox.html";
});

const navChatButton = document.getElementById("navChatButton");
const navChatInput = document.getElementById("navChatInput");
navChatButton?.addEventListener("click", () => {
  const value = navChatInput?.value.trim();
  if (value) {
    showToast(`Opening chat for: ${value}`);
    window.location.href = "chatbox.html";
  } else {
    showToast("Type a quick chat request first.");
  }
});
navChatInput?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    navChatButton?.click();
  }
});

const homeSearchBtn = document.getElementById("homeSearchBtn");
const homeSearchInput = document.getElementById("homeSearchInput");
homeSearchBtn?.addEventListener("click", () => {
  const query = homeSearchInput?.value.trim();
  if (query) {
    showToast(`Searching for "${query}"...`);
  } else {
    showToast("Enter a search term.");
  }
});
homeSearchInput?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    homeSearchBtn?.click();
  }
});

const homeOpenAdminChatBtn = document.getElementById("homeOpenAdminChatBtn");
homeOpenAdminChatBtn?.addEventListener("click", () => {
  window.location.href = "message.html";
});

const profileAdminChatBtn = document.getElementById("profileAdminChatBtn");
profileAdminChatBtn?.addEventListener("click", () => {
  window.location.href = "message.html";
});

const navNotificationBtn = document.getElementById("navNotificationBtn");
navNotificationBtn?.addEventListener("click", () => {
  showNotifications();
});

const homeViewNotificationsBtn = document.getElementById("homeViewNotificationsBtn");
homeViewNotificationsBtn?.addEventListener("click", () => {
  showToast("Showing your latest notifications.");
  document.getElementById("homeNotifications")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

const imageUploadBtn = document.getElementById("imageUploadBtn");
const postImage = document.getElementById("postImage");
imageUploadBtn?.addEventListener("click", () => {
  postImage?.click();
});

const submitPostBtn = document.getElementById("submitPostBtn");
submitPostBtn?.addEventListener("click", () => {
  const content = document.getElementById("postContent")?.value.trim();
  const file = postImage?.files?.[0];
  if (content || file) {
    showToast("Post submitted successfully!");
    document.getElementById("postContent").value = "";
    postImage.value = "";
  } else {
    showToast("Please add some content or an image to post.");
  }
});

const rentalMyListingsBtn = document.getElementById("rentalMyListingsBtn");
rentalMyListingsBtn?.addEventListener("click", () => {
  showToast("Showing your saved listings.");
  document.getElementById("rentalListings")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

const rentalViewMessagesBtn = document.getElementById("rentalViewMessagesBtn");
rentalViewMessagesBtn?.addEventListener("click", () => {
  window.location.href = "chatbox.html";
});

const rentalNotificationsBtn = document.getElementById("rentalNotificationsBtn");
rentalNotificationsBtn?.addEventListener("click", () => {
  showToast("No rental notifications found.");
});

const chatViewAllBtn = document.getElementById("chatViewAllBtn");
chatViewAllBtn?.addEventListener("click", () => {
  showToast("Viewing all notifications.");
});

const chatNewReqBtn = document.getElementById("chatNewReqBtn");
chatNewReqBtn?.addEventListener("click", () => {
  showToast("You have 1 new request.");
  const chatNotifications = document.getElementById("chatNotifications");
  if (chatNotifications) {
    const li = document.createElement("li");
    li.innerHTML = "Rental request received<span>Just now</span>";
    chatNotifications.prepend(li);
  }
});

const chatPostItemBtn = document.getElementById("chatPostItemBtn");
chatPostItemBtn?.addEventListener("click", () => {
  window.location.href = "rental.html";
});

// Persistent help launcher available on every page.
function setupFloatingChat() {
  if (document.querySelector('.chat-launcher')) return;

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launcher';
  launcher.setAttribute('aria-label', 'Open support chat');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.textContent = '💬';

  const panel = document.createElement('section');
  panel.className = 'floating-chat-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Support chat');
  panel.innerHTML = `
    <div class="floating-chat-header">
      <strong>StyliCycle Support</strong>
      <button type="button" class="floating-chat-close" aria-label="Close support chat">×</button>
    </div>
    <div class="floating-chat-messages">
      <div class="message bot"><span>Hi! How can we help with your rental today?</span></div>
    </div>
    <form class="floating-chat-form">
      <input type="text" placeholder="Type a message..." aria-label="Support message" required>
      <button type="submit" aria-label="Send support message">➤</button>
    </form>
  `;

  document.body.append(launcher, panel);

  const closeButton = panel.querySelector('.floating-chat-close');
  const messages = panel.querySelector('.floating-chat-messages');
  const form = panel.querySelector('.floating-chat-form');
  const input = form.querySelector('input');

  function togglePanel(isOpen) {
    panel.hidden = !isOpen;
    launcher.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) input.focus();
  }

  launcher.addEventListener('click', () => togglePanel(panel.hidden));
  closeButton.addEventListener('click', () => togglePanel(false));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = text;
    messages.appendChild(userMessage);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'message bot';
      reply.textContent = 'Thanks! An admin will reply shortly.';
      messages.appendChild(reply);
      messages.scrollTop = messages.scrollHeight;
    }, 500);
  });
}

setupFloatingChat();

// Delivery page functionality
if (document.getElementById('deliveryForm')) {
  let map;
  let marker;
  let routingControl;
  let pickupCoords = null;
  let deliveryCoords = null;

  function showMapFallback() {
    const fallback = document.getElementById('mapFallback');
    if (fallback) fallback.hidden = false;
  }

  function initMap() {
    // Default location (Manila, Philippines)
    const defaultLocation = [14.5995, 120.9842];

    map = L.map('map').setView(defaultLocation, 12);

    // Browsers commonly block public tile requests when this page is opened from file://.
    if (window.location.protocol === 'file:') {
      showMapFallback();
      marker = L.marker(defaultLocation, { draggable: true }).addTo(map);
      return;
    }

    // Add OpenStreetMap tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    let tileErrors = 0;
    tileLayer.on('tileerror', () => {
      tileErrors += 1;
      if (tileErrors >= 2) showMapFallback();
    });
    tileLayer.addTo(map);

    // Add a marker
    marker = L.marker(defaultLocation, { draggable: true }).addTo(map);

    // Update marker position on drag
    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      console.log('Marker moved to:', position.lat, position.lng);
    });
  }

  // Address search function using Nominatim (OpenStreetMap geocoding)
  async function searchAddress(address) {
    if (!address.trim()) {
      alert('Please enter an address to search');
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        const coords = [lat, lng];

        // Update the corresponding input field with the formatted address
        const pickupInput = document.getElementById('pickupAddress');
        const deliveryInput = document.getElementById('deliveryAddress');

        if (address === pickupInput.value) {
          pickupInput.value = location.display_name;
          pickupCoords = coords;
        } else if (address === deliveryInput.value) {
          deliveryInput.value = location.display_name;
          deliveryCoords = coords;
        }

        // Center map on the found location
        map.setView(coords, 15);
        marker.setLatLng(coords);

        // Create route if both addresses are set
        updateRoute();

      } else {
        alert('Address not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for address. Please try again.');
    }
  }

  // Update route between pickup and delivery points
  function updateRoute() {
    // Remove existing route
    if (routingControl) {
      map.removeControl(routingControl);
    }

    // Create new route if both coordinates are available
    if (pickupCoords && deliveryCoords) {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pickupCoords[0], pickupCoords[1]),
          L.latLng(deliveryCoords[0], deliveryCoords[1])
        ],
        routeWhileDragging: false,
        createMarker: function(i, waypoint, n) {
          const markerOptions = {
            draggable: true,
          };

          if (i === 0) {
            // Pickup marker
            markerOptions.icon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
          } else if (i === n-1) {
            // Delivery marker
            markerOptions.icon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
          }

          return L.marker(waypoint.latLng, markerOptions);
        }
      }).addTo(map);

      // Fit map to show the entire route
      setTimeout(() => {
        const bounds = L.latLngBounds([pickupCoords, deliveryCoords]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }, 1000);
    }
  }

  document.getElementById('deliveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const pickupAddress = document.getElementById('pickupAddress').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const itemType = document.getElementById('itemType').value;
    const notes = document.getElementById('notes').value;

    // Save delivery (using localStorage for demo)
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    deliveries.push({
      id: Date.now(),
      pickupAddress,
      deliveryAddress,
      pickupTime,
      itemType,
      notes,
      status: 'Scheduled',
      pickupCoords,
      deliveryCoords
    });
    localStorage.setItem('deliveries', JSON.stringify(deliveries));

    alert('Delivery scheduled successfully!');
    loadDeliveries();
    this.reset();

    // Clear route and coordinates after scheduling
    clearRoute();
  });

  // Clear route and reset coordinates
  function clearRoute() {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    pickupCoords = null;
    deliveryCoords = null;
    marker.setLatLng([14.5995, 120.9842]); // Reset to default location
    map.setView([14.5995, 120.9842], 12);
  }

  function loadDeliveries() {
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    const deliveryList = document.getElementById('deliveryList');
    deliveryList.innerHTML = '';

    deliveries.forEach(delivery => {
      const item = document.createElement('div');
      item.className = 'delivery-item';
      item.style.cursor = 'pointer';
      item.innerHTML = `
        <p><strong>Pickup:</strong> ${delivery.pickupAddress}</p>
        <p><strong>Delivery:</strong> ${delivery.deliveryAddress}</p>
        <p><strong>Time:</strong> ${new Date(delivery.pickupTime).toLocaleString()}</p>
        <p><strong>Item:</strong> ${delivery.itemType}</p>
        <p><strong>Status:</strong> ${delivery.status}</p>
        ${delivery.notes ? `<p><strong>Notes:</strong> ${delivery.notes}</p>` : ''}
      `;

      // Add click event to show route on map
      item.addEventListener('click', () => {
        if (delivery.pickupCoords && delivery.deliveryCoords) {
          pickupCoords = delivery.pickupCoords;
          deliveryCoords = delivery.deliveryCoords;
          updateRoute();
        } else {
          alert('Route coordinates not available for this delivery.');
        }
      });

      deliveryList.appendChild(item);
    });
  }

  // Initialize map when page loads
  window.addEventListener('load', function() {
    initMap();
    loadDeliveries();
  });
}
