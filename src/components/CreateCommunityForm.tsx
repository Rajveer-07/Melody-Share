
import React, { useState, useEffect, useCallback } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Loader, UserPlus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import debounce from 'lodash.debounce';

interface CreateCommunityFormProps {
  onComplete: () => void;
  onBack?: () => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onComplete, onBack }) => {
  const { createCommunity, isLoading, checkUsernameExists } = useMusicCommunity();
  const [communityName, setCommunityName] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({ communityName: '', username: '' });
  const [isExistingUsername, setIsExistingUsername] = useState(false);

  // Validation rules
  const MIN_NAME_LENGTH = 3;
  const MIN_USERNAME_LENGTH = 3;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores only

  // Debounced username check
  const checkUsername = useCallback(
    debounce(async (name: string) => {
      if (name.length >= MIN_USERNAME_LENGTH && USERNAME_REGEX.test(name)) {
        try {
          const exists = await checkUsernameExists(name);
          setIsExistingUsername(exists);
        } catch (err) {
          console.error('Error checking username:', err);
        }
      }
    }, 500),
    [checkUsernameExists]
  );

  // Debounced validation function
  const validate = useCallback(
    debounce(() => {
      const newErrors = { communityName: '', username: '' };
      let isValid = true;

      if (!communityName.trim()) {
        newErrors.communityName = 'Community name is required';
        isValid = false;
      } else if (communityName.length < MIN_NAME_LENGTH) {
        newErrors.communityName = `Community name must be at least ${MIN_NAME_LENGTH} characters`;
        isValid = false;
      }

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

      setErrors(newErrors);
      return isValid;
    }, 300),
    [communityName, username]
  );

  // Run validation on input change
  useEffect(() => {
    validate();
  }, [communityName, username, validate]);

  // Check username when it changes
  useEffect(() => {
    checkUsername(username);
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Pass both community name and username
      await createCommunity(communityName, username);
      
      const message = isExistingUsername
        ? `Your community "${communityName}" has been created and you've joined as a returning user.`
        : `Your community "${communityName}" has been created and saved to your account.`;
        
      toast({
        title: "Community created",
        description: message,
      });
      onComplete();
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        title: "Failed to create community",
        description: "There was an error creating your community. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-music-card rounded-xl p-6">
        <h2 className="text-2xl font-medium mb-4 flex items-center">
          <UserPlus size={24} className="mr-2 text-music-accent" />
          Create a New Community
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="communityName" className="block text-sm font-medium text-music-textSecondary mb-1">
              Community Name
            </label>
            <input
              id="communityName"
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="e.g., Jazz Enthusiasts"
              className="fancy-input"
              disabled={isLoading}
              aria-invalid={!!errors.communityName}
              aria-describedby={errors.communityName ? "communityName-error" : undefined}
            />
            {errors.communityName && (
              <p id="communityName-error" className="text-red-400 text-xs mt-1">
                {errors.communityName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-music-textSecondary mb-1">
              Your Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., MusicLover42"
              className="fancy-input"
              disabled={isLoading}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-400 text-xs mt-1">
                {errors.username}
              </p>
            )}
            {isExistingUsername && !errors.username && (
              <p className="text-green-400 text-xs mt-1">
                Existing username detected - you'll join as a returning user
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="premium-button w-full flex items-center justify-center mt-4"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Community</>
            )}
          </button>
          
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="premium-button-outline w-full mt-2"
            >
              Back
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityForm;
