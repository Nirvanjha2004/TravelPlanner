import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dummyExperiences } from '../lib/utils';
import { Separator } from '../components/ui/separator';
import { Card } from '../components/ui/card';

const MapExplore = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get locations from experiences and convert to coordinates
    const experiencesWithCoords = dummyExperiences.map(exp => {
      // For demo, use hardcoded coordinates based on country
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
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-4">Explore Travel Experiences on Map</h1>
      <p className="mb-6 text-muted-foreground">Find travel experiences based on locations around the world</p>
      
      {/* World Map Image with Pins - Fallback for React-Leaflet */}
      <div className="rounded-lg overflow-hidden border shadow-sm mb-8">
        <div className="bg-white p-4 text-center">
          <p className="text-muted-foreground">Interactive map is currently unavailable. Showing experiences list instead.</p>
        </div>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Simple_world_map.svg/2000px-Simple_world_map.svg.png" 
          alt="World Map" 
          className="w-full h-64 object-cover object-center"
        />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">All Travel Experiences</h2>
      <Separator className="mb-6" />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded mb-2"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map(exp => (
            <Link to={`/experience/${exp._id}`} key={exp._id}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img 
                    src={exp.images[0]} 
                    alt={exp.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold mb-1">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.location.city}, {exp.location.country}
                    </p>
                    <p className="text-sm line-clamp-2">{exp.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapExplore;
