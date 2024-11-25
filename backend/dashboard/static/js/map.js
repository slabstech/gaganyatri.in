/*const countries = [
    {
        name: "Germany",
        iso_code: "DE",
        latitude: 51.1657,
        longitude: 10.4515,
        pillar2_implemented: true,
        local_top_up_tax: true
    },
    {
        name: "France",
        iso_code: "FR",
        latitude: 46.6034,
        longitude: 1.8883,
        pillar2_implemented: true,
        local_top_up_tax: false
    },
    {
        name: "United States",
        iso_code: "US",
        latitude: 37.0902,
        longitude: -95.7129,
        pillar2_implemented: false,
        local_top_up_tax: false
    },
    {
        name: "Japan",
        iso_code: "JP",
        latitude: 36.2048,
        longitude: 138.2529,
        pillar2_implemented: true,
        local_top_up_tax: true
    },
    {
        name: "India",
        iso_code: "IN",
        latitude: 20.5937,
        longitude: 78.9629,
        pillar2_implemented: false,
        local_top_up_tax: false
    }
];
*/
// Initialize map
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Add countries to map
countries.forEach(country => {
    const color = country.pillar2_implemented ? 'green' : 'gray';

    // Add circle marker for each country
    L.circleMarker([country.latitude, country.longitude], {
        color: color,
        radius: 10
    }).addTo(map).bindPopup(`${country.name}`);

    // Add symbol for Local Top-Up Tax
    if (country.local_top_up_tax) {
        L.marker([country.latitude, country.longitude], {
            icon: L.divIcon({
                className: 'custom-icon',
                html: '<span style="color: red;">+</span>'
            })
        }).addTo(map);
    }
});