import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import WaitingLobby from '@/components/WaitingLobby/WaitingLobby';
import classes from './Pages.module.css';

function LobbyPage() {
  const location = useLocation();
  const players = location.state?.players || [];
  const yourId = location.state?.yourId || '';

  return (
    <div className={classes.appContainer}>
      <Header />
      <WaitingLobby players={players} yourId={yourId} />
    </div>
  );
}

export default LobbyPage;
