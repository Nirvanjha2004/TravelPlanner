import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ExperienceForm from '../components/experiences/ExperienceForm';
import { dummyExperiences } from '../lib/utils';

const EditExperience = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, use dummy data
        setTimeout(() => {
          const foundExperience = dummyExperiences.find(exp => exp._id === id);
          
          if (foundExperience) {
            // Check if the current user is the creator of this experience
            if (foundExperience.user._id !== (user?._id || 'user1')) {
              toast.error('Not authorized to edit this experience');
              navigate('/profile');
              return;
            }
            
            setExperience(foundExperience);
          } else {
            toast.error('Experience not found');
            navigate('/profile');
          }
          
          setLoading(false);
        }, 500);
        
        // In production, use the API
        /*
        const res = await api.get(`/api/experiences/${id}`);
        
        // Check if the current user is the creator of this experience
        if (res.data.user._id !== user._id) {
          toast.error('Not authorized to edit this experience');
          navigate('/profile');
          return;
        }
        
        setExperience(res.data);
        setLoading(false);
        */
      } catch (error) {
        toast.error('Experience not found');
        navigate('/profile');
      }
    };
    
    fetchExperience();
  }, [id, navigate, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Edit Travel Experience</h1>
        <p className="text-muted-foreground">
          Update your travel story, tips, and photos
        </p>
      </div>
      <ExperienceForm experience={experience} />
    </div>
  );
};

export default EditExperience;
