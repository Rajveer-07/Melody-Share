
import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  addedBy: string;
  spotifyUri: string;
  mood?: string;
  onClick?: () => void; // Add the onClick prop
}

const SongCard: React.FC<SongCardProps> = ({
  id,
  title,
  artist,
  albumArt,
  addedBy,
  spotifyUri,
  mood,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract the track ID from the Spotify URI
  const trackId = spotifyUri.split(':').pop();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (trackId) {
      window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
    }
  };

  return (
    <div
      className="song-card w-full sm:w-[300px] h-[300px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="song-image-container">
        <div className={`absolute inset-0 loading-skeleton ${imageLoaded ? 'hidden' : 'block'}`}></div>
        <img
          src={albumArt}
          alt={`${title} by ${artist}`}
          className={`song-image transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Play overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleClick}
            className="w-16 h-16 bg-music-accent rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-105 active:scale-95"
            title="Play on Spotify"
          >
            <ExternalLink className="text-white w-8 h-8" />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg leading-tight line-clamp-1">{title}</h3>
        <p className="text-music-textSecondary text-sm mt-1">{artist}</p>
        
        <div className="flex items-center mt-auto pt-2 space-x-2">
          <span className="text-xs text-music-textSecondary">
            Added by <span className="text-music-accent">{addedBy}</span>
          </span>
          
          {mood && (
            <>
              <span className="text-xs text-music-textSecondary">•</span>
              <span className="text-xs px-2 py-0.5 bg-music-accent/20 rounded-full">
                {mood}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
