import ReelContainer from '../../components/ReelContainer';
import styles from './page.module.css';

export const metadata = {
  title: 'Sports Celebrity Reels',
  description: 'Watch AI-generated history reels of sports celebrities',
};

export default function ReelsPage() {
  return (
    <div className={styles.reelsPage}>
      <ReelContainer />
    </div>
  );
}



