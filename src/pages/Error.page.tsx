import { Header } from '@/components/Header/Header';
import classes from './Pages.module.css';
import { NothingFoundBackground } from '@/components/Error/NothingFoundBackground';

export function ErrorPage() {
  return (
    <div className={classes.appContainer}>
      <Header />
	  <NothingFoundBackground />
    </div>
  );
}
