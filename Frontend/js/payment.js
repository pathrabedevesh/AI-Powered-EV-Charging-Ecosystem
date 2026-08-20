const stationId = localStorage.getItem("stationId");
const userId = localStorage.getItem("userId");

document.getElementById("payBtn").addEventListener("click", () => {

    alert("Payment Successful");

    window.location.href = "booking-success.html";

});