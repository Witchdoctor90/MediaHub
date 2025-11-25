import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import './CreateAlbumModal.css';

interface CreateAlbumModalProps {
  onClose: () => void;
  onSubmit: (title: string, selectedPhotoIds: string[]) => Promise<void>;
  availablePhotos: Photo[];
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  onClose,
  onSubmit,
  availablePhotos,
}) => {
  const [title, setTitle] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Block body scroll
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Будь ласка, введіть назву альбома');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(title.trim(), Array.from(selectedPhotoIds));
      onClose();
    } catch (error) {
      console.error('Failed to create album:', error);
      alert('Помилка при створенні альбома');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-album-modal-backdrop" onClick={onClose}>
      <div className="create-album-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-album-modal-header">
          <h2>Створити новий альбом</h2>
          <button className="create-album-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="create-album-modal-body">
          <div className="album-title-section">
            <label htmlFor="album-title">Назва альбома</label>
            <input
              id="album-title"
              type="text"
              className="album-title-input"
              placeholder="Введіть назву альбома..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="photos-selection-section">
            <div className="section-header">
              <h3>Виберіть фото для альбома</h3>
              <span className="selected-count">
                {selectedPhotoIds.size > 0 ? `Обрано: ${selectedPhotoIds.size}` : 'Не обов\'язково'}
              </span>
            </div>

            {availablePhotos.length === 0 ? (
              <div className="no-photos-message">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p>Немає доступних фото без альбома</p>
              </div>
            ) : (
              <div className="photos-grid">
                {availablePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`photo-item ${selectedPhotoIds.has(photo.id) ? 'selected' : ''}`}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <img src={photo.url} alt={photo.description} />
                    <div className="photo-checkbox">
                      {selectedPhotoIds.has(photo.id) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="create-album-modal-footer">
          <button className="cancel-button" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </button>
          <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? 'Створення...' : 'Створити альбом'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;
