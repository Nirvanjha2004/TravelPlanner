import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bookmark } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { dummyExperiences, unsplashImages } from '../lib/utils';

const Explore = () => {
  const [experiences, setExperiences] = useState(dummyExperiences);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ["All", "Beach", "Mountains", "Cultural", "Food", "Urban", "Nature", "Adventure"];
  
  const handleFilterChange = (filter) => {
    setLoading(true);
    setActiveFilter(filter.toLowerCase());
    
    // Filter experiences based on category
    setTimeout(() => {
      if (filter.toLowerCase() === 'all') {
        setExperiences(dummyExperiences);
      } else {
        setExperiences(dummyExperiences.filter(exp => 
          exp.categories.some(cat => cat.toLowerCase() === filter.toLowerCase())
        ));
      }
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Search experiences based on searchTerm
    setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = dummyExperiences.filter(exp => 
        exp.title.toLowerCase().includes(term) || 
        exp.location.city.toLowerCase().includes(term) ||
        exp.location.country.toLowerCase().includes(term) ||
        exp.description.toLowerCase().includes(term)
      );
      setExperiences(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Experiences</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destinations, experiences..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </form>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-500" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">
          {experiences.length} experiences found
        </h2>
        <Separator />
      </div>

      {/* Grid of Experiences */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
      ) : experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-2">No experiences found</p>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
          <Button onClick={() => {
            setActiveFilter('all');
            setSearchTerm('');
            setExperiences(dummyExperiences);
          }}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      )}

      {/* Featured Destinations */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(unsplashImages.locations).slice(0, 8).map(([location, image], index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-40">
                <img 
                  src={image} 
                  alt={location} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-white" /> 
                      <h3 className="font-medium text-white">{location}</h3>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
