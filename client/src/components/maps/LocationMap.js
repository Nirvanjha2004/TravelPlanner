import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Create a Map component that only renders on client-side 
const LocationMap = ({ 
  location, 
  height = '300px', 
  width = '100%', 
  zoom = 13,
  className = '',
  popup = true
}) => {
  const [coords, setCoords] = useState([13.7563, 100.5018]); // Default coords (Bangkok)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [mapComponent, setMapComponent] = useState(null);
  
  // Check if we're in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Set coordinates based on location
  useEffect(() => {
    if (!location || (!location.city && !location.country)) {
      setLoading(false);
      return;
    }
      
    try {
      const searchTerm = location.city ? 
        `${location.city}, ${location.country}` : 
        location.country;
      
      // Simple mapping of locations to coordinates
      const knownLocations = {
        'Bangkok, Thailand': [13.7563, 100.5018],
        'Thailand': [13.7563, 100.5018],
        'Ubud, Indonesia': [-8.5069, 115.2625],
        'Indonesia': [-0.7893, 113.9213],
        'Interlaken, Switzerland': [46.6863, 7.8632],
        'Switzerland': [46.8182, 8.2275],
        'Serengeti, Tanzania': [-2.3333, 34.8333],
        'Tanzania': [-6.369, 34.8888]
      };
      
      if (knownLocations[searchTerm]) {
        setCoords(knownLocations[searchTerm]);
      } else if (location.country) {
        // Fallback by country
        if (location.country === 'Thailand') setCoords([13.7563, 100.5018]);
        else if (location.country === 'Indonesia') setCoords([-0.7893, 113.9213]);
        else if (location.country === 'Switzerland') setCoords([46.8182, 8.2275]);
        else if (location.country === 'Tanzania') setCoords([-6.369, 34.8888]);
        else setCoords([0, 0]); 
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error setting coordinates:", err);
      setError("Couldn't load map location");
      setLoading(false);
    }
  }, [location]);

  // Dynamically import and render the map component
  useEffect(() => {
    if (!isClient) return;

    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const locationName = location?.city ? 
          `${location.city}, ${location.country}` : 
          location?.country || "Unknown location";

        const Map = () => (
          <MapContainer 
            center={coords} 
            zoom={zoom} 
            style={{ height, width }}
            className={`rounded-lg border border-gray-200 ${className}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} icon={icon}>
              {popup && <Popup>{locationName}</Popup>}
            </Marker>
          </MapContainer>
        );

        setMapComponent(<Map />);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load map:', err);
        setError('Failed to load map component');
        setLoading(false);
      }
    };

    loadMap();
  }, [coords, isClient, height, width, zoom, className, location, popup]);

  if (!isClient || loading) {
    return (
      <div 
        className={`bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
        style={{ height, width }}
      >
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ height, width }}
      >
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return mapComponent || (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ height, width }}
    >
      <p className="text-gray-400">Initializing map...</p>
    </div>
  );
};

export default LocationMap;
