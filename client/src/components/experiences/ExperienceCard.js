import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';
import { formatDate, getRandomImage } from '../../lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

const ExperienceCard = ({ experience }) => {
  const {
    _id,
    title,
    description,
    location,
    images,
    dateOfVisit,
    rating,
    user,
    likes,
    categories = []
  } = experience;

  // Default image if none provided
  const displayImage = images && images.length > 0
    ? images[0]
    : getRandomImage('landscapes');

  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <Link to={`/experience/${_id}`}>
          <img 
            src={displayImage} 
            alt={title} 
            className="experience-image"
          />
        </Link>
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md flex items-center">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        
        {categories.length > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {categories[0]}
            </Badge>
          </div>
        )}
        
        {/* Image Attribution - New */}
        <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/40 px-1 py-0.5 rounded">
          Unsplash
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-4">
        <Link 
          to={`/experience/${_id}`}
          className="text-xl font-bold text-gray-900 hover:text-primary line-clamp-2 mb-1"
        >
          {title}
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {location.city}, {location.country}
        </div>
        {dateOfVisit && dateOfVisit.startDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatDate(dateOfVisit.startDate)}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-gray-600 line-clamp-3 text-sm">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center">
          <Avatar className="h-7 w-7 mr-2">
            <AvatarImage src={user.profilePicture || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <div className="flex items-center text-rose-500">
          <Heart className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{likes ? likes.length : 0}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExperienceCard;
