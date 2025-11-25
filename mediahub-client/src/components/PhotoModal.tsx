import React from 'react';
import { Photo } from '../types';
import PhotoPost from './PhotoPost';
import './PhotoModal.css';

interface PhotoModalProps {
  photo: Photo;
  username: string;
  onClose: () => void;
  onLike?: (photoId: string) => void;
  onDislike?: (photoId: string) => void;
  currentUserId?: string;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  username,
  onClose,
  onLike,
  onDislike,
  currentUserId,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="photo-modal-backdrop" onClick={handleBackdropClick}>
      <div className="photo-modal-container">
        <button className="photo-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="photo-modal-content">
          <PhotoPost
            photo={photo}
            username={username}
            onLike={onLike}
            onDislike={onDislike}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
