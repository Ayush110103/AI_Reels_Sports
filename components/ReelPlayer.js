'use client';
import { useRef, useState, useEffect } from 'react';
import styles from './ReelPlayer.module.css';
import VideoControls from './VideoControls';

export default function ReelPlayer({ video, isActive, onEnded }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Changed from true to false
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    if (isActive && !needsInteraction) {
      videoRef.current?.play().catch(err => {
        console.error('Error playing video:', err);
        if (err.name === 'NotAllowedError') {
          setNeedsInteraction(true);
        } else {
          setError(`Unable to play video: ${err.message}`);
        }
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, needsInteraction]);

  const togglePlay = () => {
    if (needsInteraction) {
      setNeedsInteraction(false);
      videoRef.current.muted = isMuted; // This will now be false by default
      videoRef.current.play().catch(err => {
        console.error('Error playing video after interaction:', err);
        setError(`Unable to play video: ${err.message}`);
      });
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        setError(`Unable to play video: ${err.message}`);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    setError('Failed to load video. The video format might not be supported or the URL is invalid.');
    setIsLoading(false);
  };

  const handleVideoClick = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (!isLiked) {
        handleLike();
        
        // Show heart animation
        const heart = document.createElement('div');
        heart.className = styles.heartAnimation;
        heart.style.left = `${e.clientX - 40}px`;
        heart.style.top = `${e.clientY - 40}px`;
        document.body.appendChild(heart);
        
        setTimeout(() => {
          document.body.removeChild(heart);
        }, 1000);
      }
    } else {
      // Single tap - toggle play/pause
      togglePlay();
    }
    
    setLastTap(currentTime);
  };

  const videoUrl = video.url;

  return (
    <div className={styles.reelContainer}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {error ? (
        <div className={styles.errorOverlay}>
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setNeedsInteraction(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className={styles.videoPlayer}
            playsInline
            loop
            muted={isMuted}
            onClick={handleVideoClick}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          
          {needsInteraction && isActive && !isLoading && !error && (
            <div className={styles.initialPlayOverlay} onClick={togglePlay}>
              <div className={styles.playButtonLarge}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
                <p>Tap to play</p>
              </div>
            </div>
          )}
        </>
      )}
      
      <div className={styles.overlay}>
        <h2 className={styles.title}>{video.title}</h2>
        <p className={styles.description}>{video.description}</p>
      </div>
      
      <VideoControls 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay}
        progress={progress}
        likes={video.likes}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
    </div>
  );
}



