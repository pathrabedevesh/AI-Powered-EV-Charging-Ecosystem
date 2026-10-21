const ownerId = localStorage.getItem("userId");

fetch(`http://localhost:8080/myStations/${ownerId}`)
.then(response => response.json())
.then(data => {

    const stationsGrid = document.getElementById("stationsGrid");

    stationsGrid.innerHTML = "";

    data.forEach(station => {

        stationsGrid.innerHTML += `

        <div class="station-card">

            <div class="card-header">

                <div class="station-title">
                    <h3>${station.stationName}</h3>
                    <span class="status-badge active">
                        ${station.status}
                    </span>
                </div>

            </div>

            <div class="card-body">

                <div class="info-item">
                    <b>Address :</b> ${station.address}
                </div>

                <div class="info-item">
                    <b>City :</b> ${station.city}
                </div>

                <div class="info-item">
                    <b>Charger :</b> ${station.chargerType}
                </div>

                <div class="info-item">
                    <b>Price :</b> ₹${station.pricePerKwh}/kWh
                </div>

                <div class="info-item">
                    <b>Available :</b>
                    ${station.availableSlots}/${station.totalSlots}
                </div>
                <button class="delete-btn" onclick="deleteStation(${station.stationId})">
    <i class="fas fa-trash"></i> Delete
</button>

            </div>

        </div>

        `;

    });

})
.catch(error => {

    console.log(error);

});

function deleteStation(id){

    if(confirm("Are you sure you want to delete this station?")){

        fetch(`http://localhost:8080/deleteStation/${id}`,{
            method:"DELETE"
        })
        .then(response=>response.json())
        .then(data=>{

            alert("Station Deleted Successfully");

            location.reload();

        })
        .catch(error=>{

            console.log(error);

            alert("Delete Failed");

        });

    }

}