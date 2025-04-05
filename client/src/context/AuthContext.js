import { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Add user to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        bio: '',
        location: '',
        createdAt: new Date().toISOString()
      });
      
      toast.success('Registration successful!');
      return userCredential.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
  
  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      
      // Update display name if provided
      if (data.name) {
        await updateProfile(user, {
          displayName: data.name
        });
      }
      
      // Update user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: data.name || user.displayName,
        email: data.email || user.email,
        bio: data.bio || '',
        location: data.location || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Get the updated user data
      const updatedUser = await getDoc(doc(db, 'users', user.uid));
      
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...updatedUser.data()
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
  
  // Password reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              ...userDoc.data()
            });
          } else {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile: updateUserProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
