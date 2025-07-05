import { useEffect, useRef, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  SegmentedControl,
  Text,
  TextInput,
  Title,
  Transition,
} from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import {
  sendCreateLobbyMessage,
  sendJoinLobbyMessage,
  sendPlayerUpdateMessage,
} from '@/common/Message/MessageUtils';
import { AvatarVariants, Player } from '@/common/Player';
import { ws } from '@/common/socketConfig';
import classes from './Welcome.module.css';

export function Welcome() {
  const currentPlayerIdRef = useRef('');
  const navigate = useNavigate();
  const [lobbyID, setLobbyID] = useState('');
  const [yourId, setYourId] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [lobbyCodeError, setLobbyCodeError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [player, setPlayer] = useState<Player>({
    bestWord: '',
    id: 0,
    rank: -1,
    ready: false,
    score: 0,
    username: '',
    wordSubmittedThisTurn: false,
    variant: AvatarVariants.BEAM,
    host: false,
    pointInc: 0,
  });

  function rerouteToLobby(
    data: { lobbyID: any; lobby_state: { players: Player[] } },
    playerId = currentPlayerIdRef.current || yourId
  ) {
    navigate(`/lobby/${data.lobbyID}`, {
      replace: true,
      state: {
        players: data.lobby_state.players,
        yourId: playerId,
        lobbyID: data.lobbyID,
      },
    });
  }

  function handleGoClick() {
    if (player.username.trim() !== '') {
      sendPlayerUpdateMessage(player.username, player.variant);
    } else {
      setUsernameError(true);
      return;
    }
    if (lobbyID.trim() !== '') {
      sendJoinLobbyMessage(lobbyID);
    } else {
      sendCreateLobbyMessage();
    }
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newUsername = event.currentTarget.value;
    setPlayer({ ...player, username: newUsername });
    setUsernameError(newUsername.trim() === '');
  }

  function handleLobbyCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newLobbyID = event.currentTarget.value;
    setLobbyID(newLobbyID);
    setLobbyCodeError(false);
  }

  function handleLobbyError() {
    setShowAlert(true);
    setLobbyCodeError(true);
  }

  useEffect(() => {
    const msg = new Message(MessageType.URL, { data: window.location.href });
    ws.emit('message', msg.toJSON());

    ws.on('message', (json: string) => {
      let message = Message.fromJSON(json);
      console.log(message);
      switch (message.msgType) {
        case 'PLAYER_ID':
          currentPlayerIdRef.current = message.msgData.your_id;
          setYourId(message.msgData.your_id);
          break;
        case 'LOBBY_CREATED':
          rerouteToLobby(message.msgData, currentPlayerIdRef.current);
          break;
        case 'PLAYER_STATE':
          setLoaded(true);
          setPlayer((prev) => ({ ...prev, ...message.msgData }));
          break;
        case 'LOBBY_JOINED':
          rerouteToLobby(message.msgData, currentPlayerIdRef.current);
          break;
        case 'LOBBY_FULL':
          handleLobbyError();
          break;
        case 'LOBBY_DOESNT_EXIST':
          handleLobbyError();
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <Container fluid>
      <Title className={classes.title} ta="center" mt={20}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Trend Wars
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={650} mx="auto" mt="xl">
        Trend Wars is a 2 to 5 player word game inspired by Google Trends. You will be given a word
        each round. Come up with a trendy phrase to pair with it. Based on Trends data, your phrase
        will be scored from 0 to 100. After 5 rounds, the player with the most points wins.
      </Text>

      <Card withBorder radius="md" bg="var(--mantine-color-body)" maw={500} mx="auto" mt="xl">
        <Group justify="space-between" mb={20}>
          <Avatar
            size={100}
            name={player.username}
            variant={player.variant}
            className={classes.avatar}
          />
          <TextInput
            size="md"
            variant="filled"
            placeholder="Enter your username"
            value={player.username}
            error={usernameError ? 'Username cannot be empty' : ''}
            onChange={handleUsernameChange}
            onKeyDown={handleGoClick}
            className={classes.input}
            maxLength={21}
          />
        </Group>
        <Group justify="space-between" mb={20}>
          <Text c="dimmed">Change your look</Text>
          <SegmentedControl
            size="md"
            className={classes.input}
            data={['beam', 'marble', 'ring', 'bauhaus']}
            value={player.variant}
            onChange={(value) => setPlayer((prev) => ({ ...prev, variant: value }) as Player)}
          />
        </Group>
        <Group justify="space-between" mb={20}>
          <Text c="dimmed">Joining a game?</Text>
          <TextInput
            size="md"
            placeholder="Enter the lobby code"
            value={lobbyID}
            variant="filled"
            onChange={handleLobbyCodeChange}
            className={classes.input}
            error={lobbyCodeError ? 'Invalid lobby code' : ''}
            maxLength={6}
          />
        </Group>
        <Button mt={10} variant="gradient" onClick={handleGoClick} onTouchStart={handleGoClick} className={classes.goBtn}>
          Go
        </Button>
      </Card>

      <Transition
        mounted={showAlert}
        transition="slide-down"
        duration={150}
        timingFunction="ease-out"
        keepMounted
      >
        {(styles) => (
          <Alert
            withCloseButton
            className={classes.alert}
            style={styles}
            icon={<IconInfoCircle size={16} />}
            title="Cannot Join Lobby"
            color="red"
            onClose={() => setShowAlert(false)}
          >
            The lobby you are trying to join is either full or does not exist. Create your own lobby
            instead!
          </Alert>
        )}
      </Transition>
    </Container>
  );
}
