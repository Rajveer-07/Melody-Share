import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import AddSongModal from '../components/AddSongModal';
import SongCard from '../components/SongCard';
import { Plus, LogOut, Music, Users, RefreshCw, Play, Clock, Heart, ExternalLink, Youtube } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import AnimatedWrapper from '../components/AnimatedWrapper';
import { fadeIn, scaleIn, listContainer, listItem } from '../lib/animation-utils';

const Feed: React.FC = () => {
  const { songs, currentCommunity, currentUser, setCurrentCommunity, setCurrentUser, canAddSong } = useMusicCommunity();
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentCommunity || !currentUser) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentCommunity, currentUser, navigate]);

  const handleLogout = () => {
    setCurrentCommunity(null);
    setCurrentUser(null);
    navigate('/');
  };

  const openSpotifyTrack = (spotifyUri: string) => {
    const trackId = spotifyUri.split(':').pop();
    if (trackId) {
      window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
    }
  };

  const openYoutubeSearch = (youtubeUrl: string | undefined, title: string, artist: string) => {
    if (youtubeUrl) {
      window.open(youtubeUrl, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${title} ${artist}`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
    }
    
    toast({
      title: "Opening on YouTube",
      description: `Searching for "${title}" by ${artist}`,
    });
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    const formattedHours = hours % 12 || 12;
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    toast({
      title: "Refreshing feed",
      description: "Getting the latest songs...",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      setCurrentTime(new Date());
      
      toast({
        title: "Feed refreshed",
        description: "All songs are up to date",
      });
    }, 1000);
  };

  return (
    <AnimatedWrapper id="feed-page">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Music className="text-music-accent mr-2" size={24} />
            <h1 className="text-xl font-medium">MelodyShare</h1>
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {currentCommunity && (
              <div className="hidden sm:flex items-center mr-4 bg-white/5 px-3 py-1 rounded-full">
                <Users size={16} className="mr-1 text-music-textSecondary" />
                <span className="text-sm">{currentCommunity.name}</span>
              </div>
            )}
            
            {currentUser && (
              <div className="mr-4 bg-music-card px-3 py-1 rounded-full">
                <span className="text-sm">{currentUser.username}</span>
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="p-2 text-music-textSecondary hover:text-white transition-colors"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </button>
          </motion.div>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {currentCommunity && (
          <motion.div 
            className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            variants={fadeIn()}
            initial="hidden"
            animate="visible"
          >
            <div>
              <h2 className="text-2xl font-medium">{currentCommunity.name}</h2>
              <div className="flex items-center">
                <p className="text-music-textSecondary mr-3">
                  {songs.length} songs shared in this community
                </p>
                <motion.span 
                  className="text-xs text-music-textSecondary flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Clock size={12} className="mr-1" />
                  {formatTime(currentTime)}
                </motion.span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                className="premium-button-outline py-2 px-4 flex items-center"
                onClick={handleRefresh}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </motion.button>
              
              <motion.button
                onClick={() => setIsAddSongModalOpen(true)}
                disabled={!canAddSong}
                className="premium-button py-2 px-4 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}
                whileHover={canAddSong ? { scale: 1.05 } : {}}
                whileTap={canAddSong ? { scale: 0.95 } : {}}
              >
                <Plus size={16} className="mr-2" />
                Add Song
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {isLoading ? (
          <motion.div 
            className="space-y-4"
            variants={listContainer}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div 
                key={`skeleton-${index}`} 
                className="flex items-center bg-music-card/30 p-3 rounded-lg"
                variants={listItem}
              >
                <div className="h-16 w-16 bg-white/10 rounded mr-4 animate-pulse"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : songs.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Music size={48} className="mx-auto mb-4 text-music-textSecondary opacity-40" />
            <h3 className="text-xl font-medium mb-2">No songs yet</h3>
            <p className="text-music-textSecondary mb-6">
              Be the first to add a song to this community!
            </p>
            <motion.button
              onClick={() => setIsAddSongModalOpen(true)}
              disabled={!canAddSong}
              className="premium-button"
              whileHover={canAddSong ? { scale: 1.05 } : {}}
              whileTap={canAddSong ? { scale: 0.95 } : {}}
            >
              Add Your First Song
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <AnimatePresence>
              {songs.map(song => (
                <motion.div 
                  key={song.id}
                  layout
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { type: "spring", stiffness: 300, damping: 24 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-music-card hover:bg-music-cardHover rounded-lg overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <div className="relative">
                      <img
                        src={song.albumArt}
                        alt={`${song.title} by ${song.artist}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        onClick={() => openSpotifyTrack(song.spotifyUri)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                        title="Play on Spotify"
                      >
                        <Play className="text-white" size={28} />
                      </button>
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-lg leading-tight">{song.title}</h3>
                      <p className="text-music-textSecondary text-sm">{song.artist}</p>
                      
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-music-textSecondary">
                          Added by <span className="text-music-accent">{song.addedBy}</span>
                        </span>
                        
                        <span className="text-xs text-music-textSecondary">•</span>
                        <span className="text-xs text-music-textSecondary flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTime(song.timestamp)}
                        </span>
                        
                        {song.mood && (
                          <>
                            <span className="text-xs text-music-textSecondary">•</span>
                            <span className="text-xs px-2 py-0.5 bg-music-accent/20 rounded-full">
                              {song.mood}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => openYoutubeSearch(song.youtubeUrl, song.title, song.artist)}
                        className="premium-button-outline py-1.5 px-3 flex items-center text-sm"
                        title="Search on YouTube"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Youtube size={14} className="mr-1" />
                        Open
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      
      <motion.button
        onClick={() => setIsAddSongModalOpen(true)}
        disabled={!canAddSong}
        className="floating-button"
        aria-label="Add song"
        title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        whileHover={canAddSong ? { scale: 1.1 } : {}}
        whileTap={canAddSong ? { scale: 0.9 } : {}}
      >
        <Plus size={24} />
      </motion.button>
      
      <AddSongModal 
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
      />
    </AnimatedWrapper>
  );
};

export default Feed;
