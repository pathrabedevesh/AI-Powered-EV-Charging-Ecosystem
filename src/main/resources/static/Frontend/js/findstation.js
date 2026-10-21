// Sample Stations Data
let filteredStations = [];
let originalStations = [];

fetch("http://localhost:8080/getStation")
.then(response => response.json())
.then(data => {
    originalStations = data;
    filteredStations = [...data];
    renderStations();
})
.catch(error => console.log(error));

// DOM Elements
const searchInput = document.getElementById('searchInput');
const distanceSlider = document.getElementById('distanceSlider');
const distanceValue = document.getElementById('distanceValue');
const sortBy = document.getElementById('sortBy');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const stationsContainer = document.getElementById('stationsContainer');
const noResults = document.getElementById('noResults');
const stationCount = document.getElementById('stationCount');
const themeToggle = document.getElementById('themeToggle');
const viewToggleBtns = document.querySelectorAll('.toggle-btn');
const stationModal = document.getElementById('stationModal');
const modalClose = document.getElementById('modalClose');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon();
}

distanceSlider.addEventListener('input', (e) => {
    distanceValue.textContent = e.target.value + ' km';
});

viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        stationsContainer.classList.toggle('list-view', currentView === 'list');
    });
});

function renderStations() {
    stationsContainer.innerHTML = '';

    if (filteredStations.length === 0) {
        noResults.style.display = 'block';
        stationCount.textContent = '0 stations found';
        return;
    }

    noResults.style.display = 'none';
    stationCount.textContent = `${filteredStations.length} stations found`;

    filteredStations.forEach(station => {
        const card = createStationCard(station);
        stationsContainer.appendChild(card);
    });
}

function createStationCard(station) {
    const utilizationPercent = (station.availableSlots / station.totalSlots) * 100;

    const statusClass = station.status.toLowerCase() === "active"
        ? "status-active"
        : "status-inactive";

    const card = document.createElement("div");
    card.className = "station-card";

    card.innerHTML = `
        <div class="station-header">
            <div class="station-name">
                <h3>${station.stationName}</h3>
                <div class="station-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${station.city}${station.distanceKm !== undefined ? ' · ' + station.distanceKm.toFixed(1) + ' km away' : ''}</span>
                </div>
            </div>
            <span class="status-badge ${statusClass}">
                ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
        </div>

        <div class="station-body">
            <div class="chargers-row">
                <span class="charger-badge">
                    ${station.chargerType}
                </span>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Price</span>
                    <span class="info-value">₹${station.pricePerKwh}/kWh</span>
                </div>
            </div>

            <div class="availability-bar">
                <div class="availability-fill" style="width:${utilizationPercent}%"></div>
            </div>

            <div style="font-size:0.85rem;color:var(--text-secondary);text-align:center;">
                ${station.availableSlots}/${station.totalSlots} slots available
            </div>
        </div>

        <div class="station-footer">
            <button class="btn-details" onclick="viewDetails(${station.stationId})">
                Details
            </button>
            <button class="btn-book" onclick="bookStation(${station.stationId})">
                Book Now
            </button>
        </div>
    `;

    card.addEventListener("click", () => openModal(station));

    return card;
}

function openModal(station) {
    document.getElementById('modalTitle').textContent = station.stationName;
    document.getElementById('modalAddress').textContent = station.address + ', ' + station.city;
    document.getElementById('modalPrice').textContent = '₹' + station.pricePerKwh + '/kWh';
    document.getElementById('modalSlots').textContent = station.availableSlots + '/' + station.totalSlots;

    document.getElementById("modalChargers").innerHTML =
        `<span class="charger-badge-modal">${station.chargerType}</span>`;

    const reviewsHtml = `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">John D.</span>
                <span class="review-rating"><i class="fas fa-star"></i> 5.0</span>
            </div>
            <div class="review-text">Excellent charging experience. Fast and reliable!</div>
        </div>
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">Sarah M.</span>
                <span class="review-rating"><i class="fas fa-star"></i> 4.5</span>
            </div>
            <div class="review-text">Good location, could use more charging spots during peak hours.</div>
        </div>
    `;
    document.getElementById('modalReviewsList').innerHTML = reviewsHtml;

    stationModal.classList.add('active');
}

function closeModal() {
    stationModal.classList.remove('active');
}

function viewDetails(id) {
    console.log('View details for station:', id);
}

function bookStation(id) {
    localStorage.setItem("stationId", id);
    window.location.href = "bookslot.html";
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || 100;

    const chargerFilters = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(cb => cb.value)
        .filter(v => v !== 'all' && v !== 'available');

    const availabilityFilter = document.querySelector('input[name="availability"]:checked').value;

    filteredStations = originalStations.filter(station => {
        const matchesSearch = searchTerm === '' ||
            station.stationName.toLowerCase().includes(searchTerm) ||
            station.address.toLowerCase().includes(searchTerm) ||
            station.city.toLowerCase().includes(searchTerm);

        const matchesCharger = chargerFilters.length === 0 ||
            chargerFilters.includes(station.chargerType);

        const matchesPrice = station.pricePerKwh >= priceMin && station.pricePerKwh <= priceMax;

        const matchesAvailability = availabilityFilter === 'all' ||
            (availabilityFilter === 'available' && station.availableSlots > 0);

        return matchesSearch && matchesCharger && matchesPrice && matchesAvailability;
    });

    sortStations();
    renderStations();
}

