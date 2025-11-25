import React, { useState, useRef, useEffect } from 'react';
import './FloatingActionButton.css';

interface FloatingActionButtonProps {
  onAddPhoto: () => void;
  onCreateAlbum: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAddPhoto, onCreateAlbum }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAddPhotoClick = () => {
    setIsOpen(false);
    onAddPhoto();
  };

  const handleCreateAlbumClick = () => {
    setIsOpen(false);
    onCreateAlbum();
  };

  return (
    <div className="fab-container" ref={menuRef}>
      {isOpen && (
        <div className="fab-menu">
          <button className="fab-menu-item" onClick={handleAddPhotoClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Додати нове фото
          </button>
          <button className="fab-menu-item" onClick={handleCreateAlbumClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
              <path d="M6 2v4"/>
              <path d="M10 2v4"/>
              <path d="M14 2v4"/>
              <path d="M18 2v4"/>
            </svg>
            Створити альбом
          </button>
        </div>
      )}
      
      <button 
        className={`fab-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Додати"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round"
          className="fab-icon"
        >
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingActionButton;
