import React, { useState } from 'react';
import { Photo, ReactionType } from '../types';
import './PhotoPost.css';

interface PhotoPostProps {
  photo: Photo;
  username: string;
  onLike?: (photoId: string) => void;
  onDislike?: (photoId: string) => void;
  currentUserId?: string;
}

const PhotoPost: React.FC<PhotoPostProps> = ({
  photo,
  username,
  onLike,
  onDislike,
  currentUserId,
}) => {
  const [imageError, setImageError] = useState(false);

  // Підрахунок лайків та дизлайків
  const likesCount = photo.likesCount ?? (photo.reactions?.filter(r => r.reactionType === ReactionType.Like).length || 0);
  const dislikesCount = photo.dislikesCount ?? (photo.reactions?.filter(r => r.reactionType === ReactionType.Dislike).length || 0);

  // Перевірка чи користувач вже поставив реакцію
  const userReaction = photo.reactions?.find(r => r.userId === currentUserId);
  const hasLiked = userReaction?.reactionType === ReactionType.Like;
  const hasDisliked = userReaction?.reactionType === ReactionType.Dislike;

  const handleLike = () => {
    if (onLike) {
      onLike(photo.id);
    }
  };

  const handleDislike = () => {
    if (onDislike) {
      onDislike(photo.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'щойно';
    } else if (diffInHours < 24) {
      return `${diffInHours} год тому`;
    } else if (diffInDays < 7) {
      return `${diffInDays} дн тому`;
    } else {
      return date.toLocaleDateString('uk-UA');
    }
  };

  return (
    <div className="photo-post">
      {/* Header */}
      <div className="photo-post-header">
        <div className="user-avatar">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <span className="username">{username}</span>
          <span className="post-time">{formatDate(photo.createdAt)}</span>
        </div>
      </div>

      {/* Photo */}
      <div className="photo-container">
        {!imageError ? (
          <img
            src={photo.url}
            alt={photo.description || 'Photo'}
            className="photo-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="photo-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Зображення недоступне</span>
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="photo-actions">
        <button
          className={`action-button ${hasLiked ? 'active-like' : ''}`}
          onClick={handleLike}
          disabled={!onLike}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="reaction-count">{likesCount}</span>
        </button>
        <button
          className={`action-button ${hasDisliked ? 'active-dislike' : ''}`}
          onClick={handleDislike}
          disabled={!onDislike}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={hasDisliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" transform="rotate(180 12 12)" />
          </svg>
          <span className="reaction-count">{dislikesCount}</span>
        </button>
      </div>

      {/* Description */}
      {photo.description && (
        <div className="photo-description">
          <span className="description-username">{username}</span>
          <span className="description-text">{photo.description}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoPost;
