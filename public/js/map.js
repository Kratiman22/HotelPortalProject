   
let mapToken = mapToken;
 console.log(mapToken);
 const apiKey = mapToken; // Replace with your Geoapify API key
 
 // Initialize the map
 const map = L.map('map').setView([51.505, -0.09], 13); // Replace with your desired coordinates
 
 // Add Geoapify tiles
 L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
   attribution: '© OpenStreetMap contributors, © Geoapify',
   maxZoom: 20,
 }).addTo(map);