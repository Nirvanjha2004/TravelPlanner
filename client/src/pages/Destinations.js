import { useState } from 'react';
import { Search, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { unsplashImages, dummyExperiences } from '../lib/utils';
import { Link } from 'react-router-dom';
import LocationMap from '../components/maps/LocationMap';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Featured destinations
  const destinations = {
    "Popular": Object.entries(unsplashImages.locations).slice(0, 8),
    "Asia": [
      ["Japan", unsplashImages.locations.Japan],
      ["Thailand", unsplashImages.locations.Thailand],
      ["Indonesia", unsplashImages.locations.Indonesia],
      ["Singapore", "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2000&auto=format&fit=crop"]
    ],
    "Europe": [
      ["Italy", unsplashImages.locations.Italy],
      ["Switzerland", unsplashImages.locations.Switzerland],
      ["France", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop"],
      ["Greece", "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop"]
    ],
    "Americas": [
      ["USA", unsplashImages.locations.USA],
      ["Mexico", "https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=2000&auto=format&fit=crop"],
      ["Brazil", "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000&auto=format&fit=crop"],
      ["Canada", "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2000&auto=format&fit=crop"]
    ],
    "Africa": [
      ["Tanzania", unsplashImages.locations.Tanzania],
      ["Morocco", "https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2000&auto=format&fit=crop"],
      ["South Africa", "https://images.unsplash.com/photo-1552553302-9211bf7f7053?q=80&w=2000&auto=format&fit=crop"],
      ["Egypt", "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2000&auto=format&fit=crop"]
    ]
  };
  
  // Add a helper function for fallback destination images
  const getDestinationImage = (name, url) => {
    if (name === "Egypt" && (!url || url.includes("error"))) {
      return "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368";
    }
    return url || `https://placehold.co/400x300/3498db/ffffff?text=${encodeURIComponent(name)}`;
  };

  // Filter experiences for selected destination
  const getDestinationExperiences = (destinationName) => {
    return dummyExperiences.filter(exp =>
      exp.location.country === destinationName || exp.location.city === destinationName
    );
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Find matching destination in our data
    for (const region in destinations) {
      const match = destinations[region].find(([name]) => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (match) {
        setSelectedDestination({
          name: match[0],
          image: match[1]
        });
        return;
      }
    }
  };
  
  const selectDestination = (name, image) => {
    setLoading(true);
    setSelectedDestination({ name, image });
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Popular Destinations</h1>
        <p className="text-muted-foreground">
          Discover travel experiences from around the world
        </p>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Button type="submit" className="absolute right-1 top-1 bottom-1 rounded-md">
            Search
          </Button>
        </div>
      </form>
      
      {selectedDestination ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
              <p className="text-muted-foreground">
                Travel experiences in {selectedDestination.name}
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedDestination(null)}>
              View All Destinations
            </Button>
          </div>
          
          {/* Hero image for selected destination */}
          <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden">
            <img 
              src={selectedDestination.image} 
              alt={selectedDestination.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 w-full">
                <h3 className="text-white font-bold text-3xl">
                  {selectedDestination.name}
                </h3>
                <div className="flex items-center text-white/90 text-sm">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>Popular travel destination</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add map for selected destination */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Destination Map</h3>
            <div className="rounded-lg overflow-hidden">
              <LocationMap 
                location={{ country: selectedDestination.name }}
                height="400px"
                zoom={6}
              />
            </div>
          </div>
          
          {/* Experiences in this destination */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {getDestinationExperiences(selectedDestination.name).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getDestinationExperiences(selectedDestination.name).map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-xl font-medium mb-2">No experiences found</p>
                  <p className="text-gray-500 mb-6">
                    Be the first to share an experience in {selectedDestination.name}!
                  </p>
                  <Button asChild>
                    <Link to="/add-experience">Share Experience</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Destinations by Region */}
          {Object.entries(destinations).map(([region, regionDestinations]) => (
            <section key={region} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{region} Destinations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {regionDestinations.map(([name, image]) => (
                  <Card 
                    key={name} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectDestination(name, image)}
                  >
                    <div className="relative h-40">
                      <img 
                        src={getDestinationImage(name, image)} 
                        alt={name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x300/3498db/ffffff?text=${encodeURIComponent(name)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-white" /> 
                            <h3 className="font-medium text-white">{name}</h3>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {region === "Popular" && <Separator className="mt-8" />}
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default Destinations;
