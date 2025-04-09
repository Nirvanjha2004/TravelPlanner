import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Pencil, MapPin, Mail, Loader2, Plus, Calendar, Settings, 
  Globe, Instagram, Twitter, Facebook, ExternalLink, PieChart
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
// Add Badge import
import { Badge } from '../components/ui/badge';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { dummyExperiences, dummyUsers } from '../lib/utils';

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL if present
  const { user: currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });

  // Add new state and functionality
  const [isFollowing, setIsFollowing] = useState(false);
  const [userStats, setUserStats] = useState({
    totalLikes: 0,
    totalComments: 0,
    mostVisitedCountry: '',
    experiencesByCategory: {}
  });

  // Check if we're viewing the current user's profile or another user's
  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile) {
          // Use current user data
          setProfileUser(currentUser);
          setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            bio: currentUser?.bio || '',
            location: currentUser?.location || '',
          });
        } else {
          // For demo purposes, find the user from dummy data
          const foundUser = dummyUsers.find(u => u._id === userId) || dummyUsers[0];
          
          // In production, fetch the user from API
          // const res = await api.get(`/api/users/${userId}`);
          // const foundUser = res.data;
          
          setProfileUser(foundUser);
        }
        
        // For demo purposes, use filtered dummy data
        // Filter experiences by the viewed user
        const userExperiences = dummyExperiences.filter(
          exp => exp.user._id === (isOwnProfile ? (currentUser?._id || 'user1') : userId)
        );
        setExperiences(userExperiences);
        
        // In production, fetch experiences from API
        /*
        const res = await api.get(`/api/experiences?user=${isOwnProfile ? currentUser._id : userId}`);
        setExperiences(res.data.experiences);
        */
      } catch (error) {
        toast.error('Failed to fetch profile data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser || userId) {
      fetchUserProfile();
    }
  }, [currentUser, userId, isOwnProfile]);

  useEffect(() => {
    // Calculate user stats for the profile
    if (experiences.length > 0) {
      // Count total likes
      const likes = experiences.reduce((total, exp) => total + (exp.likes?.length || 0), 0);
      
      // Count countries and find most visited
      const countriesCount = {};
      experiences.forEach(exp => {
        const country = exp.location.country;
        countriesCount[country] = (countriesCount[country] || 0) + 1;
      });
      
      const mostVisited = Object.keys(countriesCount).reduce((a, b) => 
        countriesCount[a] > countriesCount[b] ? a : b
      );
      
      // Count experiences by category
      const categoryCount = {};
      experiences.forEach(exp => {
        exp.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      });
      
      setUserStats({
        totalLikes: likes,
        totalComments: 0, // Would need to fetch from API
        mostVisitedCountry: mostVisited,
        experiencesByCategory: categoryCount
      });
    }
  }, [experiences]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed user' : 'Following user');
    // In production, would call API:
    // await api.post('/api/users/follow', { userId });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileUser && !loading) {
    return (
      <div className="container-custom py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <p className="text-muted-foreground mb-6">The profile you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary h-24"></div>
            <div className="px-6 pb-6 text-center">
              <div className="relative inline-block -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarImage src={profileUser?.profilePicture || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{profileUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold mb-1">{profileUser?.name}</h2>
              {profileUser?.location && (
                <p className="flex items-center justify-center text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profileUser.location}
                </p>
              )}
              
              {isOwnProfile ? (
                <div className="flex justify-center">
                  <Button 
                    variant={isEditing ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={handleFollow}
                    className="flex items-center"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="mt-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              {isOwnProfile && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">{profileUser?.email}</p>
                </div>
              )}
              
              {/* Social Media Links - New */}
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href="#" className="text-sm text-primary hover:underline">travelblog.com</a>
              </div>
              
              <div className="flex space-x-3 mt-2">
                <button className="text-gray-500 hover:text-[#1DA1F2]">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-[#E4405F]">
                  <Instagram className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-[#1877F2]">
                  <Facebook className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Card>
          
          {/* Stats Card */}
          <Card className="mt-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Stats</h3>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-2xl font-bold">{experiences.length}</p>
                <p className="text-xs text-muted-foreground">Experiences</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.totalLikes}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Additional Stats - New */}
            <div className="space-y-2">
              {userStats.mostVisitedCountry && (
                <div>
                  <p className="text-xs text-muted-foreground">Most Visited</p>
                  <p className="font-medium">{userStats.mostVisitedCountry}</p>
                </div>
              )}
              
              {Object.keys(userStats.experiencesByCategory).length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mt-2">Top Categories</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(userStats.experiencesByCategory)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([category, count]) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category} ({count})
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Member Since - New */}
          <Card className="mt-4 p-6 text-center">
            <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-sm">Member since</p>
            <p className="font-medium">January 2023</p>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {isEditing && isOwnProfile ? (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where are you based? (e.g. New York, USA)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <>
              {/* Bio */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">About</h2>
                {profileUser?.bio ? (
                  <p className="text-gray-700">{profileUser.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    {isOwnProfile 
                      ? "No bio provided yet. Edit your profile to add one."
                      : `${profileUser?.name} hasn't added a bio yet.`}
                  </p>
                )}
              </Card>
              
              {/* Activity Feed - New */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {experiences.slice(0, 2).map((exp, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1 h-full bg-primary/20 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {index === 0 ? '2 days ago' : '1 week ago'}
                        </p>
                        <p className="font-medium">
                          {isOwnProfile ? 'You' : profileUser?.name} shared a new experience
                        </p>
                        <Link 
                          to={`/experience/${exp._id}`}
                          className="text-primary hover:underline flex items-center text-sm"
                        >
                          <span>{exp.title}</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Experiences Tabs */}
              <Tabs defaultValue="experiences">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="experiences" className="relative px-6">
                      {isOwnProfile ? "My Experiences" : `${profileUser?.name}'s Experiences`}
                      <span className="absolute top-0 right-1 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {experiences.length}
                      </span>
                    </TabsTrigger>
                    {isOwnProfile && (
                      <TabsTrigger value="saved" className="relative px-6">
                        Saved
                        <span className="absolute top-0 right-1 bg-gray-400 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                          0
                        </span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  {isOwnProfile && (
                    <Button asChild>
                      <Link to="/add-experience" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Share Experience
                      </Link>
                    </Button>
                  )}
                </div>
                
                <TabsContent value="experiences" className="mt-0">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map(n => (
                        <div key={n} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
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
                  ) : experiences.length === 0 ? (
                    <Card className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">No experiences yet</h3>
                      <p className="text-muted-foreground mb-4">
                        {isOwnProfile 
                          ? "Start sharing your travel adventures with the community." 
                          : `${profileUser?.name} hasn't shared any experiences yet.`}
                      </p>
                      {isOwnProfile && (
                        <Button asChild>
                          <Link to="/add-experience">Share Your First Experience</Link>
                        </Button>
                      )}
                    </Card>
                  ) : (
                    <>
                      {/* Filter Controls - New */}
                      <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">Filter by:</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-full"
                            onClick={() => toast.info('Category filter would be applied')}
                          >
                            All Categories
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-full"
                            onClick={() => toast.info('Location filter would be applied')}
                          >
                            All Locations
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="rounded-full"
                            onClick={() => toast.info('Date filter would be applied')}
                          >
                            All Time
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-auto"
                            onClick={() => toast.info('Sort order would change')}
                          >
                            <Settings className="h-4 w-4 mr-1" /> Sort by: Latest
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {experiences.map(experience => (
                          <ExperienceCard key={experience._id} experience={experience} />
                        ))}
                      </div>
                      
                      {experiences.length > 0 && (
                        <div className="flex justify-center mt-8">
                          <Button 
                            variant="outline"
                            onClick={() => toast.info('More experiences would load')}
                          >
                            Load More
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                
                {isOwnProfile && (
                  <TabsContent value="saved" className="mt-0">
                    <Card className="p-8 text-center">
                      <h3 className="text-lg font-medium mb-2">No saved experiences</h3>
                      <p className="text-muted-foreground mb-4">
                        When you save experiences, they'll appear here for quick access.
                      </p>
                      <Button variant="outline" asChild>
                        <Link to="/">Explore Experiences</Link>
                      </Button>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
