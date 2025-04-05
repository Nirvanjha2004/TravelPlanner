import { useState, useEffect } from 'react';
import { Search, ArrowRight, Filter, MapPin, Calendar, Tag } from 'lucide-react';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '../components/ui/separator';
import { dummyExperiences, unsplashImages, getRandomImage, getUnsplashImageByTerm } from '../lib/utils';

// Placeholder for Firebase import - create this file before using it
// import { getExperiences } from '../firebase/experienceService';

const Home = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    location: null,
  });

  const categories = ["Beach", "Mountains", "Cultural", "Food", "Urban", "Nature", "Adventure", "Relaxation"];
  const locations = ["Thailand", "Switzerland", "Indonesia", "Tanzania", "Japan", "Italy", "USA", "Australia"];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        
        // Define filters based on state
        const filters = {};
        if (activeFilters.category) filters.category = activeFilters.category;
        if (activeFilters.location) filters.location = activeFilters.location;
        
        // Firebase query - temporarily commented out since file doesn't exist yet
        // const fetchedExperiences = await getExperiences(filters);
        // setExperiences(fetchedExperiences);
        // setTotalPages(Math.ceil(fetchedExperiences.length / 8)); // Assuming 8 items per page
        
        // For now, use dummy data until Firebase is fully set up
        setTimeout(() => {
          setExperiences(dummyExperiences);
          setTotalPages(1);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences. Using demo data instead.');
        
        // Fallback to dummy data if Firebase fails
        setTimeout(() => {
          setExperiences(dummyExperiences);
          setTotalPages(1);
          setLoading(false);
        }, 500);
      }
    };

    fetchExperiences();
  }, [currentPage, activeFilters]);

  const handleFilter = (type, value) => {
    if (activeFilters[type] === value) {
      // Deselect if already active
      setActiveFilters({...activeFilters, [type]: null});
    } else {
      // Select new filter
      setActiveFilters({...activeFilters, [type]: value});
    }
    // Reset to page 1 when filtering
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.elements.search.value;
    setSearchTerm(input);
    setCurrentPage(1);
    // Note: Client-side filtering for search term since Firestore 
    // doesn't support full-text search in the free tier
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Filter experiences by search term (client-side)
  const filteredExperiences = experiences.filter(exp => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      exp.title?.toLowerCase().includes(term) ||
      exp.description?.toLowerCase().includes(term) ||
      exp.location?.city?.toLowerCase().includes(term) ||
      exp.location?.country?.toLowerCase().includes(term) ||
      exp.categories?.some(cat => cat.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - Updated with Unsplash Image */}
      <section 
        className="py-20 md:py-28 text-white relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getRandomImage('landscapes')}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute bottom-2 right-2 text-xs text-white/60">
          Photo by Unsplash
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Share Your Journey, Inspire Others
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover travel experiences from around the world and share your own adventures
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <input
              type="text"
              name="search"
              placeholder="Search by destination, experience, or category"
              className="w-full py-3 px-5 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-white/70" />
            </div>
            <Button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 rounded-full"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Destinations Section - With ID for anchor link */}
      <section id="destinations" className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.slice(0, 4).map((location, index) => (
              <div 
                key={index} 
                className={`relative rounded-lg overflow-hidden h-40 cursor-pointer group ${
                  activeFilters.location === location ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleFilter('location', location)}
              >
                <img 
                  src={unsplashImages.locations[location] || getUnsplashImageByTerm(location)} 
                  alt={location} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <h3 className="font-medium">{location}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - With Unsplash Images */}
      <section id="categories" className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            <Button variant="ghost" size="sm" className="text-primary group flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-lg shadow-sm overflow-hidden border cursor-pointer hover:shadow-md transition-all ${
                  activeFilters.category === category ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleFilter('category', category)}
              >
                <img 
                  src={unsplashImages.categories[category] || getUnsplashImageByTerm(category)}
                  alt={category}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `https://source.unsplash.com/400x300/?${encodeURIComponent(category)},travel`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/20 flex items-end justify-center">
                  <h3 className="text-white font-semibold text-lg mb-4">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Experiences Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Travel Experiences</h2>
              {(activeFilters.category || activeFilters.location || searchTerm) && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4 mr-1" />
                  <span>
                    Filtered by: {' '}
                    {activeFilters.category && (
                      <span className="text-primary font-medium">{activeFilters.category}</span>
                    )}
                    {activeFilters.category && activeFilters.location && <span> & </span>}
                    {activeFilters.location && (
                      <span className="text-primary font-medium">{activeFilters.location}</span>
                    )}
                    {(activeFilters.category || activeFilters.location) && searchTerm && <span> & </span>}
                    {searchTerm && (
                      <span className="text-primary font-medium">"{searchTerm}"</span>
                    )}
                    {' '} 
                    <button 
                      className="text-rose-500 hover:underline ml-2"
                      onClick={() => {
                        setActiveFilters({ category: null, location: null });
                        setSearchTerm('');
                      }}
                    >
                      Clear all
                    </button>
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/add-experience" className="flex items-center">
                  Share yours <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid-cards animate-pulse">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">No experiences found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || activeFilters.category || activeFilters.location ? 
                  "Try adjusting your search or filters" : 
                  "Be the first to share your travel story!"}
              </p>
              <Button asChild>
                <Link to="/add-experience">Share Experience</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid-cards">
                {filteredExperiences.map(experience => (
                  <ExperienceCard 
                    key={experience._id || experience.id} 
                    experience={{
                      ...experience,
                      _id: experience._id || experience.id, // Ensure _id exists for ExperienceCard
                    }}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section - Updated with Unsplash Images */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-10">What Our Travelers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "This platform changed how I plan my trips. The tips from other travelers were invaluable!",
                author: "Jessica K.",
                location: "New York",
                avatar: unsplashImages.people[4]
              },
              {
                quote: "I love sharing my adventures and seeing others react. It's like having a travel community in my pocket.",
                author: "Michael T.",
                location: "London",
                avatar: unsplashImages.people[1]
              },
              {
                quote: "Found the most amazing hidden spots thanks to the detailed experiences shared here!",
                author: "Aisha M.",
                location: "Dubai",
                avatar: unsplashImages.people[2]
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
                <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="mt-auto flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-400 mt-6">
            All images courtesy of Unsplash and contributors
          </div>
        </div>
      </section>

      {/* Call to Action - New */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Journey?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our community of passionate travelers and share your experiences with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/add-experience">Share Experience</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
