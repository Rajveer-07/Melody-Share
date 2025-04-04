
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import AddSongModal from '../components/AddSongModal';
import { Plus, LogOut, Music, Users, RefreshCw, Play, Clock, Heart, ExternalLink, Youtube, Share, Copy, Link } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import ShareOptionsMenu from '../components/ShareOptionsMenu';
import { buttonHover } from '../lib/animation-utils';
import { signInAnonymousUser, subscribeSongs } from '../lib/firebase';
import type { Song } from '../types';

const Feed: React.FC = () => {
  const {
    songs: contextSongs,
    currentCommunity,
    currentUser,
    setCurrentCommunity,
    setCurrentUser,
    canAddSong
  } = useMusicCommunity();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCommunity || !currentUser) {
      navigate('/');
      return;
    }
    const initAuth = async () => {
      try {
        await signInAnonymousUser();
      } catch (error) {
        console.error("Error initializing anonymous auth:", error);
      }
    };
    initAuth();
    if (currentCommunity.code) {
      const unsubscribe = subscribeSongs(currentCommunity.code, fetchedSongs => {
        setSongs(fetchedSongs);
        setIsLoading(false);
      });
      return () => {
        unsubscribe();
      };
    } else {
      setSongs(contextSongs as unknown as Song[]);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentCommunity, currentUser, contextSongs, navigate]);

  const handleLogout = () => {
    setCurrentCommunity(null);
    setCurrentUser(null);
    navigate('/');
  };

  const handleShareCommunity = () => {
    if (!currentCommunity) return;
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleDirectCopyCode = async () => {
    if (!currentCommunity) return;
    try {
      await navigator.clipboard.writeText(currentCommunity.code);
      toast({
        title: "Code copied!",
        description: `Community code "${currentCommunity.code}" has been copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Couldn't copy code",
        description: "Please try again or use the share menu",
        variant: "destructive"
      });
    }
  };

  const handleDirectCopyLink = async () => {
    if (!currentCommunity) return;
    try {
      const shareableLink = `${window.location.origin}/join?code=${currentCommunity.code}`;
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Link copied!",
        description: `Share link to "${currentCommunity.name}" has been copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Couldn't copy link",
        description: "Please try again or use the share menu",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    if (!currentCommunity?.code) {
      setTimeout(() => {
        setIsRefreshing(false);
        setIsLoading(false);
        toast({
          title: "Feed refreshed",
          description: "Your music feed has been updated"
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setIsRefreshing(false);
        setIsLoading(false);
        toast({
          title: "Feed refreshed",
          description: "Your music feed has been updated"
        });
      }, 1000);
    }
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
      description: `Searching for "${title}" by ${artist}`
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const truncateWords = (text: string, maxWords: number = 5) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Music className="text-music-accent mr-2" size={22} />
            <h1 className="text-lg md:text-xl font-medium">MelodyShare</h1>
          </div>
          
          <div className="flex items-center">
            {currentCommunity && <div className="hidden sm:flex items-center mr-4 bg-white/5 px-3 py-1 rounded-full">
                <Users size={16} className="mr-1 text-music-textSecondary" />
                <span className="text-sm">{currentCommunity.name}</span>
              </div>}
            
            {currentUser && <div className="mr-3 md:mr-4 bg-music-card px-2 md:px-3 py-1 rounded-full">
                <span className="text-xs md:text-sm">{currentUser.username}</span>
              </div>}
            
            <button onClick={handleLogout} className="p-1.5 md:p-2 text-music-textSecondary hover:text-white transition-colors" aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-3 md:p-6 max-w-4xl mx-auto w-full">
        {currentCommunity && <div className="mb-5 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-0">
              <div>
                <h2 className="text-xl md:text-2xl font-medium">{currentCommunity.name}</h2>
                <p className="text-music-textSecondary text-xs md:text-sm">
                  {songs.length} songs shared in this community
                </p>
              </div>
              
              <div className="flex flex-row flex-wrap items-center gap-2 md:gap-3">
                <div className="relative">
                  <button className="share-button border border-white/20 rounded-full py-1.5 md:py-2 px-3 md:px-4 text-sm" aria-label="Share Community">
                    <div className="share-button-content">
                      <span className="share-button-text text-xs md:text-sm font-normal">Share</span>
                      <span className="share-button-icon">
                        <Share size={14} />
                      </span>
                    </div>
                    
                    <div className="share-options">
                      <motion.button className="share-option p-2 bg-white/10 rounded-full hover:bg-white/20 curved-border-button" onClick={handleDirectCopyLink} whileHover={{
                    scale: 1.1
                  }} whileTap={{
                    scale: 0.95
                  }} title="Share Link">
                        <Link size={14} className="text-sky-400" />
                      </motion.button>
                      
                      <motion.button className="share-option p-2 bg-white/10 rounded-full hover:bg-white/20 curved-border-button" onClick={handleDirectCopyCode} whileHover={{
                    scale: 1.1
                  }} whileTap={{
                    scale: 0.95
                  }} title="Copy Code">
                        <Copy size={14} className="text-indigo-400" />
                      </motion.button>
                    </div>
                  </button>
                  {currentCommunity && <ShareOptionsMenu communityId={currentCommunity.id} isOpen={isShareMenuOpen} onClose={() => setIsShareMenuOpen(false)} />}
                </div>
                
                <motion.button onClick={handleRefresh} className="premium-button-outline curved-border-button py-1.5 md:py-2 px-3 md:px-4 flex items-center text-xs md:text-sm" title="Refresh feed" whileHover="hover" whileTap="tap" variants={buttonHover} disabled={isRefreshing}>
                  <motion.div animate={isRefreshing ? {
                rotate: 360
              } : {
                rotate: 0
              }} transition={isRefreshing ? {
                repeat: Infinity,
                duration: 1,
                ease: "linear"
              } : {}} className="mr-1.5">
                    <RefreshCw size={14} className={isRefreshing ? "text-music-accent" : ""} />
                  </motion.div>
                  Refresh
                </motion.button>
                
                <button onClick={() => setIsAddSongModalOpen(true)} disabled={!canAddSong} className="premium-button curved-border-button py-1.5 md:py-2 px-3 md:px-4 flex items-center text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed" title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}>
                  <Plus size={14} className="mr-1.5" />
                  Add Song
                </button>
              </div>
            </div>
            
            <div className="sm:hidden mt-1 flex items-center bg-white/5 px-2 py-1 rounded-full w-fit mb-3">
              <Users size={14} className="mr-1 text-music-textSecondary" />
              <span className="text-xs">{currentCommunity.name}</span>
            </div>
          </div>}
        
        {isLoading ? <div className="space-y-3 md:space-y-4">
            {Array.from({
          length: 5
        }).map((_, index) => <div key={`skeleton-${index}`} className="flex items-center bg-music-card/30 p-2 md:p-3 rounded-lg animate-pulse">
                <div className="h-14 w-14 md:h-16 md:w-16 bg-white/10 rounded mr-3 md:mr-4"></div>
                <div className="flex-grow">
                  <div className="h-3 md:h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                  <div className="h-2 md:h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>)}
          </div> : songs.length === 0 ? <div className="text-center py-8 md:py-12">
            <Music size={36} className="mx-auto mb-3 md:mb-4 text-music-textSecondary opacity-40" />
            <h3 className="text-lg md:text-xl font-medium mb-2">No songs yet</h3>
            <p className="text-music-textSecondary mb-4 md:mb-6 text-sm md:text-base">
              Be the first to add a song to this community!
            </p>
            <button onClick={() => setIsAddSongModalOpen(true)} disabled={!canAddSong} className="premium-button py-2 px-4 text-sm md:text-base">
              Add Your First Song
            </button>
          </div> : <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{
        hidden: {
          opacity: 0
        },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}>
            <AnimatePresence>
              {songs.map(song => <motion.div key={song.id} layout variants={{
            hidden: {
              y: 20,
              opacity: 0
            },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
              }
            }
          }} initial="hidden" animate="visible" exit={{
            opacity: 0,
            scale: 0.9
          }} className="bg-music-card hover:bg-music-cardHover rounded-lg overflow-hidden">
                  <div className="flex items-center p-2 md:p-4 bg-[#131313]">
                    <div className="relative flex-shrink-0">
                      <img src={song.albumArt} alt={`${song.title} by ${song.artist}`} className="w-14 h-14 md:w-16 md:h-16 object-cover rounded" style={{
                  aspectRatio: '1/1'
                }} />
                      <button onClick={() => song.spotifyUri && openSpotifyTrack(song.spotifyUri)} className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors" title="Play on Spotify">
                        <Play className="text-white" size={24} />
                      </button>
                    </div>
                    
                    <div className="ml-3 md:ml-4 flex-grow min-w-0">
                      <h3 className="font-medium text-base md:text-lg leading-tight truncate" title={song.title}>
                        {truncateWords(song.title, 5)}
                      </h3>
                      <p className="text-music-textSecondary text-xs md:text-sm truncate" title={song.artist}>
                        {truncateWords(song.artist, 3)}
                      </p>
                      
                      <div className="flex flex-wrap items-center mt-1 gap-1 md:gap-2">
                        <span className="text-xs text-music-textSecondary truncate max-w-[150px]">
                          Added by <span className="text-music-accent">{song.addedBy}</span>
                        </span>
                        
                        <span className="text-xs text-music-textSecondary hidden xs:inline">•</span>
                        <span className="text-xs text-music-textSecondary flex items-center">
                          <Clock size={10} className="mr-1" />
                          {formatTime(song.addedAt)}
                        </span>
                        
                        {song.mood && <>
                            <span className="text-xs text-music-textSecondary hidden xs:inline">•</span>
                            <span className="text-xs px-1.5 py-0.5 bg-music-accent/20 rounded-full">
                              {song.mood}
                            </span>
                          </>}
                      </div>
                    </div>
                    
                    <div>
                      <button onClick={() => openYoutubeSearch(song.youtubeUrl, song.title, song.artist)} className="premium-button-outline py-1 md:py-1.5 px-2 md:px-3 flex items-center text-xs" title="Search on YouTube">
                        <Youtube size={12} className="mr-1" />
                        <span className="hidden xs:inline">Open</span>
                      </button>
                    </div>
                  </div>
                </motion.div>)}
            </AnimatePresence>
          </motion.div>}
      </main>
      
      <button onClick={() => setIsAddSongModalOpen(true)} disabled={!canAddSong} className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-music-accent hover:bg-music-accentHover flex items-center justify-center border border-white/20 curved-border-button shadow-lg z-50" aria-label="Add song" title={!canAddSong ? "You can only add one song every 24 hours" : "Add a new song"}>
        <Plus size={18} />
      </button>
      
      <AddSongModal isOpen={isAddSongModalOpen} onClose={() => setIsAddSongModalOpen(false)} />
    </div>;
};

export default Feed;
