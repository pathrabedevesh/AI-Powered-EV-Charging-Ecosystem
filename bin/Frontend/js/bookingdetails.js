const bookingId = localStorage.getItem("bookingId");

fetch("http://localhost:8080/booking/" + bookingId)
    .then(response => response.json())
    .then(booking => {

        document.getElementById("bookingNumber").innerText =
            "Booking #" + booking.bookingId;

        document.getElementById("bookingStatus").innerText =
            booking.status;

        document.getElementById("stationName").innerText =
            booking.station.stationName;

        document.getElementById("stationAddress").innerText =
            booking.station.address + ", " + booking.station.city;

        document.getElementById("chargerType").innerText =
            booking.station.chargerType;

        document.getElementById("bookingDate").innerText =
            booking.bookingDate;

        document.getElementById("bookingTime").innerText =
            booking.bookingTime;

        document.getElementById("vehicleType").innerText =
            booking.vehicleType;

        document.getElementById("bookingAmount").innerText =
            "₹" + booking.amount;

    })
    .catch(error => {
        console.error(error);
        alert("Unable to load booking details.");
    });

    function cancelBooking() {

    fetch("http://localhost:8080/cancelBooking/" + bookingId, {
        method: "PUT"
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        window.location.href = "mybookings.html";
    })
    .catch(error => {
        console.error(error);
    });

}