import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

// Get all experiences with optional filters
export const getExperiences = async (filters = {}) => {
  try {
    let experiencesQuery = collection(db, 'experiences');
    const constraints = [];
    
    // Apply filters if provided
    if (filters.category) {
      constraints.push(where('categories', 'array-contains', filters.category));
    }
    
    if (filters.location) {
      constraints.push(where('location.country', '==', filters.location));
    }
    
    if (filters.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }
    
    // Apply ordering
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Create the query with all constraints
    const q = query(experiencesQuery, ...constraints);
    
    // Execute the query
    const snapshot = await getDocs(q);
    
    // Process the results
    const experiences = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get user info for each experience
    const experiencesWithUserInfo = await Promise.all(
      experiences.map(async (exp) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', exp.userId));
          
          return {
            ...exp,
            user: {
              _id: exp.userId,
              name: userDoc.data()?.name || 'Unknown User',
              profilePicture: userDoc.data()?.profilePicture || null
            }
          };
        } catch (err) {
          console.error('Error getting user data:', err);
          return exp;
        }
      })
    );
    
    return experiencesWithUserInfo;
  } catch (error) {
    console.error('Error getting experiences:', error);
    throw error;
  }
};

// Get experience by ID
export const getExperienceById = async (id) => {
  try {
    const docRef = doc(db, 'experiences', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const experience = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      // Get user info
      const userDoc = await getDoc(doc(db, 'users', experience.userId));
      
      return {
        ...experience,
        user: {
          _id: experience.userId,
          name: userDoc.data()?.name || 'Unknown User',
          profilePicture: userDoc.data()?.profilePicture || null
        }
      };
    } else {
      throw new Error('Experience not found');
    }
  } catch (error) {
    console.error('Error getting experience:', error);
    throw error;
  }
};

// Create a new experience
export const createExperience = async (experienceData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'experiences'), {
      ...experienceData,
      userId,
      likes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...experienceData
    };
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

// Update an experience
export const updateExperience = async (id, experienceData, userId) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    const experienceDoc = await getDoc(experienceRef);
    
    if (!experienceDoc.exists()) {
      throw new Error('Experience not found');
    }
    
    // Check if the user is the owner
    if (experienceDoc.data().userId !== userId) {
      throw new Error('Unauthorized to update this experience');
    }
    
    await updateDoc(experienceRef, {
      ...experienceData,
      updatedAt: serverTimestamp()
    });
    
    return {
      id,
      ...experienceData
    };
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

// Delete an experience
export const deleteExperience = async (id, userId) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    const experienceDoc = await getDoc(experienceRef);
    
    if (!experienceDoc.exists()) {
      throw new Error('Experience not found');
    }
    
    // Check if the user is the owner
    if (experienceDoc.data().userId !== userId) {
      throw new Error('Unauthorized to delete this experience');
    }
    
    await deleteDoc(experienceRef);
    
    return { id };
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Like an experience
export const likeExperience = async (id, userId) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    
    await updateDoc(experienceRef, {
      likes: arrayUnion(userId)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error liking experience:', error);
    throw error;
  }
};

// Unlike an experience
export const unlikeExperience = async (id, userId) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    
    await updateDoc(experienceRef, {
      likes: arrayRemove(userId)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error unliking experience:', error);
    throw error;
  }
};
