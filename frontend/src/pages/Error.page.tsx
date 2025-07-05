import { NothingFoundBackground } from '@/components/Error/NothingFoundBackground';
import { Header } from '@/components/Header/Header';
import classes from './Pages.module.css';

export function ErrorPage() {
  return (
    <div className={classes.appContainer}>
      <Header />
      <NothingFoundBackground />
    </div>
  );
}
