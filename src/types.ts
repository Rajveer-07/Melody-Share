
export interface User {
  name: string;
  communityCode: string;
  isGuest?: boolean;
  id?: string;          // Added this to make it compatible with MusicCommunityContext User
  username?: string;    // Added this to make it compatible with MusicCommunityContext User
  lastSongAdded?: string; // Changed from Date to string
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  spotifyUri: string;
  spotifyId: string;
  addedBy: string;
  addedById: string;
  addedAt: string;
  mood?: string;
  youtubeUrl?: string;
  communityCode?: string; // Added to support firebase operations
}
