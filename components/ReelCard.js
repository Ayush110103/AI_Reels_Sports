'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ReelCard.module.css';

export default function ReelCard({ video, onClick }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use video thumbnail or a frame from the video if available
  // Otherwise use a placeholder
  const thumbnailUrl = video.thumbnailUrl || '/images/placeholder.jpg';
  
  return (
    <div className={styles.reelCard} onClick={onClick}>
      <div className={styles.thumbnailContainer}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        
        <Image 
          src={thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className={styles.thumbnail}
          onLoad={() => setIsLoading(false)}
        />
        
        <div className={styles.playIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="white"/>
          </svg>
        </div>
      </div>
      
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{video.title}</h3>
        <div className={styles.cardMeta}>
          <span className={styles.likes}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="white"/>
            </svg>
            {video.likes}
          </span>
        </div>
      </div>
    </div>
  );
}