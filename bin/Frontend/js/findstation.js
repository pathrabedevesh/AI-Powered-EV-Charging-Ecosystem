// Sample Stations Data
let filteredStations = [];

fetch("http://localhost:8080/getStation")
.then(response => response.json())
.then(data => {

    originalStations = data;
    filteredStations = [...data];
    renderStations();

})
.catch(error => console.log(error));

let originalStations = [];

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

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon();
}

// Distance Slider
distanceSlider.addEventListener('input', (e) => {
    distanceValue.textContent = e.target.value + ' km';
});

// View Toggle
viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        stationsContainer.classList.toggle('list-view', currentView === 'list');
    });
});

// Render Stations
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
                    <span>${station.city}</span>
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
                <div class="availability-fill"
                     style="width:${utilizationPercent}%">
                </div>
            </div>

            <div style="font-size:0.85rem;color:var(--text-secondary);text-align:center;">
                ${station.availableSlots}/${station.totalSlots} slots available
            </div>

        </div>

        <div class="station-footer">
            <button class="btn-details"
                    onclick="viewDetails(${station.stationId})">
                Details
            </button>

            <button class="btn-book"
                    onclick="bookStation(${station.stationId})">
                Book Now
            </button>
        </div>
    `;

    card.addEventListener("click", () => openModal(station));

    return card;
}

// Modal Functions
function openModal(station) {
    document.getElementById('modalTitle').textContent = station.stationName;
    
    document.getElementById('modalAddress').textContent = station.address + ', ' + station.city;
document.getElementById('modalPrice').textContent = '₹' + station.pricePerKwh + '/kWh';
    document.getElementById('modalSlots').textContent = station.availableSlots + '/' + station.totalSlots;
    
    

    // Chargers
    const chargersHtml = document.getElementById("modalChargers").innerHTML =
`<span class="charger-badge-modal">${station.chargerType}</span>`;

    // Mock reviews
    const reviewsHtml = `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">John D.</span>
                <span class="review-rating">
                    <i class="fas fa-star"></i> 5.0
                </span>
            </div>
            <div class="review-text">Excellent charging experience. Fast and reliable!</div>
        </div>
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">Sarah M.</span>
                <span class="review-rating">
                    <i class="fas fa-star"></i> 4.5
                </span>
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

function bookStation(id){

    localStorage.setItem("stationId", id);

    window.location.href="bookslot.html";

}

// Filter Logic
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const distance = parseInt(distanceSlider.value);
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || 100;
    
    const chargerFilters = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(cb => cb.value)
        .filter(v => v !== 'all' && v !== 'available');
    
    const availabilityFilter = document.querySelector('input[name="availability"]:checked').value;

    filteredStations = originalStations.filter(station => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            station.stationName.toLowerCase().includes(searchTerm) ||
            station.address.toLowerCase().includes(searchTerm) ||
            station.city.toLowerCase().includes(searchTerm);

        // Charger type filter
        const matchesCharger = chargerFilters.length === 0 || 
            chargerFilters.length===0 ||
chargerFilters.includes(station.chargerType)

        // Price filter
        const matchesPrice = station.pricePerKwh>= priceMin && station.pricePerKwh <= priceMax;

        // Availability filter
        const matchesAvailability = availabilityFilter === 'all' || 
            (availabilityFilter === 'available' && station.availableSlots > 0);

        return matchesSearch && matchesCharger && matchesPrice && matchesAvailability;
    });

    // Sort
    sortStations();
    renderStations();
}

function sortStations() {
    const sortValue = sortBy.value;

    switch(sortValue) {
        case 'distance':
            filteredStations.sort((a, b) => a.stationId - b.stationId);
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

// Event Listeners
searchInput.addEventListener('input', applyFilters);
sortBy.addEventListener('change', () => {
    sortStations();
    renderStations();
});
applyFiltersBtn.addEventListener('click', applyFilters);
resetFiltersBtn.addEventListener('click', resetFilters);
modalClose.addEventListener('click', closeModal);

// Close modal on background click
stationModal.addEventListener('click', (e) => {
    if (e.target === stationModal) {
        closeModal();
    }
});

renderStations();
