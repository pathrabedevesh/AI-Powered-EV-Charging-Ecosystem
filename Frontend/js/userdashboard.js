
const stationId = localStorage.getItem("stationId");
const userId = localStorage.getItem("userId");

let stationPricePerKwh = 12.5; // Default price in ₹
let selectedSlot = "A3";

const rupees = amount =>
    "₹" + Number(amount).toFixed(2);

fetch("http://localhost:8080/getStation")
    .then(res => {
        if (!res.ok) throw new Error("Failed to load stations");
        return res.json();
    })
    .then(data => {
        const station = data.find(
            s => s.stationId == stationId
        );

        if (!station) {
            alert("Station not found!");
            return;
        }

        document.querySelector(".station-info h2").innerText =
            station.stationName;

        document.querySelector(".station-info p").innerHTML =
            `<i class="fas fa-map-marker-alt"></i>
             ${station.address}, ${station.city}`;

        stationPricePerKwh = Number(station.pricePerKwh);

        document.querySelector(".station-meta").innerHTML = `
            <span><i class="fas fa-plug"></i>
                ${station.chargerType}</span>
            <span><i class="fas fa-indian-rupee-sign"></i>
                ${rupees(stationPricePerKwh)}/kWh</span>
        `;

        document.querySelector(".stat-value").innerText =
            station.availableSlots + "/" + station.totalSlots;

        updatePrice();
    })
    .catch(error => {
        console.error("Station loading error:", error);
    });


// Select available charging slot
document.querySelectorAll(".slot.available").forEach(slot => {
    slot.addEventListener("click", () => {
        document.querySelectorAll(".slot.available")
            .forEach(s => s.classList.remove("selected"));

        slot.classList.add("selected");
        selectedSlot = slot.dataset.slot;
    });
});


// Update price when charger type or duration changes
document.querySelectorAll('input[name="chargerType"]')
    .forEach(input => {
        input.addEventListener("change", updatePrice);
    });

document.getElementById("duration")
    .addEventListener("input", updatePrice);


function updatePrice() {
    const duration = Number(
        document.getElementById("duration").value
    );

    const chargerType = document.querySelector(
        'input[name="chargerType"]:checked'
    )?.value;

    if (!Number.isFinite(duration) || duration < 1 || duration > 8) {
        return;
    }

    // Prices converted using $1 = ₹70
    // DC Fast: ₹349.30 per 30 minutes
    // Level 2: ₹139.30 per hour
    const chargingCost = chargerType === "dc-fast"
        ? duration * 2 * 349.30
        : duration * 139.30;

    const platformFee = 35;
    const tax = (chargingCost + platformFee) * 0.10;
    const total = chargingCost + platformFee + tax;

    const priceItems = document.querySelectorAll(
        ".price-breakdown .price-item"
    );

    priceItems[0].querySelector("span:first-child").textContent =
        `Charging Cost (${duration} hour${duration > 1 ? "s" : ""})`;

    priceItems[0].querySelector("span:last-child").textContent =
        rupees(chargingCost);

    priceItems[1].querySelector("span:last-child").textContent =
        rupees(platformFee);

    priceItems[2].querySelector("span:last-child").textContent =
        rupees(tax);

    document.querySelector(".price-total span:last-child")
        .textContent = rupees(total);

    // Update charger option labels
    document.querySelector(
        '.charger-option input[value="dc-fast"]'
    ).parentElement.querySelector(".option-price").textContent =
        "₹349.30/30 min";

    document.querySelector(
        '.charger-option input[value="level2"]'
    ).parentElement.querySelector(".option-price").textContent =
        "₹139.30/hour";

    return total;
}


// Save booking
function saveBooking() {
    const bookingDate =
        document.getElementById("bookingDate").value;

    const bookingTime =
        document.getElementById("bookingTime").value;

    const duration =
        Number(document.getElementById("duration").value);

    const selectedCharger =
        document.querySelector('input[name="chargerType"]:checked');

    if (!bookingDate || !bookingTime) {
        alert("Please select a date and time.");
        return;
    }

    if (!selectedSlot) {
        alert("Please select an available slot.");
        return;
    }

    if (!duration || duration < 1 || duration > 8) {
        alert("Please select a duration between 1 and 8 hours.");
        return;
    }

    if (!userId || !stationId) {
        alert("User or station information is missing.");
        return;
    }

    const total = updatePrice();

    if (total == null || !Number.isFinite(total)) {
        alert("Unable to calculate booking amount.");
        return;
    }

    const booking = {
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        vehicleType: "Car",
        amount: Number(total.toFixed(2)),
        chargerType: selectedCharger.value,
        duration: duration,
        slot: selectedSlot,
        user: {
            id: userId
        },
        station: {
            stationId: stationId
        }
    };

    fetch("http://localhost:8080/saveBooking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Booking failed");
        }
        return res.text();
    })
    .then(msg => {
        alert(msg);
        window.location.href = "payment.html";
    })
    .catch(error => {
        console.error("Booking error:", error);
        alert("Unable to save booking. Please try again.");
    });
}


// Prevent selecting a past date
document.getElementById("bookingDate").min =
    new Date().toLocaleDateString("en-CA");
