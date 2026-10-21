document.getElementById("bookingId").innerHTML =
Math.floor(Math.random()*100000);

document.getElementById("bookingDate").innerHTML =
new Date().toLocaleDateString();

document.getElementById("homeBtn").onclick=function(){

    window.location.href="userdashboard.html";

}

document.getElementById("myBookingBtn").onclick=function(){

    window.location.href="mybookings.html";

}