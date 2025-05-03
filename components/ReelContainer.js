'use client';
import { useState, useEffect, useRef } from 'react';
import ReelPlayer from './ReelPlayer';
import ReelCard from './ReelCard';
import styles from './ReelContainer.module.css';

export default function ReelContainer() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const popupRef = useRef(null);
  
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, []);

  const handleCardClick = (video) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = (e) => {
    if (e && popupRef.current && !popupRef.current.contains(e.target)) {
      setSelectedVideo(null);
      document.body.style.overflow = 'auto';
    }
  };
  
  const handleCloseButtonClick = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return <div className={styles.loading}>Loading reels...</div>;
  }

  if (videos.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>No reels available</h2>
        <p>Generate some reels on the home page to get started!</p>
        <a href="/" className={styles.homeLink}>Go to Home</a>
      </div>
    );
  }

  return (
    <>
      <div className={styles.reelsGrid}>
        {videos.map((video) => (
          <ReelCard 
            key={video.id} 
            video={video} 
            onClick={() => handleCardClick(video)} 
          />
        ))}
      </div>
      
      {selectedVideo && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div className={styles.popupContent} ref={popupRef}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseButtonClick}
              aria-label="Close"
            >
              ✕
            </button>
            <ReelPlayer 
              video={selectedVideo} 
              isActive={true}
            />
          </div>
        </div>
      )}
    </>
  );
}






