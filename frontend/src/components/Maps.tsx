import React, {useEffect, useState, useRef} from 'react';
import L from 'leaflet';
import {Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableRow, Paper, Container} from '@mui/material';
import 'leaflet/dist/leaflet.css';

#const API_URL = import.meta.env.VITE_BACKEND_APP_API_URL;
#const mapUrl = `${API_URL}satnogs/get_satellite_info?norad_cat_id=98847`;

const mapUrl= 'https://api.wheretheiss.at/v1/satellites/25544';

const Maps = () => {
  const [satelliteData, setSatelliteData] = useState({});
  const [lat, setLat] = useState(49.7929);
  const [long, setLong] = useState(9.9522);
  const zoomLevel = 4;
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map('map-div').setView([lat, long], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initialize marker and store it in a ref
    markerRef.current = L.marker([lat, long]).addTo(map);

    const fetchSatelliteInfo = () => {
      fetch(mapUrl)
          .then((response) => response.json())
          .then((data) => {
            const newLat = data.latitude;
            const newLong = data.longitude;

            setLat(newLat);
            setLong(newLong);
            setSatelliteData({
              timestamp: new Date(data.timestamp * 1000).toUTCString(),
              altitude: data.altitude.toFixed(2),
              line1: data.line1,
              line2: data.line2,
            });

            // Update marker position without causing re-renders
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLong]);
              map.setView([newLat, newLong]);
            }
          })
          .catch((error) => console.error(error));
    };

    fetchSatelliteInfo();
    const intervalId = setInterval(fetchSatelliteInfo, 10000);

    return () => {
      clearInterval(intervalId);
      map.remove(); // Cleanup on unmount
    };
  }, []); // Empty dependency array to run effect only once

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Satellite Tracker
      </Typography>
      <Box id="map-div" sx={{width: '800px', height: '350px', boxShadow: 3}} />
      <Box sx={{backgroundColor: '#2B32B2', padding: 2, color: '#fff', mt: 2,
        width: '800px'}}>
        <TableContainer component={Paper} sx={{marginTop: 2}}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{fontWeight: 'bold'}}>Time</TableCell>
                <TableCell>{satelliteData.timestamp}</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Latitude</TableCell>
                <TableCell>{lat.toFixed(2)}</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Longitude</TableCell>
                <TableCell>{long.toFixed(2)}</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Altitude</TableCell>
                <TableCell>{satelliteData.altitude} km</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{backgroundColor: '#2B32B2', padding: 3, color: '#fff', mt: 2,
        borderRadius: 2, width: '800px'}}>
        <Typography variant="body1">
          <strong>Line 1:</strong> <span>{satelliteData.line1}</span>
        </Typography>
        <Typography variant="body1">
          <strong>Line 2:</strong> <span>{satelliteData.line2}</span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Maps;
