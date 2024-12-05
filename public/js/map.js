   
 const apiKey = mapToken; // Replace with your Geoapify API key
 const coordinate = coordinates;
 if (coordinate && Array.isArray(coordinate) && coordinate.length === 2) {
 // Initialize the map
 const map = L.map('map').setView(coordinate, 13); // Replace with your desired coordinates
 
 // Add Geoapify tiles
 L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
   attribution: '© OpenStreetMap contributors, © Geoapify',
   maxZoom: 20,
 }).addTo(map);

 const marker = L.marker(coordinate).addTo(map);
}else{
  console.error("Invalid coordinates data:",  coordinate);
}

 console.log("Coordinates:", coordinate);
//  const marker = L.marker(coordinates).addTo(map);