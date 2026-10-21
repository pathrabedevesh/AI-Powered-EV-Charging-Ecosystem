

function cancelBooking(id) {

    fetch("http://localhost:8080/cancelBooking/" + id, {
        method: "PUT"
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        location.reload();
    });

}



function completeBooking(id) {

    fetch("http://localhost:8080/completeBooking/" + id, {
        method: "PUT"
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        location.reload();
    });

}

const userId = localStorage.getItem("userId");

fetch("http://localhost:8080/myBookings/" + userId)
    .then(response => response.json())
    .then(bookings => {

        const container = document.getElementById("bookingContainer");

        if (bookings.length === 0) {
            container.innerHTML = "<h2>No Bookings Found</h2>";
            return;
        }

        bookings.forEach(booking => {

            container.innerHTML += `
            
            <div class="booking-card">

                <div class="card-header">

                    <span class="status">
                        ${booking.status}
                    </span>

                    <span>
                        Booking #${booking.bookingId}
                    </span>

                </div>

                <div class="card-body">

                    <h3>${booking.station.stationName}</h3>

                    <p>
                        <i class="fas fa-map-marker-alt"></i>
                        ${booking.station.address},
                        ${booking.station.city}
                    </p>

                    <p>
                        <i class="fas fa-calendar"></i>
                        ${booking.bookingDate}
                    </p>

                    <p>
                        <i class="fas fa-clock"></i>
                        ${booking.bookingTime}
                    </p>

                    <p>
                        Vehicle :
                        ${booking.vehicleType}
                    </p>

                    <p>
                        Amount :
                        ₹${booking.amount}
                    </p>

                    <button
                        onclick="viewDetails(${booking.bookingId})">

                        View Details

                    </button>

                    ${booking.status==="Pending"
                    ?

                    `<button
                        onclick="cancelBooking(${booking.bookingId})">

                        Cancel Booking

                    </button>`

                    :

                    ""
                    }

                </div>

            </div>

            `;

        });

    });

    function viewDetails(id){

    localStorage.setItem("bookingId", id);

    window.location.href="bookingdetails.html";

}