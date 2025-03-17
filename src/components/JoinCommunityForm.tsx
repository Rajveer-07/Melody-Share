
import React, { useState, useEffect, useCallback } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Loader, UserPlus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import debounce from 'lodash.debounce';
import { motion } from 'framer-motion';

interface JoinCommunityFormProps {
  communityId: string;
  onComplete: () => void;
  onBack: () => void;
}

const JoinCommunityForm: React.FC<JoinCommunityFormProps> = ({ communityId, onComplete, onBack }) => {
  const { joinCommunity, communities, isLoading, checkUsernameExists } = useMusicCommunity();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const community = communities.find(c => c.id === communityId);

  // Validation constants
  const MIN_USERNAME_LENGTH = 3;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores only

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (name: string) => {
      if (name.length >= MIN_USERNAME_LENGTH && USERNAME_REGEX.test(name)) {
        setIsValidating(true);
        try {
          const exists = await checkUsernameExists(name);
          setIsExistingUser(exists);
          if (exists) {
            setError(''); // Clear error if username exists (valid)
          }
        } catch (err) {
          console.error('Error checking username:', err);
        } finally {
          setIsValidating(false);
        }
      }
    }, 500),
    [checkUsernameExists]
  );

  // Debounced validation function
  const validate = useCallback(
    debounce(() => {
      if (!username.trim()) {
        setError('Username is required');
        return false;
      } else if (username.length < MIN_USERNAME_LENGTH) {
        setError(`Username must be at least ${MIN_USERNAME_LENGTH} characters`);
        return false;
      } else if (!USERNAME_REGEX.test(username)) {
        setError('Username can only contain letters, numbers, and underscores');
        return false;
      }
      setError('');
      return true;
    }, 300),
    [username]
  );

  // Run validation on input change
  useEffect(() => {
    setIsValidating(true);
    validate();
    checkUsername(username);
    setIsValidating(false);
  }, [username, validate, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await joinCommunity(communityId, username);
      
      if (isExistingUser) {
        toast({
          title: "Welcome back!",
          description: `You've rejoined "${community?.name}" as an existing user.`
        });
      } else {
        toast({
          title: "Joined community",
          description: `You've successfully joined "${community?.name}".`
        });
      }
      onComplete();
    } catch (error) {
      toast({
        title: "Failed to join community",
        description: "There was an error joining the community. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div className="bg-music-card rounded-xl p-6" variants={itemVariants}>
        <motion.h2 
          className="text-2xl font-medium mb-4 flex items-center text-music-textPrimary"
          variants={itemVariants}
        >
          <UserPlus size={24} className="mr-2 text-music-accent" />
          Join {community?.name || 'Community'}
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-music-textSecondary mb-1">
              Choose a Username
            </label>
            <motion.input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., MusicLover42"
              className="fancy-input"
              disabled={isLoading}
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : undefined}
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(29, 185, 84, 0.3)" }}
              transition={{ duration: 0.2 }}
            />
            {error && (
              <motion.p 
                id="username-error" 
                className="text-red-400 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
            {isExistingUser && !error && (
              <motion.p
                className="text-green-400 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Existing username detected - you'll join as a returning user
              </motion.p>
            )}
          </motion.div>

          <motion.div className="flex gap-3 pt-2" variants={itemVariants}>
            <motion.button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="premium-button-outline flex-1"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Back
            </motion.button>

            <motion.button
              type="submit"
              disabled={isLoading || isValidating}
              className="premium-button flex-1 flex items-center justify-center"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>{isExistingUser ? 'Rejoin' : 'Join Now'}</>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JoinCommunityForm;
