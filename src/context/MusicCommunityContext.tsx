import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types definition
export type Community = {
  id: string;
  name: string;
  creationDate: Date;
};

export type User = {
  id: string;
  username: string;
  communityId: string | null;
};

export type Song = {
  id: string;
  spotifyUri: string;
  title: string;
  artist: string;
  albumArt: string;
  addedBy: string;
  timestamp: Date;
  mood?: string; // Field for mood
  youtubeUrl?: string; // Added youtubeUrl property
};

interface MusicCommunityContextType {
  communities: Community[];
  currentCommunity: Community | null;
  currentUser: User | null;
  songs: Song[];
  isLoading: boolean;
  error: Error | null; // Add error property to the context type
  createCommunity: (name: string) => Promise<void>;
  joinCommunity: (communityId: string, username: string) => Promise<void>;
  addSong: (spotifyUri: string, title: string, artist: string, albumArt: string, mood?: string, youtubeUrl?: string) => Promise<void>;
  canAddSong: boolean;
  setCurrentCommunity: (community: Community | null) => void;
  setCurrentUser: (user: User | null) => void;
}

// Mock data for initial development (will be replaced with real API calls)
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Indie Explorers',
    creationDate: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Electronic Beats',
    creationDate: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Jazz Collective',
    creationDate: new Date('2023-03-10'),
  },
];

const mockSongs: Song[] = [
  {
    id: '1',
    spotifyUri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    albumArt: 'https://i.scdn.co/image/ab67616d00001e02c5eeda65bc53dffbe06bb4b4',
    addedBy: 'MusicLover42',
    timestamp: new Date('2023-06-10T12:30:00'),
  },
  {
    id: '2',
    spotifyUri: 'spotify:track:3z8h0TU7ReDPLIbEnYhWZb',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumArt: 'https://i.scdn.co/image/ab67616d00001e02d254ca497999ae980a5a38c5',
    addedBy: 'ClassicRockFan',
    timestamp: new Date('2023-06-11T09:15:00'),
  },
  {
    id: '3',
    spotifyUri: 'spotify:track:1Qrg8KqiBpW07V7PNxwwwL',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    albumArt: 'https://i.scdn.co/image/ab67616d00001e02c5849c655e5309209ce935b7',
    addedBy: 'ModernPopFan',
    timestamp: new Date('2023-06-12T14:45:00'),
  },
  {
    id: '4',
    spotifyUri: 'spotify:track:5ghIJDpPoe3CfHMGu71E6T',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://i.scdn.co/image/ab67616d00001e0200047f0f9fa3b2f9ce9c9283',
    addedBy: 'WeekndFan',
    timestamp: new Date('2023-06-13T18:20:00'),
  },
];

const MusicCommunityContext = createContext<MusicCommunityContextType | undefined>(undefined);

export const MusicCommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canAddSong, setCanAddSong] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null); // Add error state

  // Check if user can add a song (1 per 24h)
  useEffect(() => {
    if (!currentUser) {
      setCanAddSong(false);
      return;
    }

    const lastSongByUser = songs
      .filter(song => song.addedBy === currentUser.username)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (!lastSongByUser) {
      setCanAddSong(true);
      return;
    }

    const hoursSinceLastAdd = (new Date().getTime() - lastSongByUser.timestamp.getTime()) / (1000 * 60 * 60);
    setCanAddSong(hoursSinceLastAdd >= 24);
  }, [currentUser, songs]);

  // Create a new community
  const createCommunity = async (name: string) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newCommunity: Community = {
        id: `community-${Date.now()}`,
        name,
        creationDate: new Date(),
      };
      
      setCommunities([...communities, newCommunity]);
      setCurrentCommunity(newCommunity);
    } catch (err) {
      console.error('Error creating community:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Join an existing community
  const joinCommunity = async (communityId: string, username: string) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const community = communities.find(c => c.id === communityId);
      if (!community) throw new Error('Community not found');
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        communityId,
      };
      
      setCurrentUser(newUser);
      setCurrentCommunity(community);
    } catch (err) {
      console.error('Error joining community:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new song
  const addSong = async (spotifyUri: string, title: string, artist: string, albumArt: string, mood?: string, youtubeUrl?: string) => {
    if (!currentUser || !canAddSong) return;
    
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSong: Song = {
        id: `song-${Date.now()}`,
        spotifyUri,
        title,
        artist,
        albumArt,
        addedBy: currentUser.username,
        timestamp: new Date(),
        mood,
        youtubeUrl,
      };
      
      setSongs([newSong, ...songs]);
      setCanAddSong(false);
    } catch (err) {
      console.error('Error adding song:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MusicCommunityContext.Provider
      value={{
        communities,
        currentCommunity,
        currentUser,
        songs,
        isLoading,
        error, // Add error to the provider
        createCommunity,
        joinCommunity,
        addSong,
        canAddSong,
        setCurrentCommunity,
        setCurrentUser,
      }}
    >
      {children}
    </MusicCommunityContext.Provider>
  );
};

export const useMusicCommunity = () => {
  const context = useContext(MusicCommunityContext);
  if (context === undefined) {
    throw new Error('useMusicCommunity must be used within a MusicCommunityProvider');
  }
  return context;
};
