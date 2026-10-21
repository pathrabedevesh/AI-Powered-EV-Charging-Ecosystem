document.getElementById('backBtn').addEventListener('click',()=>{window.location.href='findstation.html'});

const map=L.map('map').setView([21.1458,79.0882],12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap contributors',
maxZoom:19
}).addTo(map);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const userIcon=L.divIcon({
className:'user-location-icon',
html:'<div class="user-location-dot"></div>',
iconSize:[20,20],
iconAnchor:[10,10]
});

let allStations=[];
let routeLine=null;
let userMarker=null;

function getDistanceKm(lat1,lon1,lat2,lon2){
const R=6371;
const dLat=(lat2-lat1)*Math.PI/180;
const dLon=(lon2-lon1)*Math.PI/180;
const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

fetch('/getStation')
.then(response=>{
if(!response.ok)throw new Error('Failed to load stations');
return response.json();
})
.then(stations=>{
allStations=stations.filter(station=>
station.latitude!==null&&
station.longitude!==null&&
station.latitude!==undefined&&
station.longitude!==undefined&&
!isNaN(Number(station.latitude))&&
!isNaN(Number(station.longitude))
);

allStations.forEach(station=>{
const marker=L.marker([
Number(station.latitude),
Number(station.longitude)
]).addTo(map);

marker.bindPopup(`
<b>${station.stationName}</b><br>
${station.address}, ${station.city}<br>
Charger: ${station.chargerType}<br>
₹${station.pricePerKwh}/kWh<br>
Slots available: ${station.availableSlots}/${station.totalSlots}<br>
Status: ${station.status}
`);

station._marker=marker;
});

findNearestStation();
})
.catch(error=>{
console.error('Error loading stations for map:',error);
});

function findNearestStation(){
if(!navigator.geolocation){
alert('Geolocation is not supported by your browser.');
return;
}

navigator.geolocation.getCurrentPosition(
position=>{
const userLat=position.coords.latitude;
const userLng=position.coords.longitude;

if(userMarker)map.removeLayer(userMarker);

userMarker=L.marker([userLat,userLng],{icon:userIcon}).addTo(map);

userMarker.bindPopup('<b>📍 You are here</b>').openPopup();

if(allStations.length===0){
alert('No charging stations with valid coordinates were found.');
map.setView([userLat,userLng],14);
return;
}

allStations.forEach(station=>{
station.distanceKm=getDistanceKm(
userLat,
userLng,
Number(station.latitude),
Number(station.longitude)
);
});

allStations.sort((a,b)=>a.distanceKm-b.distanceKm);

const nearest=allStations[0];
const stationLat=Number(nearest.latitude);
const stationLng=Number(nearest.longitude);

const routeUrl=`https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${stationLng},${stationLat}?overview=full&geometries=geojson`;

fetch(routeUrl)
.then(response=>{
if(!response.ok)throw new Error('OSRM route request failed');
return response.json();
})
.then(data=>{
if(!data.routes||data.routes.length===0){
alert('Could not find a driving route to this station.');
return;
}

const route=data.routes[0];

if(routeLine)map.removeLayer(routeLine);

routeLine=L.geoJSON(route.geometry,{
style:{
color:'#4285F4',
weight:6,
opacity:.85
}
}).addTo(map);

const distanceKm=route.distance/1000;
const durationMin=route.duration/60;

nearest._marker.bindPopup(`
<b>⭐ ${nearest.stationName}</b><br>
${nearest.address}, ${nearest.city}<br>
Charger: ${nearest.chargerType}<br>
₹${nearest.pricePerKwh}/kWh<br>
Slots available: ${nearest.availableSlots}/${nearest.totalSlots}<br>
🚗 Distance: ${distanceKm.toFixed(2)} km<br>
⏱️ ETA: ${durationMin.toFixed(0)} minutes
`).openPopup();

map.fitBounds(routeLine.getBounds(),{padding:[60,60]});
})
.catch(error=>{
console.error('Error getting route:',error);
alert('Unable to calculate route. Check your internet connection.');
});
},
error=>{
console.error('Geolocation error:',error.message);

if(error.code===1){
alert('Location permission was denied. Please allow location access in your browser.');
}else if(error.code===2){
alert('Your location could not be determined.');
}else if(error.code===3){
alert('Location request timed out.');
}else{
alert('Unable to get your location.');
}
},
{
enableHighAccuracy:true,
timeout:10000,
maximumAge:0
}
);
}

document.getElementById('locateBtn').addEventListener('click',findNearestStation);