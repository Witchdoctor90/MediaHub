import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { photoApi, albumApi } from '../services/api';
import { Photo, Album } from '../types';
import PhotoModal from '../components/PhotoModal';
import ConfirmDialog from '../components/ConfirmDialog';
import './AlbumDetail.css';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [photoToRemove, setPhotoToRemove] = useState<string | null>(null);

  const loadAlbumData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      // Завантажуємо дані альбома
      const albumData = await albumApi.getById(id);
      setAlbum(albumData);

      // Завантажуємо фото альбома
      const photosData = await photoApi.getForAlbumPaged(id, 1, 100);
      if (photosData && Array.isArray(photosData)) {
        setPhotos(photosData);
      }
    } catch (error) {
      console.error('Failed to load album data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAlbumData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAvailablePhotos = async () => {
    try {
      const data = await photoApi.getForUserPaged(1, 100);
      if (data && Array.isArray(data)) {
        // Фільтруємо фото: без альбома або не в поточному альбомі
        const available = data.filter((photo: Photo) => !photo.albumId);
        setAvailablePhotos(available);
      }
    } catch (error) {
      console.error('Failed to load available photos:', error);
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    setPhotoToRemove(photoId);
  };

  const confirmRemovePhoto = async () => {
    if (!id || !photoToRemove) return;

    try {
      await albumApi.removePhotos(id, [photoToRemove]);
      setPhotos((prev) => prev.filter((p) => p.id !== photoToRemove));
      setPhotoToRemove(null);
    } catch (error) {
      console.error('Failed to remove photo from album:', error);
      alert('Помилка при видаленні фото з альбома');
    }
  };

  const handleAddPhotosClick = () => {
    loadAvailablePhotos();
    setShowAddPhotosModal(true);
  };

  const handleAddPhotos = async (selectedPhotoIds: string[]) => {
    if (!id || selectedPhotoIds.length === 0) return;

    try {
      await albumApi.addPhotos(id, selectedPhotoIds);
      await loadAlbumData();
      setShowAddPhotosModal(false);
      setAvailablePhotos([]);
    } catch (error) {
      console.error('Failed to add photos to album:', error);
      alert('Помилка при додаванні фото');
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  if (isLoading) {
    return (
      <div className="album-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="album-detail">
        <div className="error-container">
          <h2>Альбом не знайдено</h2>
          <button onClick={() => navigate('/')}>Повернутись на головну</button>
        </div>
      </div>
    );
  }

  return (
    <div className="album-detail">
      <div className="album-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Назад
        </button>
        <h1>{album.title}</h1>
        <span className="photo-count">{photos.length} фото</span>
      </div>

      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img 
              src={photo.url} 
              alt={photo.description} 
              onClick={() => handlePhotoClick(photo)}
            />
            <button 
              className="remove-photo-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto(photo.id);
              }}
              title="Видалити з альбома"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}

        <div className="add-photo-item" onClick={handleAddPhotosClick}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Додати фото</span>
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          username="You"
          onClose={() => setSelectedPhoto(null)}
          onLike={() => {}}
          onDislike={() => {}}
        />
      )}

      {showAddPhotosModal && (
        <AddPhotosModal
          availablePhotos={availablePhotos}
          onClose={() => {
            setShowAddPhotosModal(false);
            setAvailablePhotos([]);
          }}
          onAdd={handleAddPhotos}
        />
      )}

      {photoToRemove && (
        <ConfirmDialog
          title="Видалити фото з альбома?"
          message="Фото буде видалено з цього альбома, але залишиться у вашій галереї."
          confirmText="Видалити"
          cancelText="Скасувати"
          type="danger"
          onConfirm={confirmRemovePhoto}
          onCancel={() => setPhotoToRemove(null)}
        />
      )}
    </div>
  );
};

interface AddPhotosModalProps {
  availablePhotos: Photo[];
  onClose: () => void;
  onAdd: (photoIds: string[]) => void;
}

const AddPhotosModal: React.FC<AddPhotosModalProps> = ({ availablePhotos, onClose, onAdd }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const togglePhoto = (photoId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    onAdd(Array.from(selectedIds));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Додати фото в альбом</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {availablePhotos.length === 0 ? (
            <div className="no-photos">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Немає доступних фото</p>
            </div>
          ) : (
            <>
              <p className="selection-count">Обрано: {selectedIds.size}</p>
              <div className="photos-selection-grid">
                {availablePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`selectable-photo ${selectedIds.has(photo.id) ? 'selected' : ''}`}
                    onClick={() => togglePhoto(photo.id)}
                  >
                    <img src={photo.url} alt={photo.description} />
                    <div className="checkbox">
                      {selectedIds.has(photo.id) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Скасувати</button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={selectedIds.size === 0}
          >
            Додати ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
