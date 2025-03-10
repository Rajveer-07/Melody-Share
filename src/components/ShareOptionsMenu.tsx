
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { toast } from '@/hooks/use-toast';
import { Link, Copy, Check, X } from 'lucide-react';

interface ShareOptionsMenuProps {
  communityId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareOptionsMenu: React.FC<ShareOptionsMenuProps> = ({ 
  communityId, 
  isOpen, 
  onClose 
}) => {
  const { communities, copyShareableLinkToClipboard, copyCodeToClipboard } = useMusicCommunity();
  const [copyingLink, setCopyingLink] = useState(false);
  const [copyingCode, setCopyingCode] = useState(false);
  
  const community = communities.find(c => c.id === communityId);
  
  if (!community) return null;
  
  const handleCopyCode = async () => {
    setCopyingCode(true);
    
    try {
      const success = await copyCodeToClipboard(community.code);
      
      if (success) {
        toast({
          title: "Code copied!",
          description: `Community code "${community.code}" has been copied to clipboard.`,
        });
      } else {
        toast({
          title: "Couldn't copy code",
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
    } finally {
      setTimeout(() => {
        setCopyingCode(false);
        onClose();
      }, 800);
    }
  };
  
  const handleCopyLink = async () => {
    setCopyingLink(true);
    
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
    } finally {
      setTimeout(() => {
        setCopyingLink(false);
        onClose();
      }, 800);
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 10 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 10,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="absolute right-0 top-10 z-50 bg-music-card rounded-lg shadow-xl border border-white/10 overflow-hidden w-48"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-sm font-medium">Share Community</span>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="p-1">
              <motion.button
                className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={handleCopyCode}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                disabled={copyingCode}
              >
                <motion.div 
                  animate={copyingCode ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-indigo-400"
                >
                  {copyingCode ? <Check size={16} /> : <Copy size={16} />}
                </motion.div>
                <span>Copy Code</span>
              </motion.button>
              
              <motion.button
                className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors hover:bg-white/10"
                onClick={handleCopyLink}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                disabled={copyingLink}
              >
                <motion.div 
                  animate={copyingLink ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-sky-400"
                >
                  {copyingLink ? <Check size={16} /> : <Link size={16} />}
                </motion.div>
                <span>Share Link</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareOptionsMenu;
