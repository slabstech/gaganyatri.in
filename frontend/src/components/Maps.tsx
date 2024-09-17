import React, { useEffect } from 'react';
import L from 'leaflet';
// grab all elements needed
/*
const latitudeText = document.querySelector('.latitude') as HTMLElement;
const longitudeText = document.querySelector('.longitude') as HTMLElement;
const timeText = document.querySelector('.time') as HTMLElement;
const speedText = document.querySelector('.speed') as HTMLElement;
const altitudeText = document.querySelector('.altitude') as HTMLElement;
const visibilityText = document.querySelector('.visibility') as HTMLElement;
*/
/* default latitude and longitude. Here lat and long is for "Wurzburg, Germany" */
/*
let lat = 49.7929;
let long = 9.9522;
const zoomLevel = 8;

// set iss.png image as Marker
const icon = L.icon({
  iconUrl: './img/iss.png',
  iconSize: [90, 45],
  iconAnchor: [25, 94],
  popupAnchor: [20, -86]
});

// drawing map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomLevel);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
  .then(response => response.json())
  .then(data => {
    lat = parseFloat(data.latitude.toFixed(2));
    long = parseFloat(data.longitude.toFixed(2));
    // convert seconds to milliseconds, then to UTC format
    const timestamp = new Date(data.timestamp * 1000).toUTCString();
    const speed = parseFloat(data.velocity.toFixed(2));
    const altitude = parseFloat(data.altitude.toFixed(2));
    const visibility = data.visibility;

    // call updateISS() function to update things
    updateISS(lat, long, timestamp, speed, altitude, visibility);
  })
  .catch(e => console.log(e));
}

// updateISS() function definition
function updateISS(lat: number, long: number, timestamp: string, speed: number, altitude: number, visibility: string) {
  // updates Marker's lat and long on map
  marker.setLatLng([lat, long]);
  // updates map view according to Marker's new position
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat.toString();
  longitudeText.innerText = long.toString();
  timeText.innerText = timestamp;
  speedText.innerText = `${speed} km/hr`;
  altitudeText.innerText = `${altitude} km`;
  visibilityText.innerText = visibility;
}
*/
/* call findISS() initially to immediately set the ISS location */
//findISS();

// call findISS() for every 2 seconds
//setInterval(findISS, 3000);


const Maps = () => {
	useEffect(() => {
		const map = L.map('map-div').setView([51.505, -0.09], 13);
	
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	
		const icon = L.icon({
		  iconUrl: './img/iss.png',
		  iconSize: [90, 45],
		  iconAnchor: [25, 94],
		  popupAnchor: [20, -86]
		});
	
		L.marker([51.5, -0.09], { icon }).addTo(map);
	  }, []);
	
	  return <div id="map-div" style={{ height: '400px' }}></div>;
	/*  
	return (
		<div>
		<h1>ISS Tracker</h1>
		<div id="map-div">
		</div>
		<div id="details">
		  <div>
			Time:
			<span className="time"></span>
		  </div>
		   <div>
			Latitude:
			<span className="latitude"></span>
		  </div>
		   <div>
			Longitude:
			<span className="longitude"></span>
		  </div>
		   <div>
			Speed:
			<span className="speed"></span>
		  </div>
		   <div>
			Altitude:
			<span className="altitude"></span>
		  </div>
		   <div>
			Visibility:
			<span className="visibility"></span>
		  </div>
		</div>
	  </div>
	);*/
};

export default Maps;