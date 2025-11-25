import React, { useState, useEffect } from 'react';
import { photoApi, reactionApi } from '../services/api';
import { Photo } from '../types';
import PhotoModal from '../components/PhotoModal';
import './Photos.css';

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const perPage = 20;

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const data = await photoApi.getForUserPaged(currentPage, perPage);
        
        if (data && Array.isArray(data)) {
          // Завантажуємо кількість реакцій для кожного фото
          const photosWithReactions = await Promise.all(
            data.map(async (photo: Photo) => {
              try {
                const reactionsCount = await photoApi.getReactionsCount(photo.id);
                return {
                  ...photo,
                  likesCount: reactionsCount.likesCount || 0,
                  dislikesCount: reactionsCount.dislikesCount || 0,
                };
              } catch (error) {
                console.error(`Failed to load reactions for photo ${photo.id}:`, error);
                return {
                  ...photo,
                  likesCount: 0,
                  dislikesCount: 0,
                };
              }
            })
          );
          
          setPhotos((prev) => currentPage === 1 ? photosWithReactions : [...prev, ...photosWithReactions]);
          setHasMore(data.length === perPage);
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, [currentPage]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleLike = async (photoId: string) => {
    try {
      await reactionApi.add(photoId, 0); // 0 = Like
      // Перезавантажуємо фото
      setCurrentPage(1);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Failed to like photo:', error);
    }
  };

  const handleDislike = async (photoId: string) => {
    try {
      await reactionApi.add(photoId, 1); // 1 = Dislike
      // Перезавантажуємо фото
      setCurrentPage(1);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Failed to dislike photo:', error);
    }
  };

  return (
    <div className="photos-page">
      <div className="photos-header">
        <h1>Мої фотографії</h1>
        <p>{photos.length} {photos.length === 1 ? 'фото' : 'фотографій'}</p>
      </div>

      {isLoading && currentPage === 1 ? (
        <div className="photos-loading">
          <div className="spinner"></div>
          <p>Завантаження...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="photos-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3>У вас поки немає фотографій</h3>
          <p>Завантажте свою першу фотографію</p>
        </div>
      ) : (
        <>
          <div className="photos-gallery">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="gallery-item"
                onClick={() => handlePhotoClick(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.description || 'Photo'} 
                  loading="lazy"
                />
                {photo.description && (
                  <div className="gallery-item-overlay">
                    <p>{photo.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasMore && !isLoading && (
            <div className="photos-load-more">
              <button onClick={loadMore} className="load-more-button">
                Завантажити ще
              </button>
            </div>
          )}

          {isLoading && currentPage > 1 && (
            <div className="photos-loading-more">
              <div className="spinner-small"></div>
              Завантаження...
            </div>
          )}
        </>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          username="Мій профіль"
          onClose={handleCloseModal}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </div>
  );
};

export default Photos;
