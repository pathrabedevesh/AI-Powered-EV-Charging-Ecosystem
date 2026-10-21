const stationId = localStorage.getItem("stationId");
const userId = localStorage.getItem("userId");

fetch("http://localhost:8080/getStation")
.then(res => res.json())
.then(data => {

    const station = data.find(s => s.stationId == stationId);

    document.querySelector(".station-info h2").innerText =
        station.stationName;

    document.querySelector(".station-info p").innerHTML =
        `<i class="fas fa-map-marker-alt"></i>
        ${station.address}, ${station.city}`;

    document.querySelector(".station-meta").innerHTML =
    `
    <span><i class="fas fa-plug"></i> ${station.chargerType}</span>

    <span><i class="fas fa-indian-rupee-sign"></i>
    ₹${station.pricePerKwh}/kWh</span>
    `;

    document.querySelector(".stat-value").innerText =
        station.availableSlots + "/" + station.totalSlots;

});

function saveBooking(){

    const booking = {

        bookingDate:
        document.getElementById("bookingDate").value,

        bookingTime:
        document.getElementById("bookingTime").value,

        vehicleType:"Car",

        amount:500,

        user:{
            id:userId
        },

        station:{
            stationId:stationId
        }

    };

    fetch("http://localhost:8080/saveBooking",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(booking)

    })

    .then(res=>res.text())

    .then(msg=>{

        alert(msg);

        window.location.href="payment.html";

    });

}

document.getElementById("bookingDate").min =
new Date().toISOString().split("T")[0];