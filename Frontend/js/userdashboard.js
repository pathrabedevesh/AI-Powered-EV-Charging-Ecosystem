// ======================
// User Information
// ======================

document.getElementById("welcomeText").innerHTML =
    "Welcome Back, " + localStorage.getItem("fullname") + " 👋";

document.getElementById("userName").innerHTML =
    localStorage.getItem("fullname");

document.getElementById("userEmail").innerHTML =
    localStorage.getItem("email");

const userId = localStorage.getItem("userId");

// ======================
// Load Dashboard
// ======================

fetch("http://localhost:8080/myBookings/" + userId)

    .then(response => response.json())

    .then(bookings => {

        // ======================
        // Dashboard Cards
        // ======================

        document.getElementById("totalBookings").innerHTML =
            bookings.length;

        const pending = bookings.filter(
            b => b.status.trim().toLowerCase() === "pending"
        );

        document.getElementById("pendingBookings").innerHTML =
            pending.length;

        const completed = bookings.filter(
            b => b.status.trim().toLowerCase() === "completed"
        );

        document.getElementById("completedBookings").innerHTML =
            completed.length;

        let totalAmount = 0;

        bookings.forEach(b => {

            totalAmount += b.amount;

        });

        document.getElementById("totalAmount").innerHTML =
            "₹" + totalAmount;


        // ======================
        // Active Charging Session
        // ======================

        const activeDiv =
            document.getElementById("activeBooking");

        const activeBooking = bookings.find(
            b => b.status.trim().toLowerCase() === "pending"
        );

        if (activeBooking) {

            activeDiv.innerHTML = `

                <h3>${activeBooking.station.stationName}</h3>

                <p><b>Address :</b>
                ${activeBooking.station.address},
                ${activeBooking.station.city}</p>

                <p><b>Date :</b>
                ${activeBooking.bookingDate}</p>

                <p><b>Time :</b>
                ${activeBooking.bookingTime}</p>

                <p><b>Vehicle :</b>
                ${activeBooking.vehicleType}</p>

                <p><b>Amount :</b>
                ₹${activeBooking.amount}</p>

                <p><b>Status :</b>
                ${activeBooking.status}</p>

            `;

        }

        else {

            activeDiv.innerHTML = `

                <h3>No Active Booking</h3>

                <p>You don't have any active booking.</p>

            `;

        }


        // ======================
        // Upcoming Bookings
        // ======================

        const upcoming =
            document.getElementById("upcomingBookings");

        upcoming.innerHTML = "";

        if (pending.length > 0) {

            pending.forEach(b => {

                upcoming.innerHTML += `

                    <div class="booking-item">

                        <div class="booking-time">

                            <span class="date">
                                ${b.bookingDate}
                            </span>

                            <span class="time">
                                ${b.bookingTime}
                            </span>

                        </div>

                        <div class="booking-details">

                            <h4>
                                ${b.station.stationName}
                            </h4>

                            <p>
                                ${b.station.address},
                                ${b.station.city}
                            </p>

                            <p>
                                Vehicle :
                                ${b.vehicleType}
                            </p>

                            <p>
                                Amount :
                                ₹${b.amount}
                            </p>

                        </div>

                    </div>

                `;

            });

        }

        else {

            upcoming.innerHTML =
                "<h3>No Upcoming Bookings</h3>";

        }


        // ======================
        // Recent Transactions
        // ======================

        const table =
            document.getElementById("transactionBody");

        table.innerHTML = "";

        bookings.forEach(b => {

            table.innerHTML += `

                <tr>

                    <td>${b.bookingDate}</td>

                    <td>${b.station.stationName}</td>

                    <td>₹${b.amount}</td>

                    <td>

                        <span class="badge">

                            ${b.status}

                        </span>

                    </td>

                </tr>

            `;

        });

    })

    .catch(error => {

        console.log(error);

    });


// ======================
// Logout
// ======================

function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}