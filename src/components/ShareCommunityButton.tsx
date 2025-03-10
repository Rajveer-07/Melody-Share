
import React, { useState } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Share } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';
import ShareOptionsMenu from './ShareOptionsMenu';

interface ShareCommunityButtonProps {
  communityId: string;
  className?: string;
}

const ShareCommunityButton: React.FC<ShareCommunityButtonProps> = ({ 
  communityId, 
  className 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <AnimatedButton
        onClick={handleClick}
        className={className}
        variant="outline"
        icon={
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            <Share size={18} />
          </motion.div>
        }
      >
        Share
      </AnimatedButton>
      
      <ShareOptionsMenu
        communityId={communityId}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default ShareCommunityButton;
