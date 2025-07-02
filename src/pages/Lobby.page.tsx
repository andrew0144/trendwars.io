import { Header } from '@/components/Header/Header';
import classes from './Pages.module.css';
import WaitingLobby from '@/components/WaitingLobby/WaitingLobby';

function LobbyPage() {
  return (
    <div className={classes.appContainer}>
      <Header />
      <WaitingLobby />
    </div>
  );
}

export default LobbyPage;
