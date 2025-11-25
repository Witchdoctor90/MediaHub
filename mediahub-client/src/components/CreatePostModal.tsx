import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Album } from '../types';
import './CreatePostModal.css';

interface CreatePostModalProps {
  imageFile: File;
  onClose: () => void;
  onSubmit: (croppedImage: Blob, description: string, albumId?: string) => Promise<void>;
  albums: Album[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  imageFile,
  onClose,
  onSubmit,
  albums,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [description, setDescription] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(imageFile);

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
  }, [imageFile, onClose]);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (): Promise<Blob> => {
    if (!croppedAreaPixels) {
      throw new Error('No crop area');
    }

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const croppedImage = await getCroppedImg();
      await onSubmit(croppedImage, description, selectedAlbumId || undefined);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Помилка при створенні поста');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-modal-backdrop" onClick={onClose}>
      <div className="create-post-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-modal-header">
          <h2>Створити новий пост</h2>
          <button className="create-post-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="create-post-modal-body">
          <div className="crop-container">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="zoom-control">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
            </svg>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>

          <div className="post-form">
            <textarea
              className="post-description"
              placeholder="Напишіть опис..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <select
              className="album-select"
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
            >
              <option value="">Без альбома</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="create-post-modal-footer">
          <button className="cancel-button" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </button>
          <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Публікація...' : 'Опублікувати'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
