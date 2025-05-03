'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './ReelGenerationForm.module.css';

export default function ReelGenerationForm() {
  const [celebrityName, setCelebrityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!celebrityName.trim()) {
      setError('Please enter a celebrity name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ celebrityName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate reel');
      }
      
      setSuccess(true);
      setCelebrityName('');
      
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>Generate a New Reel</h3>
      
      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successMessage}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
            </svg>
            <p>Reel generation completed successfully!</p>
          </div>
          
          <div className={styles.actionButtons}>
            <Link href="/reels" className={styles.exploreButton}>
              Explore All Reels
            </Link>
          </div>
          
          <button onClick={resetForm} className={styles.generateAnotherButton}>
            Generate Another Reel
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className={styles.errorMessage}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="celebrityName" className={styles.label}>
                Sports Celebrity Name
              </label>
              <input
                type="text"
                id="celebrityName"
                value={celebrityName}
                onChange={(e) => setCelebrityName(e.target.value)}
                placeholder="e.g., Michael Jordan, Serena Williams"
                className={styles.input}
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Generating...
                </>
              ) : 'Generate Reel'}
            </button>
          </form>
          
          <div className={styles.disclaimer}>
            <p>Generation may take a few minutes. You'll be able to view your reel on the Reels page once it's ready.</p>
          </div>
        </>
      )}
    </div>
  );
}





