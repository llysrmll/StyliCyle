// delivery.js - load on delivery.html (after common.js AND after the Leaflet + Leaflet Routing Machine scripts)

if (document.getElementById('deliveryForm')) {
  let map;
  let marker;
  let routingControl;
  let pickupCoords = null;
  let deliveryCoords = null;

  const STATUS_LABELS = {
    scheduled: 'Scheduled',
    picked_up: 'Picked up',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

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

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    let tileErrors = 0;
    tileLayer.on('tileerror', () => {
      tileErrors += 1;
      if (tileErrors >= 2) showMapFallback();
    });
    tileLayer.addTo(map);

    marker = L.marker(defaultLocation, { draggable: true }).addTo(map);

    marker.on('dragend', function () {
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

        const pickupInput = document.getElementById('pickupAddress');
        const deliveryInput = document.getElementById('deliveryAddress');

        if (address === pickupInput.value) {
          pickupInput.value = location.display_name;
          pickupCoords = coords;
        } else if (address === deliveryInput.value) {
          deliveryInput.value = location.display_name;
          deliveryCoords = coords;
        }

        map.setView(coords, 15);
        marker.setLatLng(coords);

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
    if (routingControl) {
      map.removeControl(routingControl);
    }

    if (pickupCoords && deliveryCoords) {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pickupCoords[0], pickupCoords[1]),
          L.latLng(deliveryCoords[0], deliveryCoords[1])
        ],
        routeWhileDragging: false,
        createMarker: function (i, waypoint, n) {
          const markerOptions = { draggable: true };

          if (i === 0) {
            markerOptions.icon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
          } else if (i === n - 1) {
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

      setTimeout(() => {
        const bounds = L.latLngBounds([pickupCoords, deliveryCoords]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }, 1000);
    }
  }

  // Clear route and reset coordinates
  function clearRoute() {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
    pickupCoords = null;
    deliveryCoords = null;
    marker.setLatLng([14.5995, 120.9842]);
    map.setView([14.5995, 120.9842], 12);
  }

  // NEW: deliveries now come from the database
  async function loadDeliveries() {
    const deliveryList = document.getElementById('deliveryList');
    const res = await api('delivery/list.php');
    if (!res.success) {
      deliveryList.innerHTML = `<p>${escapeHtml(res.error || 'Could not load deliveries.')}</p>`;
      return;
    }

    deliveryList.innerHTML = '';
    if (res.deliveries.length === 0) {
      deliveryList.innerHTML = '<p>No deliveries yet. Schedule your first one!</p>';
      return;
    }

    res.deliveries.forEach(delivery => {
      const item = document.createElement('div');
      item.className = 'delivery-item';
      item.style.cursor = 'pointer';
      item.innerHTML = `
        <p><strong>Pickup:</strong> ${escapeHtml(delivery.pickupAddress)}</p>
        <p><strong>Delivery:</strong> ${escapeHtml(delivery.deliveryAddress)}</p>
        <p><strong>Time:</strong> ${escapeHtml(new Date(delivery.pickupTime).toLocaleString())}</p>
        <p><strong>Item:</strong> ${escapeHtml(delivery.itemType)}</p>
        <p><strong>Status:</strong> ${escapeHtml(STATUS_LABELS[delivery.status] || delivery.status)}</p>
        ${delivery.notes ? `<p><strong>Notes:</strong> ${escapeHtml(delivery.notes)}</p>` : ''}
      `;

      // Click an entry to show its route on the map
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

  // NEW: saving goes to PHP instead of localStorage
  document.getElementById('deliveryForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = this;
    const pickupAddress = document.getElementById('pickupAddress').value.trim();
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const pickupTime = document.getElementById('pickupTime').value;
    const itemType = document.getElementById('itemType').value;
    const notes = document.getElementById('notes').value.trim();

    if (!itemType) {
      alert('Please select a clothing type.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const res = await api('delivery/create.php', {
      method: 'POST',
      body: { pickupAddress, deliveryAddress, pickupTime, itemType, notes, pickupCoords, deliveryCoords }
    });
    submitBtn.disabled = false;

    if (!res.success) {
      alert(res.error);
      return;
    }

    alert('Delivery scheduled successfully!');
    form.reset();
    clearRoute();
    loadDeliveries();
  });

  window.addEventListener('load', function () {
    initMap();
    loadDeliveries();
  });
}
