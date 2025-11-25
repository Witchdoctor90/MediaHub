import React from 'react';
import { Photo } from '../types';
import PhotoPost from './PhotoPost';
import './PhotoFeed.css';

interface PhotoFeedProps {
  photos: Photo[];
  usernames: { [userId: string]: string };
  onLike?: (photoId: string) => void;
  onDislike?: (photoId: string) => void;
  onPhotoClick?: (photo: Photo) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

const PhotoFeed: React.FC<PhotoFeedProps> = ({
  photos,
  usernames,
  onLike,
  onDislike,
  onPhotoClick,
  currentUserId,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="photo-feed">
        <div className="feed-loading">
          <div className="spinner"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="photo-feed">
        <div className="feed-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3>Фотографій поки немає</h3>
          <p>Додайте свою першу фотографію</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-feed">
      {photos.map((photo) => (
        <div key={photo.id} onClick={() => onPhotoClick?.(photo)} style={{ cursor: onPhotoClick ? 'pointer' : 'default' }}>
          <PhotoPost
            photo={photo}
            username={usernames[photo.userId] || 'Невідомий користувач'}
            onLike={onLike}
            onDislike={onDislike}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoFeed;
