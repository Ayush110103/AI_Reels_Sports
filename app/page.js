import Link from 'next/link';
import Image from 'next/image';
import ReelGenerationForm from '../components/ReelGenerationForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Sports Celebrity History Reels</h1>
          <p className={styles.description}>
            Discover the fascinating stories behind your favorite sports legends through
            AI-generated video reels.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/reels" className={styles.primaryButton}>
              Watch Reels
            </Link>
            <a href="#generate" className={styles.secondaryButton}>
              Create New Reel
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImageContainer}>
            <Image 
              src="/collage.jpg" 
              alt="Sports celebrities collage" 
              width={600} 
              height={400}
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </div>
      
      <section id="generate" className={styles.generationSection}>
        <div className={styles.generationContainer}>
          <div className={styles.generationInfo}>
            <h2 className={styles.sectionTitle}>Create Your Own Reel</h2>
            <p className={styles.generationDescription}>
              Generate a custom sports celebrity reel in just a few clicks. Our AI will create a compelling story about your favorite athlete.
            </p>
          </div>
          <ReelGenerationForm />
        </div>
      </section>
    </main>
  );
}