function sortStations() {
    const sortValue = sortBy.value;

    switch (sortValue) {
        case 'distance':
            filteredStations.sort((a, b) => {
                if (a.distanceKm === undefined || b.distanceKm === undefined) return 0;
                return a.distanceKm - b.distanceKm;
            });
            break;
        case 'price-low':
            filteredStations.sort((a, b) => a.pricePerKwh - b.pricePerKwh);
            break;
        case 'price-high':
            filteredStations.sort((a, b) => b.pricePerKwh - a.pricePerKwh);
            break;
        case 'available':
            filteredStations.sort((a, b) => b.availableSlots - a.availableSlots);
            break;
    }
}

function resetFilters() {
    searchInput.value = '';
    distanceSlider.value = 25;
    distanceValue.textContent = '25 km';
    document.getElementById("priceMin").value = "0";
    document.getElementById("priceMax").value = "20";
    document.querySelectorAll('.checkbox-group input').forEach(cb => cb.checked = true);
    sortBy.value = 'distance';
    filteredStations = [...originalStations];
    renderStations();
}

searchInput.addEventListener('input', applyFilters);
sortBy.addEventListener('change', () => {
    sortStations();
    renderStations();
});
applyFiltersBtn.addEventListener('click', applyFilters);
resetFiltersBtn.addEventListener('click', resetFilters);
modalClose.addEventListener('click', closeModal);

stationModal.addEventListener('click', (e) => {
    if (e.target === stationModal) {
        closeModal();
    }
});

renderStations();

// ===== Map & Nearest Station Logic =====

const map = L.map('map').setView([21.1458, 79.0882], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

let allStations = [];
let userLocation = null;
let routingControl = null;

fetch('/getStation')
  .then(response => response.json())
  .then(stations => {
    allStations = stations.filter(s => s.latitude && s.longitude);

    allStations.forEach(station => {
      const marker = L.marker([station.latitude, station.longitude]).addTo(map);
      marker.bindPopup(`
        <b>${station.stationName}</b><br>
        ${station.address}, ${station.city}<br>
        Charger: ${station.chargerType}<br>
        ₹${station.pricePerKwh}/kWh<br>
        Slots available: ${station.availableSlots}/${station.totalSlots}<br>
        Status: ${station.status}<br>
        <button class="route-btn" data-station-id="${station.stationId}" style="margin-top:8px;padding:6px 12px;background:#5B4CE5;color:white;border:none;border-radius:6px;cursor:pointer;">
          Get Route
        </button>
      `);
      station._marker = marker;

      marker.on('popupopen', () => {
        const btn = document.querySelector(`.route-btn[data-station-id="${station.stationId}"]`);
        if (btn) {
          btn.addEventListener('click', () => showRoute(station));
        }
      });
    });

    findNearestStation();
  })
  .catch(err => console.error('Error loading stations for map:', err));

function showRoute(station) {
  if (!userLocation) {
    alert('Please allow location access first to get a route.');
    return;
  }

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userLocation.lat, userLocation.lng),
      L.latLng(station.latitude, station.longitude)
    ],
    routeWhileDragging: false,
    show: true,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    createMarker: function() { return null; }
  }).addTo(map);
}

function findNearestStation() {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      userLocation = { lat: userLat, lng: userLng };

      L.circleMarker([userLat, userLng], {
        radius: 10,
        fillColor: '#00D9A3',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map).bindPopup('You are here').openPopup();

      allStations.forEach(station => {
        station.distanceKm = getDistanceKm(userLat, userLng, station.latitude, station.longitude);
      });

      originalStations.forEach(station => {
        const match = allStations.find(s => s.stationId === station.stationId);
        if (match) station.distanceKm = match.distanceKm;
      });
      sortStations();
      renderStations();

      allStations.sort((a, b) => a.distanceKm - b.distanceKm);

      const nearest = allStations[0];
      console.log('Nearest station:', nearest.stationName, nearest.distanceKm.toFixed(2), 'km');

      nearest._marker.bindPopup(`
        <b>⭐ ${nearest.stationName} (Nearest)</b><br>
        ${nearest.address}, ${nearest.city}<br>
        Charger: ${nearest.chargerType}<br>
        ₹${nearest.pricePerKwh}/kWh<br>
        Slots available: ${nearest.availableSlots}/${nearest.totalSlots}<br>
        Distance: ${nearest.distanceKm.toFixed(2)} km
      `).openPopup();

      const bounds = L.latLngBounds([[userLat, userLng], [nearest.latitude, nearest.longitude]]);
      map.fitBounds(bounds, { padding: [50, 50] });

      showRoute(nearest);

      const nearbyCountEl = document.getElementById('nearbyCount');
      if (nearbyCountEl) nearbyCountEl.textContent = allStations.length;
    },
    (error) => {
      console.error('Geolocation error:', error.message);
      alert('Could not get your location. Please allow location access to find the nearest station.');
    }
  );
}

const locateMeBtn = document.getElementById('locateMeBtn');
if (locateMeBtn) {
  locateMeBtn.addEventListener('click', () => {
    locateMeBtn.disabled = true;
    locateMeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    findNearestStation();

    setTimeout(() => {
      locateMeBtn.disabled = false;
      locateMeBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
    }, 2000);
  });
}

const expandMapBtn = document.getElementById('expandMapBtn');
if (expandMapBtn) {
  expandMapBtn.addEventListener('click', () => {
    window.location.href = 'fullmap.html';
  });
}