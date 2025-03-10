
import React, { useState } from 'react';
import { ChevronRight, User, Users, Calendar, Search, Share, ExternalLink } from 'lucide-react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { toast } from '@/hooks/use-toast';
import AnimatedButton from './AnimatedButton';
import { motion } from 'framer-motion';

interface CommunityListingProps {
  onSelectCommunity: (communityId: string) => void;
  onBack?: () => void;
}

const CommunityListing: React.FC<CommunityListingProps> = ({ onSelectCommunity, onBack }) => {
  const { communities, isLoading, copyShareableLinkToClipboard } = useMusicCommunity();
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

  const handleShareCommunity = async (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation();
    
    const community = communities.find(c => c.id === communityId);
    if (!community) return;
    
    try {
      const success = await copyShareableLinkToClipboard(communityId);
      
      if (success) {
        toast({
          title: "Link copied!",
          description: `Share link to "${community.name}" has been copied to clipboard.`,
        });
      } else {
        toast({
          title: "Couldn't copy link",
          description: "Please try again",
          variant: "destructive",
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
    
    const community = communities.find(c => 
      c.code.toLowerCase() === communityCode.trim().toLowerCase() || 
      c.id === communityCode.trim()
    );
    
    if (community) {
      onSelectCommunity(community.id);
    } else {
      toast({
        title: "Community not found",
        description: "Please check the community code and try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const searchVariants = {
    rest: { scale: 1 },
    focus: { scale: 1.02, boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)" }
  };

  // Enhanced card animation variants
  const cardVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    },
    hover: { 
      scale: 1.02, 
      y: -4,
      boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }
    }
  };

  const contentVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      } 
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium">Available Communities</h2>
        {onBack && (
          <AnimatedButton 
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            Back
          </AnimatedButton>
        )}
      </div>

      <motion.div 
        className="mb-6 space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search box */}
        <motion.div 
          className="relative"
          initial="rest"
          whileFocus="focus"
          variants={searchVariants}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-music-textSecondary" size={18} />
          <input
            type="text"
            placeholder="Search communities or enter code..."
            className="w-full bg-music-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-music-accent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Community code input */}
        <motion.form 
          onSubmit={handleCommunityCodeSubmit} 
          className="flex space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <input
            type="text"
            placeholder="Enter community code..."
            className="flex-1 bg-music-card border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-music-accent transition-all duration-300"
            value={communityCode}
            onChange={(e) => setCommunityCode(e.target.value)}
          />
          <motion.button
            type="submit"
            className="premium-button py-2 px-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join
          </motion.button>
        </motion.form>
      </motion.div>
      
      <motion.div 
        className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <motion.div 
              key={`skeleton-${index}`} 
              className="bg-music-card rounded-xl p-4 animate-pulse"
              variants={itemVariants}
            >
              <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/3"></div>
            </motion.div>
          ))
        ) : filteredCommunities.length === 0 ? (
          <motion.div 
            className="bg-music-card rounded-xl p-8 text-center"
            variants={itemVariants}
          >
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-music-textSecondary">No communities found. Try a different search term or create a new community.</p>
          </motion.div>
        ) : (
          filteredCommunities.map(community => (
            <motion.div 
              key={community.id}
              className="bg-music-card rounded-xl overflow-hidden transition-all duration-300"
              variants={itemVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={cardVariants}
            >
              <motion.div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-music-cardHover relative"
                onClick={() => toggleExpand(community.id)}
                layout
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    {community.name}
                    <motion.span 
                      className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {community.code}
                    </motion.span>
                  </h3>
                  <div className="flex items-center text-music-textSecondary text-sm mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>Created {formatDate(community.creationDate)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.button
                    onClick={(e) => handleShareCommunity(e, community.id)}
                    className="mr-2 p-2 rounded-full hover:bg-white/10 text-music-textSecondary hover:text-white transition-colors"
                    title="Share community link"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Share size={16} />
                  </motion.button>
                  <motion.div
                    animate={{
                      rotate: expandedCommunity === community.id ? 90 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </div>

                {/* Add a hover effect overlay */}
                <motion.div 
                  className="absolute inset-0 bg-white/5 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              
              {expandedCommunity === community.id && (
                <motion.div 
                  className="p-4 border-t border-white/10 bg-black/20"
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={contentVariants}
                  layout
                >
                  <p className="text-music-textSecondary mb-4">Join this community to start sharing music with other members.</p>
                  <motion.button
                    className="premium-button w-full flex items-center justify-center"
                    onClick={() => onSelectCommunity(community.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <User size={18} className="mr-2" />
                    Join Community
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default CommunityListing;
