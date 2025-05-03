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
      
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Our Platform</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>AI-Generated Content</h3>
            <p>Our platform uses advanced AI to create engaging and informative videos about sports celebrities.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Immersive Experience</h3>
            <p>Enjoy a smooth, card-based viewing experience optimized for all devices.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🏆</div>
            <h3>Sports Legends</h3>
            <p>Explore the stories of the greatest athletes from around the world across all sports.</p>
          </div>
        </div>
      </section>
      
      <section id="generate" className={styles.generationSection}>
        <div className={styles.generationContainer}>
          <div className={styles.generationInfo}>
            <h2 className={styles.sectionTitle}>Create Your Own Reel</h2>
            <p className={styles.generationDescription}>
              Generate a custom sports celebrity reel in just a few clicks. Our AI will create a compelling story about your favorite athlete.
            </p>
            <div className={styles.generationSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <p>Enter the name of your favorite sports celebrity</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <p>Our AI generates a personalized script</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <p>Watch and share your custom reel</p>
              </div>
            </div>
          </div>
          <div className={styles.formContainer}>
            <ReelGenerationForm />
          </div>
        </div>
      </section>
      
      <section className={styles.showcaseSection}>
        <h2 className={styles.sectionTitle}>Featured Reels</h2>
        <div className={styles.showcaseGrid}>
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseImageContainer}>
              <Image 
                src="/micha.jpg" 
                alt="Michael Jordan" 
                width={350} 
                height={500}
                className={styles.showcaseImage}
              />
              <div className={styles.showcaseOverlay}>
                <h3>Michael Jordan</h3>
                <Link href="/reels" className={styles.watchButton}>
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseImageContainer}>
              <Image 
                src="/sere.webp" 
                alt="Serena Williams" 
                width={350} 
                height={500}
                className={styles.showcaseImage}
              />
              <div className={styles.showcaseOverlay}>
                <h3>Serena Williams</h3>
                <Link href="/reels" className={styles.watchButton}>
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseImageContainer}>
              <Image 
                src="/lio.webp" 
                alt="Lionel Messi" 
                width={350} 
                height={500}
                className={styles.showcaseImage}
              />
              <div className={styles.showcaseOverlay}>
                <h3>Lionel Messi</h3>
                <Link href="/reels" className={styles.watchButton}>
                  Watch Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.viewAllContainer}>
          <Link href="/reels" className={styles.viewAllButton}>
            View All Reels
          </Link>
        </div>
      </section>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <h2>Sports Celebrity Reels</h2>
            <p>Powered by AI</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h3>Navigation</h3>
              <Link href="/">Home</Link>
              <Link href="/reels">Reels</Link>
              <a href="#generate">Create</a>
            </div>
            <div className={styles.footerLinkGroup}>
              <h3>Legal</h3>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
            <div className={styles.footerLinkGroup}>
              <h3>Contact</h3>
              <a href="mailto:info@sportscelebrityreels.com">Email Us</a>
              <a href="https://twitter.com/sportsreels" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Sports Celebrity Reels. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}







