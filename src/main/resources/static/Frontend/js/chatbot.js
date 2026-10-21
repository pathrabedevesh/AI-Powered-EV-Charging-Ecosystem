
(function () {
    const STATIONS_API = "/api/stations"; // should return a JSON array of stations
    const mapStation = (s) => ({
        id: s.id,
        name: s.name || s.stationName,
        address: s.address || s.location || "",
        lat: parseFloat(s.latitude ?? s.lat),
        lng: parseFloat(s.longitude ?? s.lng),
        slots: s.availableSlots ?? s.slots ?? null,
        connector: s.connectorType || s.connector || "",
        price: s.pricePerKwh ?? s.price ?? null,
        fast: Boolean(s.fastCharging ?? s.fast)
    });
    const BOOKING_PAGE = "findstation.html"; // where the "Book" button goes
    const FALLBACK_STATIONS = [
        { id: 1, name: "Tech Park Station", address: "Tech Park Road", latitude: 21.1498, longitude: 79.0806, availableSlots: 20, connectorType: "CCS2", pricePerKwh: 12, fastCharging: true },
        { id: 2, name: "City Mall Charging Hub", address: "City Mall Parking", latitude: 21.1612, longitude: 79.0921, availableSlots: 4, connectorType: "Type 2", pricePerKwh: 10, fastCharging: false },
        { id: 3, name: "Highway Fast Charge", address: "NH-44 Service Road", latitude: 21.1205, longitude: 79.0503, availableSlots: 8, connectorType: "CCS2", pricePerKwh: 14, fastCharging: true }
    ];
    // =========================================================

    const state = { stations: null, fastOnly: false };

    // ---------- build UI ----------
    const root = document.createElement("div");
    root.innerHTML = `
        <section class="eh-window" id="ehWindow" role="dialog" aria-label="Charging assistant">
            <div class="eh-header">
                <div><strong>ElectroBot</strong><small>EV charging assistant</small></div>
                <button class="eh-close" id="ehClose" aria-label="Close chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="eh-messages" id="ehMessages" aria-live="polite"></div>
            <div class="eh-chips" id="ehChips"></div>
            <form class="eh-form" id="ehForm">
                <input class="eh-input" id="ehInput" type="text" placeholder="Type a message..." autocomplete="off">
                <button class="eh-send" type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
            </form>
        </section>`;
    document.body.appendChild(root);

    const $win = root.querySelector("#ehWindow");
    const $msgs = root.querySelector("#ehMessages");
    const $chips = root.querySelector("#ehChips");
    const $input = root.querySelector("#ehInput");
    let greeted = false;

    // Use the icon already in the HTML; create one only if it's missing
    let launcher = document.getElementById("ehLauncher");
    if (!launcher) {
        launcher = document.createElement("button");
        launcher.className = "eh-launcher";
        launcher.id = "ehLauncher";
        launcher.setAttribute("aria-label", "Open charging assistant");
        launcher.innerHTML = '<i class="fas fa-comment-dots"></i>';
        document.body.appendChild(launcher);
    }

    launcher.onclick = () => {
        $win.classList.toggle("open");
        if ($win.classList.contains("open")) {
            $input.focus();
            if (!greeted) { greeted = true; greet(); }
        }
    };
    root.querySelector("#ehClose").onclick = () => $win.classList.remove("open");
    root.querySelector("#ehForm").onsubmit = (e) => {
        e.preventDefault();
        const text = $input.value.trim();
        if (!text) return;
        $input.value = "";
        handleUser(text);
    };

    // ---------- helpers ----------
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const scroll = () => { $msgs.scrollTop = $msgs.scrollHeight; };

    function say(text, who = "bot") {
        const d = document.createElement("div");
        d.className = "eh-msg " + who;
        d.textContent = text;
        $msgs.appendChild(d);
        scroll();
    }

    function chips(list) {
        $chips.innerHTML = "";
        list.forEach(([label, action]) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "eh-chip";
            b.textContent = label;
            b.onclick = () => { say(label, "user"); action(); };
            $chips.appendChild(b);
        });
    }

    function haversineKm(lat1, lon1, lat2, lon2) {
        const R = 6371, toRad = (d) => (d * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(a));
    }

    // ---------- conversation ----------
    function greet() {
        say("Hi! I'm ElectroBot. Do you need to charge your EV?");
        mainChips();
    }

    function mainChips() {
        chips([
            ["Yes, find nearest station", () => findStations(false)],
            ["Fast charging only", () => findStations(true)],
            ["Cheapest time to charge", tipTime]
        ]);
    }

    function handleUser(text) {
        say(text, "user");
        const t = text.toLowerCase();
        if (/(fast|rapid|dc)/.test(t) && /(charg|station)/.test(t)) return findStations(true);
        if (/(near|station|charg|find|where|yes|yeah|yep|low battery)/.test(t)) return findStations(false);
        if (/(cheap|price|cost|discount|save|time)/.test(t)) return tipTime();
        if (/(hi|hello|hey)/.test(t)) return greet();
        say("I can help you find the nearest charging station. Would you like me to search now?");
        mainChips();
    }

    function tipTime() {
        say("Charging between 9 PM and 6 AM gets a 15% discount. Want me to find a station near you?");
        mainChips();
    }

    async function loadStations() {
        if (state.stations) return state.stations;
        try {
            const res = await fetch(STATIONS_API);
            if (!res.ok) throw new Error(res.status);
            state.stations = (await res.json()).map(mapStation);
        } catch (e) {
            console.warn("Stations API failed, using sample data:", e);
            state.stations = FALLBACK_STATIONS.map(mapStation);
        }
        state.stations = state.stations.filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
        return state.stations;
    }

    function getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("unsupported"));
            navigator.geolocation.getCurrentPosition(
                (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
                reject,
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    async function findStations(fastOnly) {
        $chips.innerHTML = "";
        say("Checking your location to find the closest stations...");
        let pos;
        try {
            pos = await getLocation();
        } catch (e) {
            say("I couldn't get your location. Allow location access in your browser (needs https or localhost), then try again.");
            chips([["Try again", () => findStations(fastOnly)]]);
            return;
        }

        let list = await loadStations();
        if (fastOnly) list = list.filter((s) => s.fast);
        if (!list.length) {
            say("I couldn't find any stations" + (fastOnly ? " with fast charging." : "."));
            mainChips();
            return;
        }

        const ranked = list
            .map((s) => ({ ...s, km: haversineKm(pos.lat, pos.lng, s.lat, s.lng) }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 3);

        say(`Here ${ranked.length === 1 ? "is the nearest station" : "are the " + ranked.length + " nearest stations"}${fastOnly ? " with fast charging" : ""}:`);
        ranked.forEach((s, i) => $msgs.appendChild(stationCard(s, i === 0, pos)));
        scroll();
        say("Want me to search again with different needs?");
        mainChips();
    }

    function stationCard(s, isNearest, pos) {
        const d = document.createElement("div");
        d.className = "eh-station";
        const dir = `https://www.google.com/maps/dir/?api=1&origin=${pos.lat},${pos.lng}&destination=${s.lat},${s.lng}`;
        d.innerHTML = `
            <h4>${isNearest ? "Nearest: " : ""}${esc(s.name)}</h4>
            <p>${s.km.toFixed(1)} km away${s.address ? " · " + esc(s.address) : ""}</p>
            <p>${s.slots !== null ? esc(s.slots) + " slots available" : "Slot info unavailable"}${s.connector ? " · " + esc(s.connector) : ""}${s.price !== null ? " · ₹" + esc(s.price) + "/kWh" : ""}</p>
            <div class="eh-links">
                <a href="${BOOKING_PAGE}">Book slot</a>
                <a class="secondary" href="${dir}" target="_blank" rel="noopener">Directions</a>
            </div>`;
        return d;
    }
})();