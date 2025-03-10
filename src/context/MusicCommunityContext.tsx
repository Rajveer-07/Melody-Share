import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Community {
  id: string;
  name: string;
  creationDate: Date;
  members: number;
  code: string;
}

export interface User {
  id: string;
  username: string;
  lastSongAdded?: Date;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyUri: string;
  addedBy: string;
  addedById: string;
  addedAt: Date;
  mood?: string;
  youtubeUrl?: string;
}

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
}

const MusicCommunityContext = createContext<MusicCommunityContextType | undefined>(undefined);

const generateYoutubeUrl = (title: string, artist: string): string => {
  const searchQuery = encodeURIComponent(`${title} ${artist}`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
};

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Indie Music Lovers',
    creationDate: new Date(2023, 5, 15),
    members: 42,
    code: 'INDIE42'
  },
  {
    id: '2',
    name: 'Electronic Beats',
    creationDate: new Date(2023, 7, 3),
    members: 28,
    code: 'ELEC28'
  },
  {
    id: '3',
    name: 'Classic Rock Fans',
    creationDate: new Date(2023, 2, 10),
    members: 56,
    code: 'ROCK56'
  }
];

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b2734e04404b0571ffb8f0cd5bae',
    spotifyUri: 'spotify:track:3z8h0TU7ReDPLIbEnNQ0hF',
    addedBy: 'RockFan42',
    addedById: 'user1',
    addedAt: new Date(2023, 9, 10, 12, 0),
    mood: 'Energetic',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Bohemian+Rhapsody+Queen'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273b5d75a39b1e6d7d7acd715d2',
    spotifyUri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
    addedBy: 'SynthWave',
    addedById: 'user2',
    addedAt: new Date(2023, 9, 12, 12, 0),
    mood: 'Energetic',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Blinding+Lights+The+Weeknd'
  },
  {
    id: '3',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0',
    spotifyUri: 'spotify:track:0ofHAoxe9vBkTCp2UQIavz',
    addedBy: 'VinylCollector',
    addedById: 'user3',
    addedAt: new Date(2023, 9, 15, 12, 0),
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
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommunity: Community = {
        id: Date.now().toString(),
        name,
        creationDate: new Date(),
        members: 1,
        code: generateUniqueCode(name)
      };
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        lastSongAdded: undefined
      };
      
      setCommunities(prev => [...prev, newCommunity]);
      setCurrentCommunity(newCommunity);
      setCurrentUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const joinCommunity = async (communityId: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const community = communities.find(c => c.id === communityId);
      
      if (!community) {
        throw new Error('Community not found');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        lastSongAdded: undefined
      };
      
      const updatedCommunity = {
        ...community,
        members: community.members + 1
      };
      
      setCommunities(prev => 
        prev.map(c => c.id === communityId ? updatedCommunity : c)
      );
      
      setCurrentCommunity(updatedCommunity);
      setCurrentUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const joinCommunityByCode = async (code: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const community = communities.find(c => c.code === code);
      
      if (!community) {
        throw new Error('Invalid community code');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        lastSongAdded: undefined
      };
      
      const updatedCommunity = {
        ...community,
        members: community.members + 1
      };
      
      setCommunities(prev => 
        prev.map(c => c.id === community.id ? updatedCommunity : c)
      );
      
      setCurrentCommunity(updatedCommunity);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const youtubeUrl = generateYoutubeUrl(title, artist);
      
      const newSong: Song = {
        id: Date.now().toString(),
        title,
        artist,
        albumArt,
        spotifyUri,
        addedBy: currentUser.username,
        addedById: currentUser.id,
        addedAt: new Date(),
        mood,
        youtubeUrl
      };
      
      setSongs(prev => [newSong, ...prev]);
      
      const updatedUser = {
        ...currentUser,
        lastSongAdded: new Date()
      };
      
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
        copyCodeToClipboard
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
