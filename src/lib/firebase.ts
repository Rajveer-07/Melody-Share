
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc,
  setDoc
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import type { Song, User } from '../types';
import type { Community } from '../context/MusicCommunityContext';

const firebaseConfig = {
  apiKey: "AIzaSyAApGpFANSTBHR26HHz2AtGlysJlH7qRTY",
  authDomain: "save-community-message.firebaseapp.com",
  projectId: "save-community-message",
  storageBucket: "save-community-message.firebasestorage.app",
  messagingSenderId: "189525167804",
  appId: "1:189525167804:web:462c4cea15af4d807b0ab9",
  measurementId: "G-KHYCWTWE2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Anonymous authentication
export const signInAnonymousUser = async (): Promise<FirebaseUser | null> => {
  try {
    // Only sign in if not already authenticated
    if (!auth.currentUser) {
      const result = await signInAnonymously(auth);
      console.log("Anonymous user signed in successfully:", result.user.uid);
      return result.user;
    }
    return auth.currentUser;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    return null;
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Save a community to Firestore
export async function saveCommunity(communityData: Omit<Community, 'id'>): Promise<{ success: boolean, id?: string }> {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      await signInAnonymousUser();
    }
    
    // Double check authentication
    if (!auth.currentUser) {
      console.error("Failed to authenticate user for saving community");
      return { success: false };
    }
    
    console.log("Saving community:", communityData);
    
    const communitiesRef = collection(db, 'communities');
    const docRef = await addDoc(communitiesRef, {
      ...communityData,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser.uid || 'anonymous',
    });
    
    console.log("Community saved successfully with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving community:', error);
    return { success: false };
  }
}

// Get all communities
export async function getCommunities(): Promise<Community[]> {
  try {
    const communitiesRef = collection(db, 'communities');
    const querySnapshot = await getDocs(communitiesRef);
    
    const communities: Community[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      communities.push({
        id: doc.id,
        name: data.name,
        creationDate: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
        members: data.members || 1,
        code: data.code
      });
    });
    
    return communities;
  } catch (error) {
    console.error('Error getting communities:', error);
    return [];
  }
}

// Subscribe to communities
export function subscribeCommunities(callback: (communities: Community[]) => void) {
  const communitiesRef = collection(db, 'communities');
  
  return onSnapshot(communitiesRef, (snapshot) => {
    const communities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        creationDate: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
        members: data.members || 1,
        code: data.code
      } as Community;
    });
    
    callback(communities);
  });
}

// Save a user to Firestore
export async function saveUser(userData: User): Promise<{ success: boolean, id?: string }> {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      await signInAnonymousUser();
    }
    
    if (!auth.currentUser) {
      console.error("Failed to authenticate user");
      return { success: false };
    }
    
    // Use the username as the document ID for easy retrieval
    const userRef = doc(db, 'users', userData.username || auth.currentUser.uid);
    await setDoc(userRef, {
      ...userData,
      firebaseUid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log("User saved with ID:", userRef.id);
    return { success: true, id: userRef.id };
  } catch (error) {
    console.error('Error saving user:', error);
    return { success: false };
  }
}

// Check if a username exists
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', username);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', username);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        name: data.name,
        username: data.username,
        communityCode: data.communityCode,
        lastSongAdded: data.lastSongAdded,
        isGuest: data.isGuest
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Update community member count
export async function updateCommunityMemberCount(communityId: string, increment: boolean): Promise<boolean> {
  try {
    const communityRef = doc(db, 'communities', communityId);
    const communityDoc = await getDoc(communityRef);
    
    if (communityDoc.exists()) {
      const data = communityDoc.data();
      const currentCount = data.members || 1;
      
      await updateDoc(communityRef, {
        members: increment ? currentCount + 1 : Math.max(1, currentCount - 1)
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating community member count:', error);
    return false;
  }
}

export async function saveSong(songData: Omit<Song, 'id' | 'addedAt'>, communityCode: string): Promise<{ success: boolean }> {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      await signInAnonymousUser();
    }
    
    // Double check authentication
    if (!auth.currentUser) {
      console.error("Failed to authenticate user for saving song");
      return { success: false };
    }
    
    console.log("Saving song to community:", communityCode);
    console.log("Song data:", songData);
    
    const songsRef = collection(db, 'songs');
    const docRef = await addDoc(songsRef, {
      ...songData,
      communityCode,
      addedAt: serverTimestamp(), // Use server timestamp for consistent timing
      userId: auth.currentUser.uid || 'anonymous', // Associate with user ID
    });
    
    console.log("Song saved successfully with ID:", docRef.id);
    return { success: true };
  } catch (error) {
    console.error('Error saving song:', error);
    return { success: false };
  }
}

export function subscribeSongs(communityCode: string, callback: (songs: Song[]) => void) {
  console.log("Subscribing to songs for community:", communityCode);
  
  const songsRef = collection(db, 'songs');
  // Modified query to work with default indexes
  const songsQuery = query(
    songsRef,
    where('communityCode', '==', communityCode),
    limit(100) // Add a reasonable limit
  );
  
  return onSnapshot(songsQuery, (snapshot) => {
    const songs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        addedAt: data.addedAt ? new Date(data.addedAt.toDate()).toISOString() : new Date().toISOString()
      } as Song;
    })
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()); // Client-side sorting
    
    console.log(`Retrieved ${songs.length} songs for community ${communityCode}`);
    callback(songs);
  });
}
