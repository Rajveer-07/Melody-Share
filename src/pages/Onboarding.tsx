
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Users, UserPlus, Music } from 'lucide-react';
import CommunityListing from '../components/CommunityListing';
import CreateCommunityForm from '../components/CreateCommunityForm';
import JoinCommunityForm from '../components/JoinCommunityForm';
import { useNavigate } from 'react-router-dom';
import AnimatedWrapper from '../components/AnimatedWrapper';
import AnimatedButton from '../components/AnimatedButton';
import WavyText from '../components/WavyText';
import { fadeIn, scaleIn, containerWithStagger, itemWithBounce } from '../lib/animation-utils';

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

  // Animated gradient background
  const gradientAnimation = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
      }
    }
  };

  return (
    <AnimatedWrapper id="onboarding-page">
      <motion.div 
        className="min-h-screen bg-music-dark flex flex-col"
        initial="initial" 
        animate="animate" 
        variants={gradientAnimation}
        style={{
          backgroundSize: "400% 400%",
          backgroundImage: "linear-gradient(135deg, #0F0F0F 0%, #181818 25%, #222222 50%, #181818 75%, #0F0F0F 100%)",
        }}
      >
        <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
          <motion.div
            className="max-w-4xl w-full mx-auto text-center mb-8"
            variants={fadeIn(0.2)}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-hidden">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  MelodyShare
                </span>
              </motion.h1>
            </div>
            
            <motion.p 
              className="text-music-textSecondary text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover, share, and connect through music with your community.
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {appState === 'intro' && (
              <motion.div 
                key="intro"
                className="w-full max-w-4xl"
                variants={containerWithStagger(0.4)}
                initial="hidden"
                animate="visible"
                exit={{ 
                  opacity: 0, 
                  y: -20,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    variants={itemWithBounce}
                    className="glass-panel rounded-xl p-8 flex flex-col items-center text-center h-full"
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div 
                      className="bg-white/10 rounded-full p-4 mb-4"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Users size={32} className="text-music-accent" />
                    </motion.div>
                    <h2 className="text-xl font-medium mb-2">Join a Community</h2>
                    <p className="text-music-textSecondary mb-6">
                      Browse and join existing music communities to start sharing songs.
                    </p>
                    <AnimatedButton 
                      variant="primary"
                      className="w-full" 
                      onClick={() => setAppState('join')}
                    >
                      Find Communities
                    </AnimatedButton>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemWithBounce}
                    className="glass-panel rounded-xl p-8 flex flex-col items-center text-center h-full"
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div 
                      className="bg-white/10 rounded-full p-4 mb-4"
                      whileHover={{ 
                        scale: 1.1, 
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <UserPlus size={32} className="text-music-accent" />
                    </motion.div>
                    <h2 className="text-xl font-medium mb-2">Create a Community</h2>
                    <p className="text-music-textSecondary mb-6">
                      Start your own music community and invite friends to join.
                    </p>
                    <AnimatedButton 
                      variant="primary"
                      className="w-full" 
                      onClick={() => setAppState('create')}
                    >
                      Create New
                    </AnimatedButton>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {appState === 'join' && (
              <motion.div
                key="join"
                className="w-full max-w-4xl"
                variants={fadeIn()}
                initial="hidden"
                animate="visible"
                exit={{ 
                  opacity: 0, 
                  x: -100,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="mb-6 flex justify-between items-center">
                  <AnimatedButton 
                    variant="outline"
                    onClick={() => setAppState('intro')}
                  >
                    Back
                  </AnimatedButton>
                </div>
                <CommunityListing onSelectCommunity={handleCommunitySelection} />
              </motion.div>
            )}
            
            {appState === 'create' && (
              <motion.div
                key="create"
                className="w-full max-w-4xl"
                variants={fadeIn()}
                initial="hidden"
                animate="visible"
                exit={{ 
                  opacity: 0, 
                  x: -100,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="mb-6 flex justify-between items-center">
                  <AnimatedButton
                    variant="outline"
                    onClick={() => setAppState('intro')}
                  >
                    Back
                  </AnimatedButton>
                </div>
                <CreateCommunityForm onComplete={handleComplete} />
              </motion.div>
            )}
            
            {appState === 'join-form' && selectedCommunityId && (
              <motion.div
                key="join-form"
                className="w-full max-w-4xl"
                variants={fadeIn()}
                initial="hidden"
                animate="visible"
                exit={{ 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { duration: 0.3 }
                }}
              >
                <JoinCommunityForm 
                  communityId={selectedCommunityId}
                  onComplete={handleComplete}
                  onBack={() => setAppState('join')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.footer 
          className="p-6 text-center text-music-textSecondary text-sm"
          variants={scaleIn(0.8)}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Music size={16} />
            </motion.div>
            <span>MelodyShare — Share the music you love</span>
          </div>
        </motion.footer>
      </motion.div>
    </AnimatedWrapper>
  );
};

export default Onboarding;
