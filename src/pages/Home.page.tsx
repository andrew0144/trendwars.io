import { Header } from '@/components/Header/Header';
import { Welcome } from '../components/Welcome/Welcome';
import classes from './Pages.module.css';

export function HomePage() {
  return (
    <div className={classes.appContainer}>
      <Header />
      <Welcome />
    </div>
  );
}
