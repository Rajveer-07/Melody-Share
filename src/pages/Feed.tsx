
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import AddSongModal from '../components/AddSongModal';
import { Plus, LogOut, Music, Users, RefreshCw, Play, Pause, ExternalLink } from 'lucide-react';

const Feed: React.FC = () => {
  const { songs, currentCommunity, currentUser, setCurrentCommunity, setCurrentUser, canAddSong } = useMusicCommunity();
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is in a community
  useEffect(() => {
    if (!currentCommunity || !currentUser) {
      navigate('/');
      return;
    }
    
    // Simulate loading data
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

  // Open Spotify track in a new tab
  const openSpotifyTrack = (spotifyUri: string) => {
    const trackId = spotifyUri.split(':').pop();
    if (trackId) {
      window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Music className="text-music-accent mr-2" size={24} />
            <h1 className="text-xl font-medium">MelodyShare</h1>
          </div>
          
          <div className="flex items-center">
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
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {currentCommunity && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium">{currentCommunity.name}</h2>
              <p className="text-music-textSecondary">
                {songs.length} songs shared in this community
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="premium-button-outline py-2 px-4 flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
              
              <button
                onClick={() => setIsAddSongModalOpen(true)}
                disabled={!canAddSong}
                className="premium-button py-2 px-4 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}
              >
                <Plus size={16} className="mr-2" />
                Add Song
              </button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex items-center bg-music-card/30 p-3 rounded-lg animate-pulse">
                <div className="h-16 w-16 bg-white/10 rounded mr-4"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12">
            <Music size={48} className="mx-auto mb-4 text-music-textSecondary opacity-40" />
            <h3 className="text-xl font-medium mb-2">No songs yet</h3>
            <p className="text-music-textSecondary mb-6">
              Be the first to add a song to this community!
            </p>
            <button
              onClick={() => setIsAddSongModalOpen(true)}
              disabled={!canAddSong}
              className="premium-button"
            >
              Add Your First Song
            </button>
          </div>
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
                        <ExternalLink className="text-white" size={20} />
                      </button>
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-lg leading-tight">{song.title}</h3>
                      <p className="text-music-textSecondary text-sm">{song.artist}</p>
                      
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-music-textSecondary">
                          Added by <span className="text-music-accent">{song.addedBy}</span>
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
                    
                    <button
                      onClick={() => openSpotifyTrack(song.spotifyUri)}
                      className="premium-button-outline py-1.5 px-3 flex items-center text-sm"
                    >
                      <Play size={14} className="mr-1" />
                      Play
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      
      <button
        onClick={() => setIsAddSongModalOpen(true)}
        disabled={!canAddSong}
        className="floating-button"
        aria-label="Add song"
        title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}
      >
        <Plus size={24} />
      </button>
      
      <AddSongModal 
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
      />
    </div>
  );
};

export default Feed;
