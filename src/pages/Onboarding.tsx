
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Users, UserPlus, Music } from 'lucide-react';
import CommunityListing from '../components/CommunityListing';
import CreateCommunityForm from '../components/CreateCommunityForm';
import JoinCommunityForm from '../components/JoinCommunityForm';
import { useNavigate } from 'react-router-dom';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// Define app states
type AppState = 'intro' | 'join' | 'create' | 'join-form';

const Onboarding: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentCommunity } = useMusicCommunity();

  // If user already has joined a community, redirect to feed
  React.useEffect(() => {
    if (currentCommunity) {
      navigate('/feed');
    }
  }, [currentCommunity, navigate]);

  const handleCommunitySelection = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setAppState('join-form');
  };

  const handleComplete = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-music-dark flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          className="max-w-4xl w-full mx-auto text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              MelodyShare
            </span>
          </h1>
          <p className="text-music-textSecondary text-lg max-w-2xl mx-auto">
            Discover, share, and connect through music with your community.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {appState === 'intro' && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div 
                variants={itemVariants}
                className="glass-panel rounded-xl p-8 flex flex-col items-center text-center"
              >
                <div className="bg-white/10 rounded-full p-4 mb-4">
                  <Users size={32} className="text-music-accent" />
                </div>
                <h2 className="text-xl font-medium mb-2">Join a Community</h2>
                <p className="text-music-textSecondary mb-6">
                  Browse and join existing music communities to start sharing songs.
                </p>
                <button 
                  className="premium-button w-full" 
                  onClick={() => setAppState('join')}
                >
                  Find Communities
                </button>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="glass-panel rounded-xl p-8 flex flex-col items-center text-center"
              >
                <div className="bg-white/10 rounded-full p-4 mb-4">
                  <UserPlus size={32} className="text-music-accent" />
                </div>
                <h2 className="text-xl font-medium mb-2">Create a Community</h2>
                <p className="text-music-textSecondary mb-6">
                  Start your own music community and invite friends to join.
                </p>
                <button 
                  className="premium-button w-full" 
                  onClick={() => setAppState('create')}
                >
                  Create New
                </button>
              </motion.div>
            </motion.div>
          )}
          
          {appState === 'join' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <button 
                  className="premium-button-outline py-2 px-4"
                  onClick={() => setAppState('intro')}
                >
                  Back
                </button>
              </div>
              <CommunityListing onSelectCommunity={handleCommunitySelection} />
            </motion.div>
          )}
          
          {appState === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <button 
                  className="premium-button-outline py-2 px-4"
                  onClick={() => setAppState('intro')}
                >
                  Back
                </button>
              </div>
              <CreateCommunityForm onComplete={handleComplete} />
            </motion.div>
          )}
          
          {appState === 'join-form' && selectedCommunityId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <JoinCommunityForm 
                communityId={selectedCommunityId}
                onComplete={handleComplete}
                onBack={() => setAppState('join')}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <motion.footer 
        className="p-6 text-center text-music-textSecondary text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music size={16} />
          <span>MelodyShare — Share the music you love</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default Onboarding;
