import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const Maps: React.FC = () => {
	const mapRef = useRef<L.Map | null>(null);
	const markerRef = useRef<L.Marker | null>(null);
	useEffect(() => {
		if (!mapRef.current) {
		
		mapRef.current = L.map('map').setView([0, 0], 2);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(mapRef.current);
		markerRef.current = L.marker([0, 0]).addTo(mapRef.current);
	
		// Call findISS initially to set the ISS location
		findISS();
	
		// Call findISS every 3 seconds
		const intervalId = setInterval(findISS, 3000);
	
		// Clean up the interval when the component unmounts
		return () => clearInterval(intervalId);
	}
	  }, []);
		function findISS() {
			fetch("https://api.wheretheiss.at/v1/satellites/25544")
			  .then(response => response.json())
			  .then(data => {
				const lat = parseFloat(data.latitude.toFixed(2));
				const long = parseFloat(data.longitude.toFixed(2));
				const timestamp = new Date(data.timestamp * 1000).toUTCString();
				const speed = parseFloat(data.velocity.toFixed(2));
				const altitude = parseFloat(data.altitude.toFixed(2));
				const visibility = data.visibility;
		
				updateISS(lat, long, timestamp, speed, altitude, visibility);
			  })
			  .catch(e => console.log(e));
		  }
		  function updateISS(lat: number, long: number, timestamp: string, speed: number, altitude: number, visibility: string) {
			if (markerRef.current && mapRef.current) {
			  // Update the marker's position
			  markerRef.current.setLatLng([lat, long]);
		
			  // Update the map's view
			  mapRef.current.setView([lat, long]);
		
			  // Update other elements on the page
			  // ...
			}
		  }  
/*
		if (!mapRef.current) {
			const latitudeText = document.querySelector('.latitude') as HTMLElement;
			const longitudeText = document.querySelector('.longitude') as HTMLElement;
			const timeText = document.querySelector('.time') as HTMLElement;
			const speedText = document.querySelector('.speed') as HTMLElement;
			const altitudeText = document.querySelector('.altitude') as HTMLElement;
			const visibilityText = document.querySelector('.visibility') as HTMLElement;
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

			mapRef.current = L.map('map').setView([0, 0], 2);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current);
			markerRef.current = L.marker([0, 0]).addTo(mapRef.current);
		
			// Call findISS initially to set the ISS location
			findISS();
		
			// Call findISS every 3 seconds
			const intervalId = setInterval(findISS, 3000);
		
			// Clean up the interval when the component unmounts
			return () => clearInterval(intervalId);
		  }, []);
					// drawing map interface on #map-div
			mapRef.current =L.map('map-div').setView([lat, long], zoomLevel);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(mapRef.current);

			// adding the Marker to map
			const marker = L.marker([lat, long], { icon: icon }).addTo(mapRef.current);
			
		  }
	  
		  return () => {
			if (mapRef.current) {
			  mapRef.current.remove();
			  mapRef.current = null;
			}
		  };
		}, []);
	  */
		return <div id="map" style={{ height: '400px' }}></div>;
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