
import React, { useState } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Loader, Users } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface CreateCommunityFormProps {
  onComplete: () => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onComplete }) => {
  const { createCommunity, isLoading } = useMusicCommunity();
  const [communityName, setCommunityName] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({ community: '', username: '' });

  const validate = () => {
    const newErrors = { community: '', username: '' };
    let isValid = true;
    
    if (!communityName.trim()) {
      newErrors.community = 'Community name is required';
      isValid = false;
    } else if (communityName.length < 3) {
      newErrors.community = 'Community name must be at least 3 characters';
      isValid = false;
    }
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await createCommunity(communityName);
      toast({
        title: "Community created",
        description: `"${communityName}" has been created successfully.`
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Failed to create community",
        description: "There was an error creating your community. Please try again."
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-music-card rounded-xl p-6">
        <h2 className="text-2xl font-medium mb-4 flex items-center">
          <Users size={24} className="mr-2 text-music-accent" />
          Create New Community
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
              placeholder="e.g., Jazz Lovers, Rock Collective"
              className="fancy-input"
              disabled={isLoading}
            />
            {errors.community && (
              <p className="text-red-400 text-xs mt-1">{errors.community}</p>
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
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="premium-button w-full mt-4 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Community
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityForm;
