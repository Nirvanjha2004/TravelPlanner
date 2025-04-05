import { 
  doc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return {
      _id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    
    return {
      _id: userId,
      ...profileData
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user experiences
export const getUserExperiences = async (userId) => {
  try {
    const experiencesQuery = query(
      collection(db, 'experiences'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(experiencesQuery);
    const experiences = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Add user data to each experience
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = {
        _id: userDoc.id,
        name: userDoc.data().name,
        profilePicture: userDoc.data().profilePicture
      };
      
      return experiences.map(exp => ({
        ...exp,
        user: userData
      }));
    }
    
    return experiences;
  } catch (error) {
    console.error('Error fetching user experiences:', error);
    throw error;
  }
};
