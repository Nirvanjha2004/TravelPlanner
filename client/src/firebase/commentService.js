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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Get comments for an experience
export const getComments = async (experienceId) => {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('experienceId', '==', experienceId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(commentsQuery);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch user details for each comment
    const commentsWithUserDetails = await Promise.all(
      comments.map(async (comment) => {
        const userDoc = await getDoc(doc(db, 'users', comment.userId));
        
        if (userDoc.exists()) {
          return {
            ...comment,
            user: {
              _id: userDoc.id,
              name: userDoc.data().name,
              profilePicture: userDoc.data().profilePicture
            }
          };
        }
        
        return comment;
      })
    );
    
    return commentsWithUserDetails;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Add a comment
export const addComment = async (experienceId, text, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      experienceId,
      text,
      userId,
      createdAt: serverTimestamp()
    });
    
    // Get the user details
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    return {
      id: docRef.id,
      experienceId,
      text,
      userId,
      user: userDoc.exists() ? {
        _id: userDoc.id,
        name: userDoc.data().name,
        profilePicture: userDoc.data().profilePicture
      } : null,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    // Check if the user is the comment owner
    if (commentDoc.data().userId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }
    
    await deleteDoc(commentRef);
    
    return { id: commentId };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
