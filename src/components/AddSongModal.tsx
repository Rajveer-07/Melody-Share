
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Music, Loader } from 'lucide-react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  uri: string;
}

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mood options
const moodOptions = [
  'Happy', 'Energetic', 'Chill', 'Sad', 'Focused', 'Romantic', 'Nostalgic'
];

// Spotify API credentials
const CLIENT_ID = "20abdc95aa1a47db9bd68a1a27fc39b6";
const CLIENT_SECRET = "38bfa455eb934fd590e5cf99af950a1e";
let accessToken = "";

// Function to get Spotify Access Token
const getAccessToken = async () => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });

    const data = await response.json();
    accessToken = data.access_token;
    console.log("Access Token acquired");
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

// Function to search songs from Spotify API
const searchSpotifyTracks = async (query: string): Promise<SpotifyTrack[]> => {
  if (!query.trim()) return [];
  
  try {
    if (!accessToken) {
      await getAccessToken();
    }
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    // Handle token expiration
    if (response.status === 401) {
      accessToken = "";
      await getAccessToken();
      return searchSpotifyTracks(query);
    }
    
    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};

// Animation variants
const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalContentVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9, 
    transition: { duration: 0.3 } 
  }
};

const resultItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    } 
  }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

const AddSongModal: React.FC<AddSongModalProps> = ({ isOpen, onClose }) => {
  const { addSong, canAddSong, isLoading } = useMusicCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchSpotifyTracks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "There was an error searching for songs. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMood(e.target.value);
  };

  const handleAddSong = async (track: SpotifyTrack) => {
    if (!canAddSong) {
      toast({
        title: "You've reached your limit",
        description: "You can only add one song every 24 hours."
      });
      return;
    }
    
    try {
      const artistNames = track.artists.map(artist => artist.name).join(', ');
      const albumArt = track.album.images[0]?.url || '';
      
      await addSong(track.uri, track.name, artistNames, albumArt, selectedMood);
      
      toast({
        title: "Song added successfully",
        description: `"${track.name}" has been added to the community feed.`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to add song",
        description: "There was an error adding your song. Please try again."
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalOverlayVariants}
        >
          <motion.div 
            ref={modalRef}
            className="bg-music-card rounded-2xl shadow-xl overflow-hidden max-w-md w-full mx-4 max-h-[85vh] flex flex-col"
            variants={modalContentVariants}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <motion.h2 
                className="text-xl font-medium"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Add a Song
              </motion.h2>
              <motion.button 
                onClick={onClose}
                className="text-music-textSecondary hover:text-white transition-colors p-1"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <motion.div 
              className="p-5 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <motion.input
                  type="text"
                  placeholder="Search for a song..."
                  className="fancy-input pl-10"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(29, 185, 84, 0.3)" }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              <motion.div 
                className="mt-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm text-music-textSecondary mb-1">
                  How are you feeling today?
                </label>
                <motion.select 
                  value={selectedMood}
                  onChange={handleMoodChange}
                  className="fancy-input w-full bg-transparent"
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(29, 185, 84, 0.3)" }}
                >
                  <option value="">Select a mood (optional)</option>
                  {moodOptions.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </motion.select>
              </motion.div>
              
              <motion.button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="premium-button w-full mt-3 flex items-center justify-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                {isSearching ? <Loader className="animate-spin mr-2" size={18} /> : <Search className="mr-2" size={18} />}
                {isSearching ? 'Searching...' : 'Search'}
              </motion.button>
              
              {!canAddSong && (
                <motion.div 
                  className="mt-4 text-sm bg-red-500/20 text-red-200 p-3 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  You've reached your daily limit. You can add another song in 24 hours.
                </motion.div>
              )}
            </motion.div>
            
            <div className="flex-grow overflow-y-auto">
              {searchResults.length === 0 && !isSearching ? (
                <motion.div 
                  className="p-8 text-center text-music-textSecondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Music size={48} className="mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm">Search for songs to add to your community</p>
                </motion.div>
              ) : (
                <motion.ul 
                  className="divide-y divide-white/10"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {isSearching ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <motion.li 
                        key={`skeleton-${index}`} 
                        className="flex items-center p-4 animate-pulse"
                        variants={resultItemVariants}
                      >
                        <div className="w-12 h-12 bg-white/10 rounded"></div>
                        <div className="ml-3 flex-grow">
                          <div className="h-4 bg-white/10 rounded w-3/4"></div>
                          <div className="h-3 bg-white/10 rounded w-1/2 mt-2"></div>
                        </div>
                        <div className="w-20 h-8 bg-white/10 rounded-full"></div>
                      </motion.li>
                    ))
                  ) : (
                    searchResults.map(track => (
                      <motion.li 
                        key={track.id} 
                        className="flex items-center p-4 hover:bg-white/5 transition-colors"
                        variants={resultItemVariants}
                      >
                        <img 
                          src={track.album.images[0]?.url} 
                          alt={track.album.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="ml-3 flex-grow">
                          <h4 className="font-medium">{track.name}</h4>
                          <p className="text-sm text-music-textSecondary">
                            {track.artists.map(artist => artist.name).join(', ')}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleAddSong(track)}
                          disabled={isLoading || !canAddSong}
                          className="premium-button py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          Add
                        </motion.button>
                      </motion.li>
                    ))
                  )}
                </motion.ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSongModal;
