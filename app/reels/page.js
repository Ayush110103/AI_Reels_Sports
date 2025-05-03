'use client';

import Link from 'next/link';
import ReelContainer from '../../components/ReelContainer';
import styles from './page.module.css';

export default function ReelsPage() {
  return (
    <div className={styles.reelsPage}>
      <div style={{ 
        padding: '15px', 
        background: '#333', 
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            background: 'white',
            color: '#E1306C',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          ← Back to Home Page
        </Link>
      </div>
      <ReelContainer />
    </div>
  );
}




