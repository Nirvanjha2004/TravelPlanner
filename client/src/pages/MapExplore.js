import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dummyExperiences } from '../lib/utils';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin } from 'lucide-react';

const MapExplore = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [MapWithMarkers, setMapWithMarkers] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Check if we're running on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get experiences data
  useEffect(() => {
    // Transform experiences to include coordinates
    const experiencesWithCoords = dummyExperiences.map(exp => {
      let coords = [0, 0];
      
      switch (exp.location.country) {
        case 'Thailand': 
          coords = [13.7563, 100.5018]; break;
        case 'Indonesia': 
          coords = [-8.5069, 115.2625]; break;
        case 'Switzerland': 
          coords = [46.6863, 7.8632]; break;
        case 'Tanzania': 
          coords = [-2.3333, 34.8333]; break;
        default: 
          coords = [0, 0];
      }
      
      return {...exp, coords};
    });
    
    setExperiences(experiencesWithCoords);
    setLoading(false);
  }, []);
  
  // Dynamically load and render the map
  useEffect(() => {
    if (!isClient || loading) return;

    const loadMapComponent = async () => {
      try {
        // Dynamically import the required modules
        const L = await import('leaflet');
        const ReactLeaflet = await import('react-leaflet');
        const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet;

        // Create custom icon
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        // Create the Map component
        const WorldMap = () => (
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            style={{ height: '70vh', width: '100%' }} 
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {experiences.map(exp => (
              <Marker 
                key={exp._id || exp.id}
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
                      to={`/experience/${exp._id || exp.id}`}
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

        setMapWithMarkers(<WorldMap />);
      } catch (err) {
        console.error('Failed to load map:', err);
        setError('Failed to initialize interactive map');
      }
    };

    loadMapComponent();
  }, [experiences, isClient, loading]);
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-4">Explore Travel Experiences on Map</h1>
      <p className="mb-6 text-muted-foreground">Find travel experiences based on locations around the world</p>
      
      {/* World Map with experience markers */}
      <div className="rounded-lg overflow-hidden border shadow-sm mb-8">
        {loading ? (
          <div className="h-[70vh] bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="h-[70vh] bg-gray-100 flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : !MapWithMarkers ? (
          <div className="h-[70vh] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Loading interactive map...</p>
          </div>
        ) : (
          MapWithMarkers
        )}
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">All Travel Experiences</h2>
      
      {/* List view of experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map(exp => (
          <Link to={`/experience/${exp._id || exp.id}`} key={exp._id || exp.id}>
            <Card className="p-4 hover:shadow-md transition-shadow h-full">
              <div className="flex gap-4">
                <img 
                  src={exp.images[0]} 
                  alt={exp.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold mb-1">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {exp.location.city}, {exp.location.country}
                  </p>
                  <p className="text-sm line-clamp-2">{exp.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MapExplore;
