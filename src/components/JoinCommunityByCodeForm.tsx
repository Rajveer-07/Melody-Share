
import React, { useState } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Key, Loader, UserPlus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

interface JoinCommunityByCodeFormProps {
  onComplete: () => void;
  onBack: () => void;
}

const JoinCommunityByCodeForm: React.FC<JoinCommunityByCodeFormProps> = ({ onComplete, onBack }) => {
  const { joinCommunityByCode, isLoading } = useMusicCommunity();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{username?: string, code?: string}>({});

  // Validation constants
  const MIN_USERNAME_LENGTH = 3;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores only
  const CODE_REGEX = /^[A-Z0-9]{6,}$/; // At least 6 uppercase alphanumeric characters

  const validateForm = () => {
    const newErrors: {username?: string, code?: string} = {};
    let isValid = true;

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < MIN_USERNAME_LENGTH) {
      newErrors.username = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
      isValid = false;
    } else if (!USERNAME_REGEX.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
      isValid = false;
    }

    // Validate community code
    if (!code.trim()) {
      newErrors.code = 'Community code is required';
      isValid = false;
    } else if (!CODE_REGEX.test(code)) {
      newErrors.code = 'Invalid community code format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await joinCommunityByCode(code, username);
      toast({
        title: "Joined community",
        description: "You've successfully joined the community."
      });
      onComplete();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid community code')) {
          setErrors(prev => ({ ...prev, code: 'Invalid community code' }));
        } else {
          toast({
            title: "Failed to join community",
            description: error.message || "There was an error joining the community."
          });
        }
      }
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
          <Key size={24} className="mr-2 text-music-accent" />
          Join with Code
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label htmlFor="code" className="block text-sm font-medium text-music-textSecondary mb-1">
              Community Code
            </label>
            <motion.input
              id="code"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (errors.code) setErrors({...errors, code: undefined});
              }}
              placeholder="e.g., MUSIC123"
              className="fancy-input"
              disabled={isLoading}
              aria-invalid={!!errors.code}
              aria-describedby={errors.code ? "code-error" : undefined}
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(29, 185, 84, 0.3)" }}
              transition={{ duration: 0.2 }}
            />
            {errors.code && (
              <motion.p 
                id="code-error" 
                className="text-red-400 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.code}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-music-textSecondary mb-1">
              Choose a Username
            </label>
            <motion.input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({...errors, username: undefined});
              }}
              placeholder="e.g., MusicLover42"
              className="fancy-input"
              disabled={isLoading}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(29, 185, 84, 0.3)" }}
              transition={{ duration: 0.2 }}
            />
            {errors.username && (
              <motion.p 
                id="username-error" 
                className="text-red-400 text-xs mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {errors.username}
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
              disabled={isLoading}
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
                <>Join Now</>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JoinCommunityByCodeForm;
