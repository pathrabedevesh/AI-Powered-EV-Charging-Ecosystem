const ownerId = localStorage.getItem("userId");

fetch("http://localhost:8080/ownerBookings/"+ownerId)

.then(res=>res.json())

.then(data=>{

    console.log(data);

});
function viewBooking(id){

    localStorage.setItem("bookingId", id);

    window.location.href="bookingdetails.html";

}

const ownerId = localStorage.getItem("userId");

fetch("http://localhost:8080/ownerBookings/" + ownerId)
    .then(response => response.json())
    .then(bookings => {

        const table = document.getElementById("bookingTableBody");

        if (bookings.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="9">No Bookings Found</td>
                </tr>
            `;

            return;
        }

        bookings.forEach(booking => {

            table.innerHTML += `

                <tr>

                    <td>${booking.bookingId}</td>

                    <td>${booking.user.fullname}</td>

                    <td>${booking.station.stationName}</td>

                    <td>--</td>

                    <td>${booking.bookingDate} ${booking.bookingTime}</td>

                    <td>--</td>

                    <td>₹${booking.amount}</td>

                    <td>${booking.status}</td>

                    <td>

                        <button
                        onclick="viewBooking(${booking.bookingId})">

                        View

                        </button>

                        ${
                            booking.status === "Pending"

                            ?

                            `<button
                            onclick="completeBooking(${booking.bookingId})">

                            Complete

                            </button>`

                            :

                            ""
                        }

                    </td>

                </tr>

            `;

        });

    })
    .catch(error => {
        console.error(error);
    });

    function completeBooking(id){

    fetch("http://localhost:8080/completeBooking/" + id, {

        method: "PUT"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        location.reload();

    })

    .catch(error => {

        console.error(error);

    });

}
function completeBooking(id){

    fetch("http://localhost:8080/completeBooking/" + id, {

        method: "PUT"

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        location.reload();

    })

    .catch(error => {

        console.error(error);

    });

}