
import React, { useState } from 'react';
import { ChevronRight, User, Users, Calendar } from 'lucide-react';
import { Community, useMusicCommunity } from '../context/MusicCommunityContext';

interface CommunityListingProps {
  onSelectCommunity: (communityId: string) => void;
}

const CommunityListing: React.FC<CommunityListingProps> = ({ onSelectCommunity }) => {
  const { communities, isLoading } = useMusicCommunity();
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null);

  const toggleExpand = (communityId: string) => {
    setExpandedCommunity(expandedCommunity === communityId ? null : communityId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-medium mb-4">Available Communities</h2>
      
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-music-card rounded-xl p-4 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/3"></div>
            </div>
          ))
        ) : communities.length === 0 ? (
          <div className="bg-music-card rounded-xl p-8 text-center">
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-music-textSecondary">No communities available. Create one to get started!</p>
          </div>
        ) : (
          communities.map(community => (
            <div 
              key={community.id}
              className="bg-music-card rounded-xl overflow-hidden transition-all duration-300"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-music-cardHover"
                onClick={() => toggleExpand(community.id)}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{community.name}</h3>
                  <div className="flex items-center text-music-textSecondary text-sm mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>Created {formatDate(community.creationDate)}</span>
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`transition-transform duration-300 ${expandedCommunity === community.id ? 'rotate-90' : ''}`} 
                />
              </div>
              
              {expandedCommunity === community.id && (
                <div className="p-4 border-t border-white/10 bg-black/20 animate-fade-in">
                  <p className="text-music-textSecondary mb-4">Join this community to start sharing music with other members.</p>
                  <button
                    className="premium-button w-full flex items-center justify-center"
                    onClick={() => onSelectCommunity(community.id)}
                  >
                    <User size={18} className="mr-2" />
                    Join Community
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityListing;
