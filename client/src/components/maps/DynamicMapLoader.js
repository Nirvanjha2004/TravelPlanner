import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dummyExperiences } from '../../lib/utils';
import 'leaflet/dist/leaflet.css';

export const DynamicMapLoader = () => {
  const [mapPosition] = useState([20, 0]); // Default to world view
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapComponent, setMapComponent] = useState(null);
  
  useEffect(() => {
    // Process experiences with coordinates
    const experiencesWithCoords = dummyExperiences.map(exp => {
      // For demo, use hardcoded coordinates based on country
      let coords = [0, 0];
      
      switch (exp.location.country) {
        case 'Thailand':
          coords = [13.7563, 100.5018];
          break;
        case 'Indonesia':
          coords = [-8.5069, 115.2625];
          break;
        case 'Switzerland':
          coords = [46.6863, 7.8632];
          break;
        case 'Tanzania':
          coords = [-2.3333, 34.8333];
          break;
        default:
          coords = [0, 0];
      }
      
      return {...exp, coords};
    });
    
    setExperiences(experiencesWithCoords);
    setLoading(false);
  }, []);

  // Dynamically load map component only after component is mounted
  useEffect(() => {
    const importMapComponents = async () => {
      try {
        if (typeof window !== 'undefined' && !loading) {
          // Only import when window is defined and experiences are loaded
          const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
          const L = await import('leaflet');

          // Create a component that uses these imports
          const MapContent = () => {
            // Create marker icon
            const icon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            return (
              <MapContainer 
                center={mapPosition} 
                zoom={2} 
                style={{ height: '70vh', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {experiences.map(exp => (
                  <Marker 
                    key={exp._id}
                    position={exp.coords}
                    icon={icon}
                  >
                    <Popup>
                      <div className="max-w-xs">
                        <h3 className="font-medium mb-1">{exp.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {exp.location.city}, {exp.location.country}
                        </p>
                        <img 
                          src={exp.images[0]} 
                          alt={exp.title}
                          className="w-full h-24 object-cover rounded-sm mb-2"
                        />
                        <Link 
                          to={`/experience/${exp._id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            );
          };

          setMapComponent(<MapContent />);
        }
      } catch (err) {
        console.error("Error importing map components:", err);
      }
    };

    importMapComponents();
  }, [loading, experiences, mapPosition]);

  if (loading) {
    return (
      <div className="h-[70vh] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return mapComponent || (
    <div className="h-[70vh] bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

