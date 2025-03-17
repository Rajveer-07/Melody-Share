import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Users, UserPlus, Music, Headphones, ArrowLeft } from 'lucide-react';
import CommunityListing from '../components/CommunityListing';
import CreateCommunityForm from '../components/CreateCommunityForm';
import JoinCommunityForm from '../components/JoinCommunityForm';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedContainer, { fadeIn, scaleIn, staggerContainer } from '../components/motion/AnimatedContainer';
import { ScrollArea } from '../components/ui/scroll-area';
import WavyText from '../components/WavyText';
type AppState = 'intro' | 'join' | 'create' | 'join-form';
const Onboarding: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentCommunity,
    communities
  } = useMusicCommunity();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const joinCommunityId = params.get('join');
    if (joinCommunityId) {
      const communityExists = communities.some(c => c.id === joinCommunityId);
      if (communityExists) {
        setSelectedCommunityId(joinCommunityId);
        setAppState('join-form');
      }
    }
  }, [location.search, communities]);
  useEffect(() => {
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
  const features = [{
    icon: <Music className="text-blue-400" size={24} />,
    title: "Daily Music Sharing",
    description: "Share one song per day with your community"
  }, {
    icon: <Users className="text-yellow-400" size={24} />,
    title: "Active Communities",
    description: "Join vibrant music-loving communities"
  }, {
    icon: <Headphones className="text-pink-400" size={24} />,
    title: "Music Integration",
    description: "Seamless playback with embedded players"
  }];
  return <ScrollArea className="h-screen">
      <AnimatedContainer containerVariants="fade" className="min-h-screen bg-music-dark relative overflow-hidden">
        {/* Decorative animated gradient background */}
        <motion.div className="absolute inset-0 pointer-events-none" initial={{
        backgroundPosition: "0% 50%"
      }} animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }} style={{
        backgroundSize: "400% 400%",
        backgroundImage: "linear-gradient(135deg, #0F0F0F 0%, #181818 25%, #222222 50%, #181818 75%, #0F0F0F 100%)"
      }}>
          {/* Decorative blurred gradient circles */}
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[120px] opacity-40"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[120px] opacity-30"></div>
        </motion.div>
        
        <div className="flex-grow flex flex-col items-center justify-center p-3 sm:p-6 relative z-10">
          <AnimatedContainer containerVariants="fade" delay={0.2} className="max-w-4xl w-full mx-auto text-center mb-4 sm:mb-6">
            <AnimatedContainer containerVariants="slide" direction="down" duration={0.8} className="overflow-hidden">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">
                <WavyText text="MelodyShare" className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400" delay={0.1} />
              </h1>
            </AnimatedContainer>
            
            <AnimatedContainer containerVariants="fade" delay={0.4} duration={0.6}>
              <p className="text-music-textSecondary text-sm sm:text-lg max-w-2xl mx-auto">
                Discover, share, and connect through music with your community.
              </p>
            </AnimatedContainer>
          </AnimatedContainer>

          <AnimatePresence mode="wait">
            {appState === 'intro' && <AnimatedContainer key="intro" containerVariants="stagger" staggerChildren={0.1} className="w-full max-w-4xl px-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <AnimatedContainer containerVariants="scale" delay={0.2} className="glass-panel rounded-xl p-5 sm:p-8 flex flex-col items-center text-center h-full relative overflow-hidden group">
                    {/* Background hover effect */}
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div className="bg-white/10 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 relative z-10" whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transition: {
                    duration: 0.2
                  }
                }} animate={{
                  y: [0, -5, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}>
                      <Users size={28} className="text-music-accent" />
                    </motion.div>
                    
                    <h2 className="text-lg sm:text-xl font-medium mb-2 relative z-10">Join a Community</h2>
                    <p className="text-music-textSecondary text-sm mb-4 sm:mb-6 relative z-10">
                      Browse and join existing music communities to start sharing songs.
                    </p>
                    
                    <motion.button className="w-full text-sm sm:text-base py-2 bg-music-accent hover:bg-music-accentHover text-white rounded-full font-medium transition-colors relative z-10" whileHover={{
                  scale: 1.03
                }} whileTap={{
                  scale: 0.97
                }} onClick={() => setAppState('join')}>
                      Find Communities
                    </motion.button>
                  </AnimatedContainer>
                  
                  <AnimatedContainer containerVariants="scale" delay={0.4} className="glass-panel rounded-xl p-5 sm:p-8 flex flex-col items-center text-center h-full relative overflow-hidden group">
                    {/* Background hover effect */}
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div className="bg-white/10 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 relative z-10" whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transition: {
                    duration: 0.2
                  }
                }} animate={{
                  y: [0, -5, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.3
                  }
                }}>
                      <UserPlus size={28} className="text-music-accent" />
                    </motion.div>
                    
                    <h2 className="text-lg sm:text-xl font-medium mb-2 relative z-10">Create a Community</h2>
                    <p className="text-music-textSecondary text-sm mb-4 sm:mb-6 relative z-10">
                      Start your own music community and invite friends to join.
                    </p>
                    
                    <motion.button className="w-full text-sm sm:text-base py-2 bg-music-accent hover:bg-music-accentHover text-white rounded-full font-medium transition-colors relative z-10" whileHover={{
                  scale: 1.03
                }} whileTap={{
                  scale: 0.97
                }} onClick={() => setAppState('create')}>
                      Create New
                    </motion.button>
                  </AnimatedContainer>
                </div>
              </AnimatedContainer>}
            
            {appState === 'join' && <AnimatedContainer key="join" containerVariants="fade" className="w-full max-w-4xl px-3">
                <div className="mb-4">
                  <motion.button className="flex items-center gap-2 text-music-textSecondary hover:text-white transition-colors" whileHover={{
                x: -3
              }} onClick={() => setAppState('intro')}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </motion.button>
                </div>
                <CommunityListing onSelectCommunity={handleCommunitySelection} onBack={() => setAppState('intro')} />
              </AnimatedContainer>}
            
            {appState === 'create' && <AnimatedContainer key="create" containerVariants="fade" className="w-full max-w-4xl px-3">
                <div className="mb-4">
                  <motion.button className="flex items-center gap-2 text-music-textSecondary hover:text-white transition-colors" whileHover={{
                x: -3
              }} onClick={() => setAppState('intro')}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </motion.button>
                </div>
                <CreateCommunityForm onComplete={handleComplete} />
              </AnimatedContainer>}
            
            {appState === 'join-form' && selectedCommunityId && <AnimatedContainer key="join-form" containerVariants="fade" className="w-full max-w-4xl px-3">
                <JoinCommunityForm communityId={selectedCommunityId} onComplete={handleComplete} onBack={() => setAppState('join')} />
              </AnimatedContainer>}
          </AnimatePresence>
        </div>
        
        {appState === 'intro' && <AnimatedContainer containerVariants="stagger" staggerChildren={0.2} className="max-w-6xl mx-auto mb-6 sm:mb-10 px-3 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {features.map((feature, index) => <AnimatedContainer key={index} containerVariants="scale" delay={0.2 + index * 0.1} className="flex flex-col items-center bg-black/30 backdrop-blur-md rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all">
                  <motion.div className="mb-2 bg-white/5 rounded-full p-2" animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0, -2, 0]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.5
            }}>
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-sm font-medium mb-1 text-white">{feature.title}</h3>
                  <p className="text-xs text-music-textSecondary">{feature.description}</p>
                </AnimatedContainer>)}
            </div>
          </AnimatedContainer>}
        
        <AnimatedContainer containerVariants="fade" delay={0.8} className="p-3 sm:p-4 text-center text-music-textSecondary text-xs">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }} transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop"
          }}>
              <Music size={14} className="text-music-accent" />
            </motion.div>
            
          </div>
        </AnimatedContainer>
      </AnimatedContainer>
    </ScrollArea>;
};
export default Onboarding;