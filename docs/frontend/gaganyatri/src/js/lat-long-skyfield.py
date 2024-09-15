from skyfield.api import EarthSatellite, load

# Load timescale and TLE data
ts = load.timescale()
line1 = '1 25544U 98067A 14020.93268519 .00009878 00000-0 18200-3 0 5082'
line2 = '2 25544 51.6498 109.4756 0003572 55.9686 274.8005 15.49815350868473'
satellite = EarthSatellite(line1, line2, 'ISS (ZARYA)', ts)

# Compute position
t = ts.now()
geocentric = satellite.at(t)
subpoint = geocentric.subpoint()

# Get latitude and longitude
latitude = subpoint.latitude.degrees
longitude = subpoint.longitude.degrees

print(f"Latitude: {latitude}, Longitude: {longitude}")
