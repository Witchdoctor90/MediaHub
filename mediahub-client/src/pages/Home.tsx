import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { photoApi, reactionApi, albumApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Photo, Album } from '../types';
import PhotoFeed from '../components/PhotoFeed';
import PhotoModal from '../components/PhotoModal';
import FloatingActionButton from '../components/FloatingActionButton';
import CreatePostModal from '../components/CreatePostModal';
import CreateAlbumModal from '../components/CreateAlbumModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useConfirm } from '../hooks/useConfirm';
import './Home.css';

type ViewMode = 'photos' | 'albums';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { confirm, confirmState } = useConfirm();
  const [viewMode, setViewMode] = useState<ViewMode>('photos');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [usernames, setUsernames] = useState<{ [userId: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [photosWithoutAlbum, setPhotosWithoutAlbum] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const perPage = 10;

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const data = await photoApi.getPaged(currentPage, perPage);
        
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
          
          // Збираємо унікальні userId
          const uniqueUserIds = Array.from(new Set(data.map((p: Photo) => p.userId)));
          // Тут можна додати API запит для отримання юзернеймів
          // Поки що використовуємо заглушку
          const newUsernames: { [key: string]: string } = {};
          uniqueUserIds.forEach((id) => {
            newUsernames[id] = `User_${id.slice(0, 8)}`;
          });
          setUsernames((prev) => ({ ...prev, ...newUsernames }));
        }
      } catch (error) {
        console.error('Failed to load photos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadAlbums = async () => {
      try {
        setIsLoading(true);
        const data = await albumApi.getAll();
        
        if (data && Array.isArray(data)) {
          // Завантажуємо першу фотку для кожного альбома
          const albumsWithCovers = await Promise.all(
            data.map(async (album: Album) => {
              try {
                const photos = await photoApi.getForAlbumPaged(album.id, 1, 1);
                return {
                  ...album,
                  coverPhoto: photos && photos.length > 0 ? photos[0] : null,
                };
              } catch (error) {
                console.error(`Failed to load cover for album ${album.id}:`, error);
                return { ...album, coverPhoto: null };
              }
            })
          );
          
          setAlbums(albumsWithCovers);
          
          // Збираємо унікальні userId
          const uniqueUserIds = Array.from(new Set(data.map((a: Album) => a.userId)));
          const newUsernames: { [key: string]: string } = {};
          uniqueUserIds.forEach((id) => {
            newUsernames[id] = `User_${id.slice(0, 8)}`;
          });
          setUsernames((prev) => ({ ...prev, ...newUsernames }));
        }
      } catch (error) {
        console.error('Failed to load albums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (viewMode === 'photos') {
      loadPhotos();
    } else {
      loadAlbums();
    }
  }, [currentPage, viewMode]);

  const handleLike = async (photoId: string) => {
    try {
      await reactionApi.add(photoId, 0); // 0 = Like
      // Оновлюємо локальний стан
      const reactions = await photoApi.getReactionsCount(photoId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p.id === photoId
            ? { ...p, likesCount: reactions.likesCount, dislikesCount: reactions.dislikesCount }
            : p
        )
      );
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, likesCount: reactions.likesCount, dislikesCount: reactions.dislikesCount });
      }
    } catch (error) {
      console.error('Failed to like photo:', error);
    }
  };

  const handleDislike = async (photoId: string) => {
    try {
      await reactionApi.add(photoId, 1); // 1 = Dislike
      // Оновлюємо локальний стан
      const reactions = await photoApi.getReactionsCount(photoId);
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          p.id === photoId
            ? { ...p, likesCount: reactions.likesCount, dislikesCount: reactions.dislikesCount }
            : p
        )
      );
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, likesCount: reactions.likesCount, dislikesCount: reactions.dislikesCount });
      }
    } catch (error) {
      console.error('Failed to dislike photo:', error);
    }
  };

  const loadUserAlbums = async () => {
    try {
      const data = await albumApi.getAllForUser();
      if (data && Array.isArray(data)) {
        setUserAlbums(data);
      }
    } catch (error) {
      console.error('Failed to load user albums:', error);
    }
  };

  const handleAddPhotoClick = () => {
    loadUserAlbums();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setShowCreateModal(true);
    }
    // Reset input value
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleCreatePost = async (croppedImage: Blob, description: string, albumId?: string) => {
    try {
      const file = new File([croppedImage], selectedFile?.name || 'photo.jpg', { type: 'image/jpeg' });
      await photoApi.add(file, description, albumId);
      
      // Перезавантажуємо фото
      setCurrentPage(1);
      setPhotos([]);
      setHasMore(true);
      
      await confirm({
        title: 'Успіх!',
        message: 'Фото успішно опубліковано!',
        confirmText: 'OK',
        type: 'info'
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedFile(null);
  };

  const loadPhotosWithoutAlbum = async () => {
    try {
      const data = await photoApi.getForUserPaged(1, 100);
      if (data && Array.isArray(data)) {
        // Фільтруємо тільки фото без альбома
        const withoutAlbum = data.filter((photo: Photo) => !photo.albumId);
        setPhotosWithoutAlbum(withoutAlbum);
      }
    } catch (error) {
      console.error('Failed to load photos without album:', error);
    }
  };

  const handleCreateAlbumClick = () => {
    loadPhotosWithoutAlbum();
    setShowCreateAlbumModal(true);
  };

  const handleCreateAlbum = async (title: string, photoIds: string[]) => {
    try {
      // Створюємо альбом
      const newAlbum = await albumApi.add(title);
      
      // Якщо є вибрані фото, додаємо їх в альбом
      if (photoIds.length > 0 && newAlbum.id) {
        await albumApi.addPhotos(newAlbum.id, photoIds);
      }
      
      // Перезавантажуємо альбоми якщо ми на вкладці альбомів
      if (viewMode === 'albums') {
        setCurrentPage(1);
        setAlbums([]);
      }
      
      await confirm({
        title: 'Успіх!',
        message: 'Альбом успішно створено!',
        confirmText: 'OK',
        type: 'info'
      });
    } catch (error) {
      console.error('Failed to create album:', error);
      throw error;
    }
  };

  const handleCloseCreateAlbumModal = () => {
    setShowCreateAlbumModal(false);
    setPhotosWithoutAlbum([]);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
    setPhotos([]);
    setAlbums([]);
  };

  return (
    <div className="page" style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>
      {/* Перемикач */}
      <div className="view-toggle-container">
        <div className="view-toggle">
          <button
            className={`toggle-button ${viewMode === 'photos' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('photos')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Фото
          </button>
          <button
            className={`toggle-button ${viewMode === 'albums' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('albums')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
              <path d="M6 2v4"/>
              <path d="M10 2v4"/>
              <path d="M14 2v4"/>
              <path d="M18 2v4"/>
            </svg>
            Альбоми
          </button>
        </div>
      </div>

      {/* Контент */}
      {viewMode === 'photos' ? (
        <>
          <PhotoFeed
            photos={photos}
            usernames={usernames}
            onLike={handleLike}
            onDislike={handleDislike}
            onPhotoClick={setSelectedPhoto}
            currentUserId={user?.id}
            isLoading={isLoading}
          />
          {hasMore && !isLoading && photos.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <button
                onClick={loadMore}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  color: '#495057',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Завантажити ще
              </button>
            </div>
          )}
          {isLoading && currentPage > 1 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
              Завантаження...
            </div>
          )}
        </>
      ) : (
        <div className="albums-grid">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
              Завантаження...
            </div>
          ) : albums.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 20px', display: 'block', color: '#adb5bd' }}>
                <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
                <path d="M6 2v4"/>
                <path d="M10 2v4"/>
                <path d="M14 2v4"/>
                <path d="M18 2v4"/>
              </svg>
              <h3 style={{ color: '#495057', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Альбомів поки немає</h3>
              <p>Створіть свій перший альбом</p>
            </div>
          ) : (
            albums.map((album) => (
              <div 
                key={album.id} 
                className="album-card"
                onClick={() => navigate(`/album/${album.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="album-cover">
                  {album.coverPhoto ? (
                    <img src={album.coverPhoto.url} alt={album.title} />
                  ) : (
                    <div className="album-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>{album.photos?.length || 0} фото</p>
                  <span className="album-author">{usernames[album.userId]}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          username={usernames[selectedPhoto.userId] || 'Невідомий користувач'}
          onClose={() => setSelectedPhoto(null)}
          onLike={handleLike}
          onDislike={handleDislike}
          currentUserId={user?.id}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <FloatingActionButton 
        onAddPhoto={handleAddPhotoClick} 
        onCreateAlbum={handleCreateAlbumClick}
      />

      {showCreateModal && selectedFile && (
        <CreatePostModal
          imageFile={selectedFile}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreatePost}
          albums={userAlbums}
        />
      )}

      {showCreateAlbumModal && (
        <CreateAlbumModal
          onClose={handleCloseCreateAlbumModal}
          onSubmit={handleCreateAlbum}
          availablePhotos={photosWithoutAlbum}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          type={confirmState.type}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
    </div>
  );
};

export default Home;
