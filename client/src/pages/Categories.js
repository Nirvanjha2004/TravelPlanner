import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { unsplashImages, dummyExperiences } from '../lib/utils';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // All available categories with guaranteed image mapping
  const categories = [
    "Beach", "Mountains", "Cultural", "Food", "Urban", 
    "Nature", "Adventure", "Relaxation", "Shopping", "Historical",
    "Budget", "Luxury", "Wildlife", "Road Trip", "Cruise"
  ];

  // Add a helper function for fallback images
  const getCategoryImage = (category) => {
    // Try our predefined images first
    const image = unsplashImages.categories[category];
    
    // If we have a valid image, use it
    if (image) return image;
    
    // Otherwise use these reliable fallbacks based on category
    switch(category.toLowerCase()) {
      case 'cultural':
        return "https://images.unsplash.com/photo-1552248524-10d9a7e4b84a";
      case 'historical':
        return "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e";
      default:
        // Use a placeholder service as last resort
        return `https://placehold.co/400x300/3498db/ffffff?text=${encodeURIComponent(category)}`;
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      
      // For demo purposes, filter dummy experiences by selected category
      setTimeout(() => {
        const filtered = dummyExperiences.filter(exp => 
          exp.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
        );
        setFilteredExperiences(filtered);
        setLoading(false);
      }, 500);
    } else {
      setFilteredExperiences([]);
    }
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    
    if (term) {
      const matchedCategories = categories.filter(cat => 
        cat.toLowerCase().includes(term)
      );
      
      if (matchedCategories.length > 0) {
        setSelectedCategory(matchedCategories[0]);
      }
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore by Category</h1>
        <p className="text-muted-foreground">
          Discover travel experiences organized by interests and activities
        </p>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Button type="submit" className="absolute right-1 top-1 bottom-1 rounded-md">
            Search
          </Button>
        </div>
      </form>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative rounded-lg overflow-hidden h-32 group ${
              selectedCategory === category ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img 
              src={getCategoryImage(category)}
              alt={category} 
              className="w-full h-full object-cover group-hover:scale-105 transition-duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/400x300/3498db/ffffff?text=${encodeURIComponent(category)}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-3 w-full">
                <h3 className="text-white font-medium text-center">{category}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Selected Category */}
      {selectedCategory && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedCategory} Experiences</h2>
              <p className="text-muted-foreground">
                Showing {filteredExperiences.length} experiences in this category
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              View All Categories
            </Button>
          </div>
          
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
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-xl font-medium mb-2">No experiences found</p>
              <p className="text-gray-500 mb-6">Be the first to share a {selectedCategory.toLowerCase()} experience!</p>
              <Button asChild>
                <Link to="/add-experience">Share Experience</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience._id} experience={experience} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Categories;
