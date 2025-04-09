import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, MapPin, Calendar, DollarSign, Star, Edit, Trash2, Tag, User as UserIcon, 
  Share2, Bookmark, BookmarkCheck, Copy, Check, ExternalLink, Camera, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { formatDate, dummyExperiences } from '../lib/utils';
import LocationMap from '../components/maps/LocationMap';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Add state for new functionality
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedExperiences, setRelatedExperiences] = useState([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, use dummy data
        setTimeout(() => {
          const foundExperience = dummyExperiences.find(exp => exp._id === id);
          if (foundExperience) {
            setExperience(foundExperience);
            
            // Check if user has liked this experience
            if (user && foundExperience.likes.includes(user._id)) {
              setIsLiked(true);
            }
          } else {
            toast.error('Experience not found');
            navigate('/');
          }
          setLoading(false);
        }, 500);
        
        // In production, use the API
        /*
        const res = await api.get(`/api/experiences/${id}`);
        setExperience(res.data);
        
        // Check if user has liked this experience
        if (user && res.data.likes.includes(user._id)) {
          setIsLiked(true);
        }
        */
      } catch (error) {
        toast.error('Failed to load experience details');
        navigate('/');
      }
    };

    fetchExperience();
  }, [id, navigate, user]);

  useEffect(() => {
    // Add related experiences based on categories or location
    if (experience) {
      const related = dummyExperiences.filter(exp => 
        exp._id !== id && (
          exp.categories.some(cat => experience.categories.includes(cat)) || 
          exp.location.country === experience.location.country
        )
      ).slice(0, 3);
      
      setRelatedExperiences(related);
    }
  }, [experience, id]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like this experience');
      return;
    }

    try {
      setIsLiked(!isLiked);
      
      // In production, use the API
      /*
      const res = await api.put(`/api/experiences/${id}/like`);
      setExperience({
        ...experience,
        likes: res.data.likes,
      });
      */
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        // In production, use the API
        // await api.delete(`/api/experiences/${id}`);
        
        toast.success('Experience deleted successfully');
        navigate('/profile');
      } catch (error) {
        toast.error('Failed to delete experience');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to leave a comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmittingComment(true);
      
      // In production, use the API
      /*
      const res = await api.post('/api/comments', {
        text: newComment,
        experienceId: id,
      });
      
      setComments([res.data, ...comments]);
      */
      
      // For demo purposes, add a dummy comment
      const dummyComment = {
        _id: `comment-${Date.now()}`,
        text: newComment,
        user: {
          _id: user?._id || 'current-user',
          name: user?.name || 'Current User',
          profilePicture: user?.profilePicture || "https://github.com/shadcn.png"
        },
        createdAt: new Date().toISOString()
      };
      
      setComments([dummyComment, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        // In production, use the API
        // await api.delete(`/api/comments/${commentId}`);
        
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from saved experiences' : 'Added to saved experiences');
    // In production: save to API
    // await api.post('/api/users/bookmarks', { experienceId: id });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareToSocial = (platform) => {
    let url = '';
    const shareText = `Check out this amazing travel experience: ${experience.title}`;
    const shareUrl = encodeURIComponent(window.location.href);
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ': ' + window.location.href)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const {
    title,
    description,
    user: experienceUser,
    location,
    images = [experience.images[0]],
    dateOfVisit,
    categories = [],
    tips = [],
    budget,
    rating,
    likes = [],
    createdAt = new Date().toISOString(),
  } = experience;

  const isOwner = user && experienceUser._id === user._id;

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb Navigation - New */}
      <nav className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center space-x-1">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li className="px-1">/</li>
          <li><Link to="/" className="hover:text-primary">Experiences</Link></li>
          <li className="px-1">/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden shadow-md aspect-video">
              <img 
                src={images[activeImage] || "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000&auto=format&fit=crop"}
                alt={title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Attribution - New */}
              <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
                Photo from Unsplash
              </div>
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-2 h-2 rounded-full ${
                        idx === activeImage ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Image Count Badge */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  {activeImage + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery - New */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer ${
                      idx === activeImage ? 'ring-2 ring-primary' : 'opacity-70'
                    }`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`${title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Experience Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {categories.map((category, idx) => (
                  <Badge key={idx} variant="secondary">{category}</Badge>
                ))}
              </div>
              
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {location.city}, {location.country}
              </div>
              
              {dateOfVisit && dateOfVisit.startDate && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(dateOfVisit.startDate)}
                  {dateOfVisit.endDate && ` - ${formatDate(dateOfVisit.endDate)}`}
                </div>
              )}
              
              <div className="flex items-center ml-auto space-x-2">
                {/* Like Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center ${isLiked ? "text-rose-500" : "text-gray-500"}`}
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 mr-1 ${isLiked ? "fill-rose-500" : ""}`} />
                  <span>{likes.length}</span>
                </Button>
                
                {/* Bookmark Button - New */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={toggleBookmark}
                  title={bookmarked ? "Remove from saved" : "Save for later"}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="w-5 h-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
                
                {/* Share Button - New */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  
                  {showShareOptions && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10 border py-2">
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleShareToSocial('facebook')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Facebook
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleShareToSocial('twitter')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Twitter
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleShareToSocial('whatsapp')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> WhatsApp
                      </button>
                      <Separator className="my-1" />
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={handleCopyLink}
                      >
                        {copiedLink ? (
                          <><Check className="h-4 w-4 mr-2 text-green-500" /> Link copied!</>
                        ) : (
                          <><Copy className="h-4 w-4 mr-2" /> Copy link</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                {isOwner && (
                  <div className="flex items-center ml-2">
                    <Button variant="ghost" size="sm" className="text-blue-500" asChild>
                      <Link to={`/edit-experience/${id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Tabbed Content */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="tips">Travel Tips</TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                Comments
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {comments.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="pt-6">
              {tips.length > 0 ? (
                <ul className="space-y-4">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mr-3 mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700">{tip}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No travel tips shared for this experience.</p>
              )}
            </TabsContent>
            
            <TabsContent value="comments" className="pt-6 space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-2">
                    <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={user ? "Share your thoughts about this experience..." : "Please login to comment"}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={!user || submittingComment}
                      className="resize-none min-h-[100px]"
                    />
                    <div className="flex justify-end mt-2">
                      <Button type="submit" disabled={!user || submittingComment} size="sm">
                        {submittingComment ? (
                          <span className="flex items-center">
                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-r-0 rounded-full"></span>
                            Posting...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-2" /> Post Comment
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              
              <Separator />
              
              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={comment.user.profilePicture} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{comment.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {user && user._id === comment.user._id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-rose-500 h-7 px-2"
                            onClick={() => handleCommentDelete(comment._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={experienceUser.profilePicture || "https://github.com/shadcn.png"} />
                <AvatarFallback>
                  <UserIcon className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Shared by</h3>
                <p className="font-bold text-lg">{experienceUser.name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Posted on {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/profile/${experienceUser._id}`}>View Profile</Link>
            </Button>
          </div>
          
          {/* Trip Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="font-semibold text-lg mb-4">Trip Details</h3>
            
            {dateOfVisit && (dateOfVisit.startDate || dateOfVisit.endDate) && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <p>
                    {dateOfVisit.startDate ? formatDate(dateOfVisit.startDate) : 'Not specified'} 
                    {dateOfVisit.endDate && ` - ${formatDate(dateOfVisit.endDate)}`}
                  </p>
                </div>
              </div>
            )}
            
            {budget && budget.amount && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="font-semibold">
                    {budget.amount} {budget.currency}
                  </p>
                </div>
              </div>
            )}
            
            {categories && categories.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, idx) => (
                    <Badge key={idx} className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Map Preview - Use static image instead until map loads */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Location</p>
              <div className="aspect-video w-full">
                <LocationMap location={location} height="200px" />
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.city}, ${location.country}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm flex items-center hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Open in Google Maps
              </a>
            </div>
          </div>
          
          {/* Similar Experiences Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="font-semibold text-lg mb-4">Similar Experiences</h3>
            
            <div className="space-y-4">
              {relatedExperiences.length > 0 ? (
                relatedExperiences.map(exp => (
                  <Link 
                    key={exp._id} 
                    to={`/experience/${exp._id}`} 
                    className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                  >
                    <img 
                      src={exp.images[0]} 
                      alt={exp.title} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{exp.title}</h4>
                      <p className="text-xs text-muted-foreground">{exp.location.city}, {exp.location.country}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">No similar experiences found</p>
              )}
            </div>
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/">Explore More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
