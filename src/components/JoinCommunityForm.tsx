
import React, { useState } from 'react';
import { useMusicCommunity } from '../context/MusicCommunityContext';
import { Loader, UserPlus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface JoinCommunityFormProps {
  communityId: string;
  onComplete: () => void;
  onBack: () => void;
}

const JoinCommunityForm: React.FC<JoinCommunityFormProps> = ({ communityId, onComplete, onBack }) => {
  const { joinCommunity, communities, isLoading } = useMusicCommunity();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Find the community name
  const community = communities.find(c => c.id === communityId);

  const validate = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    } else if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await joinCommunity(communityId, username);
      toast({
        title: "Joined community",
        description: `You've successfully joined "${community?.name}".`
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Failed to join community",
        description: "There was an error joining the community. Please try again."
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-music-card rounded-xl p-6">
        <h2 className="text-2xl font-medium mb-4 flex items-center">
          <UserPlus size={24} className="mr-2 text-music-accent" />
          Join {community?.name || 'Community'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-music-textSecondary mb-1">
              Choose a Username
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
            {error && (
              <p className="text-red-400 text-xs mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="premium-button-outline flex-1"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="premium-button flex-1 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinCommunityForm;
