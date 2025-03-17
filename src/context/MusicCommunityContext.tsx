import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Song as SongType, User as UserType } from '../types';
import {
  signInAnonymousUser,
  saveCommunity,
  getCommunities,
  subscribeCommunities,
  saveUser,
  checkUsernameExists as checkFirebaseUsernameExists,
  getUserByUsername,
  updateCommunityMemberCount,
  saveSong as saveFirebaseSong,
  subscribeSongs
} from '../lib/firebase';

export interface Community {
  id: string;
  name: string;
  creationDate: Date;
  members: number;
  code: string;
}

export type User = UserType;
export type Song = SongType;

interface MusicCommunityContextType {
  communities: Community[];
  songs: Song[];
  currentCommunity: Community | null;
  currentUser: User | null;
  isLoading: boolean;
  canAddSong: boolean;
  setCurrentCommunity: (community: Community | null) => void;
  setCurrentUser: (user: User | null) => void;
  createCommunity: (name: string, username: string) => Promise<void>;
  joinCommunity: (communityId: string, username: string) => Promise<void>;
  joinCommunityByCode: (code: string, username: string) => Promise<void>;
  addSong: (
    spotifyUri: string,
    title: string,
    artist: string,
    albumArt: string,
    mood?: string
  ) => Promise<void>;
  generateYoutubeUrl: (title: string, artist: string) => string;
  generateShareableLink: (communityId: string) => string;
  copyShareableLinkToClipboard: (communityId: string) => Promise<boolean>;
  copyCodeToClipboard: (code: string) => Promise<boolean>;
  checkUsernameExists: (username: string) => Promise<boolean>;
}

const MusicCommunityContext = createContext<MusicCommunityContextType | undefined>(undefined);

const generateYoutubeUrl = (title: string, artist: string): string => {
  const searchQuery = encodeURIComponent(`${title} ${artist}`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
};

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2734e04404b0571ffb8f0cd5bae',
    spotifyUri: 'spotify:track:3z8h0TU7ReDPLIbEnNQ0hF',
    spotifyId: '3z8h0TU7ReDPLIbEnNQ0hF',
    addedBy: 'RockFan42',
    addedById: 'user1',
    addedAt: new Date(2023, 9, 10, 12, 0).toISOString(),
    mood: 'Energetic',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Bohemian+Rhapsody+Queen'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273b5d75a39b1e6d7d7acd715d2',
    spotifyUri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
    spotifyId: '0VjIjW4GlUZAMYd2vXMi3b',
    addedBy: 'SynthWave',
    addedById: 'user2',
    addedAt: new Date(2023, 9, 12, 12, 0).toISOString(),
    mood: 'Energetic',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Blinding+Lights+The+Weeknd'
  },
  {
    id: '3',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0',
    spotifyUri: 'spotify:track:0ofHAoxe9vBkTCp2UQIavz',
    spotifyId: '0ofHAoxe9vBkTCp2UQIavz',
    addedBy: 'VinylCollector',
    addedById: 'user3',
    addedAt: new Date(2023, 9, 15, 12, 0).toISOString(),
    mood: 'Chill',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dreams+Fleetwood+Mac'
  }
];

