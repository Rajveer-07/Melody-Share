import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Users, Calendar, Search, Share, Music } from 'lucide-react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import AnimatedButton from '@/components/AnimatedButton';

interface CommunityListingProps {
  onSelectCommunity: (communityId: string) => void;
  onBack?: () => void;
}

const CommunityListing: React.FC<CommunityListingProps> = ({
  onSelectCommunity,
  onBack
}) => {
  const {
    communities,
    isLoading,
    copyShareableLinkToClipboard,
    songs
  } = useMusicCommunity();
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [communityCode, setCommunityCode] = useState('');

  const toggleExpand = (communityId: string) => {
    setExpandedCommunity(expandedCommunity === communityId ? null : communityId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const countSongsInCommunity = (communityCode: string) => {
    return songs.filter(song => song.communityCode === communityCode).length;
  };

  const handleShareCommunity = async (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation();
    const community = communities.find(c => c.id === communityId);
    if (!community) return;
    try {
      const success = await copyShareableLinkToClipboard(communityId);
      if (success) {
        toast({
          title: "Link copied!",
          description: `Share link to "${community.name}" has been copied to clipboard.`
        });
      } else {
        toast({
          title: "Couldn't copy link",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleCommunityCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityCode.trim()) return;
    const community = communities.find(c => c.code.toLowerCase() === communityCode.trim().toLowerCase() || c.id === communityCode.trim());
    if (community) {
      onSelectCommunity(community.id);
    } else {
      toast({
        title: "Community not found",
        description: "Please check the community code and try again.",
        variant: "destructive"
      });
    }
  };

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    community.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const cardVariants = {
    closed: {
      borderRadius: "12px",
      backgroundColor: "rgba(18, 18, 18, 0.8)",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
    },
    expanded: {
      borderRadius: "12px",
      backgroundColor: "rgba(18, 18, 18, 0.8)",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)"
    },
    hover: {
      y: -5,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.1 }
    }
  };

  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  const chevronVariants = {
    closed: {
      rotate: 0,
      transition: { duration: 0.2 }
    },
    expanded: {
      rotate: 180,
      transition: { duration: 0.2 }
    }
  };

  const searchInputVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="tracking-tight text-gray-200 text-left mx-0 text-xl font-extrabold">Available Communities</h2>
      </div>

      <motion.div 
        className="mb-6" 
        initial="hidden" 
        animate="visible" 
        variants={searchInputVariants}
      >
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-music-textSecondary" size={18} />
          <motion.input 
            type="text" 
            placeholder="Search communities or enter code..." 
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-music-accent transition-all duration-300" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            whileFocus={{ 
              boxShadow: "0 0 0 2px rgba(74, 222, 128, 0.2)",
              borderColor: "rgba(74, 222, 128, 0.5)" 
            }}
          />
        </div>

        <motion.form 
          onSubmit={handleCommunityCodeSubmit} 
          className="flex space-x-2"
          variants={formVariants}
        >
          <motion.input 
            type="text" 
            placeholder="Enter community code..." 
            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-music-accent transition-all duration-300" 
            value={communityCode} 
            onChange={e => setCommunityCode(e.target.value)}
            whileFocus={{ 
              boxShadow: "0 0 0 2px rgba(74, 222, 128, 0.2)",
              borderColor: "rgba(74, 222, 128, 0.5)" 
            }}
          />
          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="premium-button py-2 px-4 font-normal text-base mx-0"
          >
            Join
          </motion.button>
        </motion.form>
      </motion.div>
      
      <motion.div 
        className="space-y-4 pb-4" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        {isLoading ? Array.from({length: 3}).map((_, index) => (
          <motion.div 
            key={`skeleton-${index}`} 
            className="bg-[#121212] rounded-xl p-4 animate-pulse" 
            variants={itemVariants}
            custom={index}
          >
            <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
          </motion.div>
        )) : filteredCommunities.length === 0 ? (
          <motion.div 
            className="bg-[#121212] rounded-xl p-8 text-center" 
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0.4, scale: 0.9 }}
              animate={{ 
                opacity: [0.4, 0.6, 0.4],
                scale: [0.9, 1, 0.9],
                transition: { 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <Users size={48} className="mx-auto mb-3 opacity-40" />
            </motion.div>
            <p className="text-music-textSecondary">No communities found. Try a different search term or create a new community.</p>
          </motion.div>
        ) : filteredCommunities.map((community, idx) => (
          <motion.div 
            key={community.id} 
            className="overflow-hidden" 
            variants={itemVariants}
            custom={idx}
            layout
          >
            <motion.div 
              className="bg-[#121212] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" 
              variants={cardVariants} 
              initial="closed" 
              animate={expandedCommunity === community.id ? "expanded" : "closed"} 
              whileHover={expandedCommunity !== community.id ? "hover" : undefined}
              whileTap="tap"
              layout
            >
              <motion.div 
                className="p-4 cursor-pointer flex flex-col" 
                onClick={() => toggleExpand(community.id)} 
                layout
              >
                <div className="flex justify-between items-center">
                  <motion.h3 
                    className="text-lg font-medium"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                  >
                    {community.name}
                  </motion.h3>
                  <motion.div 
                    variants={chevronVariants} 
                    initial="closed" 
                    animate={expandedCommunity === community.id ? "expanded" : "closed"}
                  >
                    <ChevronDown size={20} className="text-gray-400" />
                  </motion.div>
                </div>
                
                <div className="flex items-center text-gray-400 mt-1.5 text-sm">
                  <Calendar size={14} className="mr-1.5" />
                  <span>Created {formatDate(community.creationDate)}</span>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {expandedCommunity === community.id && (
                  <motion.div 
                    className="bg-[#181818] border-t border-white/5" 
                    initial="closed" 
                    animate="expanded" 
                    exit="closed" 
                    variants={contentVariants} 
                    layout
                  >
                    <div className="p-5">
                      <motion.p 
                        className="text-gray-400 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Discover the best music from around the world
                      </motion.p>
                      
                      <motion.div 
                        className="flex flex-wrap gap-3 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="bg-black/30 rounded-full px-4 py-2 flex items-center"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                        >
                          <Users size={16} className="mr-2 text-gray-400" />
                          <span>{community.members} members</span>
                        </motion.div>
                        
                        <motion.div 
                          className="bg-black/30 rounded-full px-4 py-2 flex items-center"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                        >
                          <Music size={16} className="mr-2 text-gray-400" />
                          <span>{countSongsInCommunity(community.code)} songs shared</span>
                        </motion.div>
                      </motion.div>
                      
                      <motion.button 
                        className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-full flex items-center justify-center" 
                        onClick={() => onSelectCommunity(community.id)} 
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0px 5px 15px rgba(74, 222, 128, 0.3)",
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.3, type: "spring", stiffness: 400, damping: 15 }
                        }}
                      >
                        <User size={18} className="mr-2" />
                        Join Community
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>;
};

export default CommunityListing;
