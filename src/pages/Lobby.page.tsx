import { Header } from '@/components/Header/Header';
import WaitingLobby from '@/components/WaitingLobby/WaitingLobby';
import classes from './Pages.module.css';

function LobbyPage() {
  return (
    <div className={classes.appContainer}>
      <Header />
      <WaitingLobby />
    </div>
  );
}

export default LobbyPage;