const generateUniqueCode = (name: string): string => {
  const prefix = name.slice(0, 4).toUpperCase().replace(/\s+/g, '');
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${randomNum}`;
};

export const MusicCommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize Firebase anonymous auth
  useEffect(() => {
    signInAnonymousUser();
  }, []);

  // Subscribe to communities data from Firestore
  useEffect(() => {
    const unsubscribe = subscribeCommunities((fetchedCommunities) => {
      console.log("Received communities from Firestore:", fetchedCommunities);
      setCommunities(fetchedCommunities);
    });
    
    return () => unsubscribe();
  }, []);

  // Subscribe to songs when community changes
  useEffect(() => {
    if (!currentCommunity?.code) return;
    
    const unsubscribe = subscribeSongs(currentCommunity.code, (fetchedSongs) => {
      console.log("Received songs for community:", currentCommunity.code, fetchedSongs);
      if (fetchedSongs.length > 0) {
        setSongs(fetchedSongs);
      }
    });
    
    return () => unsubscribe();
  }, [currentCommunity]);

  // Load user and community from localStorage on initial load
  useEffect(() => {
    const savedCommunity = localStorage.getItem('currentCommunity');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedCommunity) {
      setCurrentCommunity(JSON.parse(savedCommunity));
    }
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user and community to localStorage when they change
  useEffect(() => {
    if (currentCommunity) {
      localStorage.setItem('currentCommunity', JSON.stringify(currentCommunity));
    } else {
      localStorage.removeItem('currentCommunity');
    }
    
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentCommunity, currentUser]);

  const canAddSong = (): boolean => {
    if (!currentUser) return false;
    
    if (!currentUser.lastSongAdded) return true;
    
    const lastAdded = new Date(currentUser.lastSongAdded);
    const now = new Date();
    const hoursSinceLastAdd = (now.getTime() - lastAdded.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastAdd >= 24;
  };

  const createCommunity = async (name: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await signInAnonymousUser(); // Ensure we have an authenticated user
      
      const communityCode = generateUniqueCode(name);
      
      // Save community to Firestore
      const { success, id } = await saveCommunity({
        name,
        creationDate: new Date(),
        members: 1,
        code: communityCode
      });
      
      if (!success || !id) {
        throw new Error('Failed to create community');
      }
      
      console.log("Community created in Firebase with ID:", id);
      
      // Create the new community object
      const newCommunity: Community = {
        id,
        name,
        creationDate: new Date(),
        members: 1,
        code: communityCode
      };
      
      // Check if username already exists
      const usernameExists = await checkUsernameExists(username);
      let newUser: User;
      
      if (usernameExists) {
        // Get existing user 
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
          newUser = {
            ...existingUser,
            communityCode: newCommunity.code
          };
        } else {
          // Fallback
          newUser = {
            id: Date.now().toString(),
            username,
            name: username,
            communityCode: newCommunity.code,
            isGuest: true
          };
        }
      } else {
        // Create new user
        newUser = {
          id: Date.now().toString(),
          username,
          name: username,
          communityCode: newCommunity.code,
          isGuest: true
        };
      }
      
      // Save user to Firestore
      await saveUser(newUser);
      console.log("User saved to Firebase:", newUser);
      
      // Update local state
      setCurrentCommunity(newCommunity);
      setCurrentUser(newUser);
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      return await checkFirebaseUsernameExists(username);
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const joinCommunity = async (communityId: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await signInAnonymousUser(); // Ensure we have an authenticated user
      
      const community = communities.find(c => c.id === communityId);
      
      if (!community) {
        throw new Error('Community not found');
      }
      
      // Check if the username already exists
      const usernameExists = await checkUsernameExists(username);
      let newUser: User;
      let isNewMember = true;
      
      if (usernameExists) {
        // Get the existing user from Firestore
        const existingUser = await getUserByUsername(username);
        
        if (existingUser) {
          // Check if user has already been in this community before
          isNewMember = existingUser.communityCode !== community.code;
          
          newUser = {
            ...existingUser,
            communityCode: community.code
          };
          
          // Update the user in Firestore
          await saveUser(newUser);
        } else {
          // Fallback if we can't find the user (shouldn't happen)
          newUser = {
            id: Date.now().toString(),
            username,
            name: username,
            communityCode: community.code,
            isGuest: true
          };
          
          // Save new user to Firestore
          await saveUser(newUser);
        }
      } else {
        // Create a new user
        newUser = {
          id: Date.now().toString(),
          username,
          name: username,
          communityCode: community.code,
          isGuest: true
        };
        
        // Save new user to Firestore
        await saveUser(newUser);
      }
      
      // Only increment members count if it's a new member
      if (isNewMember) {
        await updateCommunityMemberCount(communityId, true);
        
        // Update the local community object
        const updatedCommunity = {
          ...community,
          members: community.members + 1
        };
        
        setCommunities(prev => 
          prev.map(c => c.id === communityId ? updatedCommunity : c)
        );
        
        setCurrentCommunity(updatedCommunity);
      } else {
        setCurrentCommunity(community);
      }
      
      setCurrentUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const joinCommunityByCode = async (code: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await signInAnonymousUser(); // Ensure we have an authenticated user
      
      const community = communities.find(c => c.code === code);
      
      if (!community) {
        throw new Error('Invalid community code');
      }
      
      // Check if the username already exists
      const usernameExists = await checkUsernameExists(username);
      let newUser: User;
      let isNewMember = true;
      
      if (usernameExists) {
        // Get the existing user from Firestore
        const existingUser = await getUserByUsername(username);
        
        if (existingUser) {
          // Check if user has already been in this community before
          isNewMember = existingUser.communityCode !== community.code;
          
          newUser = {
            ...existingUser,
            communityCode: community.code
          };
          
          // Update the user in Firestore
          await saveUser(newUser);
        } else {
          // Fallback if we can't find the user (shouldn't happen)
          newUser = {
            id: Date.now().toString(),
            username,
            name: username,
            communityCode: community.code,
            isGuest: true
          };
          
          // Save new user to Firestore
          await saveUser(newUser);
        }
      } else {
        // Create a new user
        newUser = {
          id: Date.now().toString(),
          username,
          name: username,
          communityCode: community.code,
          isGuest: true
        };
        
        // Save new user to Firestore
        await saveUser(newUser);
      }
      
      // Only increment members count if it's a new member
      if (isNewMember) {
        await updateCommunityMemberCount(community.id, true);
        
        // Update the local community object
        const updatedCommunity = {
          ...community,
          members: community.members + 1
        };
        
        setCommunities(prev => 
          prev.map(c => c.id === community.id ? updatedCommunity : c)
        );
        
        setCurrentCommunity(updatedCommunity);
      } else {
        setCurrentCommunity(community);
      }
      
      setCurrentUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const addSong = async (
    spotifyUri: string,
    title: string,
    artist: string,
    albumArt: string,
    mood?: string
  ): Promise<void> => {
    if (!currentCommunity || !currentUser) {
      throw new Error('User not in a community');
    }
    
    if (!canAddSong()) {
      throw new Error('You can only add one song every 24 hours');
    }
    
    setIsLoading(true);
    
    try {
      const youtubeUrl = generateYoutubeUrl(title, artist);
      
      const songData: Omit<Song, 'id' | 'addedAt'> = {
        title,
        artist,
        albumArt,
        spotifyUri,
        spotifyId: spotifyUri.split(':').pop() || '',
        addedBy: currentUser.username || '',
        addedById: currentUser.id || '',
        mood,
        youtubeUrl,
        communityCode: currentUser.communityCode
      };
      
      // Save song to Firestore
      await saveFirebaseSong(songData, currentUser.communityCode);
      
      // Update the current user with the new lastSongAdded
      const updatedUser: User = {
        ...currentUser,
        lastSongAdded: new Date().toISOString()
      };
      
      // Save updated user to Firestore
      await saveUser(updatedUser);
      
      setCurrentUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const generateShareableLink = (communityId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/onboarding?join=${communityId}`;
  };

  const copyShareableLinkToClipboard = async (communityId: string): Promise<boolean> => {
    try {
      const link = generateShareableLink(communityId);
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return false;
    }
  };

  const copyCodeToClipboard = async (code: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (error) {
      console.error('Failed to copy code:', error);
      return false;
    }
  };

  return (
    <MusicCommunityContext.Provider
      value={{
        communities,
        songs,
        currentCommunity,
        currentUser,
        isLoading,
        canAddSong: canAddSong(),
        setCurrentCommunity,
        setCurrentUser,
        createCommunity,
        joinCommunity,
        joinCommunityByCode,
        addSong,
        generateYoutubeUrl,
        generateShareableLink,
        copyShareableLinkToClipboard,
        copyCodeToClipboard,
        checkUsernameExists
      }}
    >
      {children}
    </MusicCommunityContext.Provider>
  );
};

export const useMusicCommunity = (): MusicCommunityContextType => {
  const context = useContext(MusicCommunityContext);
  
  if (context === undefined) {
    throw new Error('useMusicCommunity must be used within a MusicCommunityProvider');
  }
  
  return context;
};
