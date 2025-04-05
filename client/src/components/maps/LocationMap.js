import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

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

  // Use static map instead of dynamic component
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

  // Use a static image map or iframe if dynamic import doesn't work
  const locationText = location?.city ? 
    `${location.city}, ${location.country}` : 
    location?.country || "Unknown location";

  const encodedLocation = encodeURIComponent(locationText);
  
  // Return a static OpenStreetMap image
  return (
    <div 
      className={`rounded-lg border border-gray-200 relative ${className}`}
      style={{ height, width }}
    >
      <iframe 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        scrolling="no" 
        marginHeight="0" 
        marginWidth="0" 
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords[1]-0.01}%2C${coords[0]-0.01}%2C${coords[1]+0.01}%2C${coords[0]+0.01}&layer=mapnik&marker=${coords[0]}%2C${coords[1]}`}
        className="rounded-lg"
      ></iframe>
      {popup && (
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow-sm text-sm">
          {locationText}
        </div>
      )}
    </div>
  );
};

export default LocationMap;
