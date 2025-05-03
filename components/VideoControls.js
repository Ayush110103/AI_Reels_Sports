'use client';
import { useState } from 'react';
import styles from './VideoControls.module.css';

export default function VideoControls({ 
  isPlaying, 
  onTogglePlay, 
  progress, 
  likes,
  isMuted,
  onToggleMute
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatLikes = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <div className={styles.controlsWrapper}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div className={styles.controls}>
        <button 
          className={styles.playButton} 
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="4" height="16" fill="white"/>
              <rect x="14" y="4" width="4" height="16" fill="white"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="white"/>
            </svg>
          )}
        </button>
        
        <button 
          className={styles.muteButton} 
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9H7L12 4V20L7 15H3V9Z" fill="white"/>
              <path d="M16.5 12L21 16.5M16.5 16.5L21 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9H7L12 4V20L7 15H3V9Z" fill="white"/>
              <path d="M16 9C16 9 17 10.5 17 12C17 13.5 16 15 16 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 7C19 7 21 9 21 12C21 15 19 17 19 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        
        <div className={styles.spacer}></div>
        
        <button 
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`} 
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" 
              fill={isLiked ? "#FF4081" : "white"}/>
          </svg>
          <span className={styles.likeCount}>{formatLikes(likeCount)}</span>
        </button>
      </div>
    </div>
  );
}
