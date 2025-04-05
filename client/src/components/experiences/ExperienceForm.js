import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, Plus, X, Upload, Calendar as CalendarIcon, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import api from '../../utils/api';
import { getRandomImage, unsplashImages } from '../../lib/utils';

const ExperienceForm = ({ experience = null }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      city: '',
      country: '',
    },
    images: [],
    dateOfVisit: {
      startDate: '',
      endDate: '',
    },
    categories: [''],
    tips: [''],
    budget: {
      amount: '',
      currency: 'USD',
    },
    rating: 5,
  });

  // Add state for Unsplash image selection
  const [showUnsplashGallery, setShowUnsplashGallery] = useState(false);
  const [unsplashSearchTerm, setUnsplashSearchTerm] = useState('');
  const [unsplashPreviewImages, setUnsplashPreviewImages] = useState([]);

  // Populate form if editing
  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || '',
        description: experience.description || '',
        location: {
          city: experience.location?.city || '',
          country: experience.location?.country || '',
        },
        images: experience.images || [],
        dateOfVisit: {
          startDate: experience.dateOfVisit?.startDate ? new Date(experience.dateOfVisit.startDate).toISOString().split('T')[0] : '',
          endDate: experience.dateOfVisit?.endDate ? new Date(experience.dateOfVisit.endDate).toISOString().split('T')[0] : '',
        },
        categories: experience.categories?.length ? experience.categories : [''],
        tips: experience.tips?.length ? experience.tips : [''],
        budget: {
          amount: experience.budget?.amount || '',
          currency: experience.budget?.currency || 'USD',
        },
        rating: experience.rating || 5,
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNestedSelectChange = (parent, child, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: value,
      },
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: newArray.length ? newArray : [''],
    });
  };

  const handleImageUpload = () => {
    // For demo purposes, add a random Unsplash image
    const randomImage = getRandomImage('landscapes');
    setFormData({
      ...formData,
      images: [...formData.images, randomImage]
    });
    toast.success("Added image from Unsplash");
  };
  
  // New function to handle Unsplash gallery
  const toggleUnsplashGallery = () => {
    setShowUnsplashGallery(!showUnsplashGallery);
    if (!showUnsplashGallery) {
      // Show 12 preview images when opening gallery
      const previewImages = [
        ...Object.values(unsplashImages.landscapes).slice(0, 3),
        ...Object.values(unsplashImages.cities).slice(0, 3),
        ...Object.values(unsplashImages.beaches).slice(0, 3),
        ...Object.values(unsplashImages.nature).slice(0, 3)
      ];
      setUnsplashPreviewImages(previewImages);
    }
  };
  
  const handleUnsplashSearch = (e) => {
    e.preventDefault();
    if (!unsplashSearchTerm.trim()) return;
    
    // For demo purposes, show preselected images based on category
    let searchResults = [];
    const term = unsplashSearchTerm.toLowerCase();
    
    if (term.includes('beach')) {
      searchResults = unsplashImages.beaches;
    } else if (term.includes('city') || term.includes('urban')) {
      searchResults = unsplashImages.cities;
    } else if (term.includes('food')) {
      searchResults = unsplashImages.food;
    } else if (term.includes('nature')) {
      searchResults = unsplashImages.nature;
    } else {
      // Mix of images
      searchResults = [
        ...Object.values(unsplashImages.landscapes).slice(0, 2),
        ...Object.values(unsplashImages.cities).slice(0, 2),
        ...Object.values(unsplashImages.beaches).slice(0, 2),
        ...Object.values(unsplashImages.nature).slice(0, 2)
      ];
    }
    
    setUnsplashPreviewImages(searchResults);
    toast.info(`Showing images for "${unsplashSearchTerm}"`);
  };
  
  const selectUnsplashImage = (image) => {
    setFormData({
      ...formData,
      images: [...formData.images, image]
    });
    toast.success("Image added to your experience");
    setShowUnsplashGallery(false);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // For demo purposes, just show a success message and navigate
      setTimeout(() => {
        toast.success(experience ? 'Experience updated successfully!' : 'Experience created successfully!');
        navigate('/profile');
      }, 1000);
      
      // In production, use the API
      /*
      if (experience) {
        // Update experience
        await api.put(`/api/experiences/${experience._id}`, formData);
        toast.success('Experience updated successfully!');
      } else {
        // Create experience
        await api.post('/api/experiences', formData);
        toast.success('Experience created successfully!');
      }
      
      navigate('/profile');
      */
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];
  
  const categories = [
    "Beach", "Mountains", "City", "Nature", "Culture", 
    "Food", "Adventure", "Relaxation", "Shopping", "Historical",
    "Budget", "Luxury", "Wildlife", "Road Trip", "Cruise"
  ];

  const suggestedCategories = categories.filter(
    cat => !formData.categories.includes(cat)
  ).slice(0, 5);

  return (
    <div className="bg-white shadow-sm border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {experience ? 'Edit Experience' : 'Share Your Travel Experience'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Give your travel experience a captivating title"
            required
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="location.city">City</Label>
            <Input
              id="location.city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location.country">Country</Label>
            <Input
              id="location.country"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              placeholder="Country"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Share the details of your travel experience"
            required
            rows="6"
            className="resize-none"
          />
        </div>

        {/* Image Upload - Enhanced with Unsplash Gallery */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Images</Label>
            <button
              type="button"
              onClick={toggleUnsplashGallery}
              className="text-primary text-sm hover:underline flex items-center"
            >
              {showUnsplashGallery ? 'Close Unsplash Gallery' : 'Browse Unsplash Images'}
            </button>
          </div>
          
          {showUnsplashGallery && (
            <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
              <h3 className="text-sm font-medium">Select images from Unsplash</h3>
              
              <form onSubmit={handleUnsplashSearch} className="flex gap-2">
                <input
                  type="text"
                  value={unsplashSearchTerm}
                  onChange={(e) => setUnsplashSearchTerm(e.target.value)}
                  placeholder="Search for travel images..."
                  className="flex-1 px-3 py-2 text-sm border rounded-md"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-3 py-2 rounded-md text-sm"
                >
                  Search
                </button>
              </form>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {unsplashPreviewImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => selectUnsplashImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Unsplash image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        className="bg-white/80 text-gray-900 px-2 py-1 rounded text-xs"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-center text-gray-500">
                All images from Unsplash. Free to use under the Unsplash License.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {formData.images.map((image, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden aspect-square"
              >
                <img 
                  src={image} 
                  alt={`Travel ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-1 right-1 text-xs text-white/80 bg-black/40 px-1 py-0.5 rounded">
                  Unsplash
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleImageUpload}
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">Add Random Image</span>
            </button>
          </div>
        </div>

        {/* Date of Visit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="dateOfVisit.startDate">Start Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="dateOfVisit.startDate"
                name="dateOfVisit.startDate"
                value={formData.dateOfVisit.startDate}
                onChange={handleChange}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="dateOfVisit.endDate">End Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="dateOfVisit.endDate"
                name="dateOfVisit.endDate"
                value={formData.dateOfVisit.endDate}
                onChange={handleChange}
                className="pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Categories</Label>
            {suggestedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {suggestedCategories.map((category, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleArrayChange('categories', 0, category)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {formData.categories.map((category, index) => (
            <div className="flex items-center gap-2" key={`category-${index}`}>
              <Input
                value={category}
                onChange={(e) => handleArrayChange('categories', index, e.target.value)}
                placeholder={`Category ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('categories', index)}
                disabled={formData.categories.length === 1 && !category}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('categories')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        {/* Travel Tips */}
        <div className="space-y-3">
          <Label>Travel Tips</Label>
          {formData.tips.map((tip, index) => (
            <div className="flex items-center gap-2" key={`tip-${index}`}>
              <Input
                value={tip}
                onChange={(e) => handleArrayChange('tips', index, e.target.value)}
                placeholder={`Tip ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('tips', index)}
                disabled={formData.tips.length === 1 && !tip}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('tips')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Tip
          </Button>
        </div>

        <Separator />

        {/* Budget and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Budget</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  name="budget.amount"
                  value={formData.budget.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                />
              </div>
              <div className="w-32">
                <Select
                  value={formData.budget.currency}
                  onValueChange={(value) => handleNestedSelectChange('budget', 'currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectChange('rating', value)}
                  className="p-1 focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${value <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {experience ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              experience ? 'Update Experience' : 'Create Experience'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
