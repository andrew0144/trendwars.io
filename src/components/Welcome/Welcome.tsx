import { useEffect, useRef, useState } from 'react';
import Avatar from 'boring-avatars';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Group, Text, TextInput, Title } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { ws } from '@/common/socketConfig';
import classes from './Welcome.module.css';
import { sendCreateLobbyMessage, sendJoinLobbyMessage, sendUsernameMessage } from '@/common/Message/MessageUtils';

export function Welcome() {
  const currentPlayerIdRef = useRef('');
  const navigate = useNavigate();
  const [lobbyID, setLobbyID] = useState('');
  const [yourId, setYourId] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [player, setPlayer] = useState({
    bestWord: '',
    id: 0,
    rank: -1,
    ready: false,
    score: 0,
    username: '',
    wordSubmittedThisTurn: false,
  });

  function rerouteToLobby(data: { lobbyID: any; lobby_state: { players: any; }; }, playerId = currentPlayerIdRef.current || yourId) {
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
      sendUsernameMessage(player.username);
    }
    else {
      setUsernameError(true);
      return;
    }
    if (lobbyID.trim() !== '') {
      sendJoinLobbyMessage(lobbyID);
    }
    else {
      sendCreateLobbyMessage();
    }
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newUsername = event.currentTarget.value;
    setPlayer({ ...player, username: newUsername });
    setUsernameError(newUsername.trim() === '');
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
          setPlayer(message.msgData);
          break;
        case 'LOBBY_JOINED':
          rerouteToLobby(message.msgData, currentPlayerIdRef.current);
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
        Trend Wars is a multiplayer word game inspired by Google Trends, played with 2 to 5 players.
        You will be given a word each round. Come up with a trendy phrase to pair with it. Based on
        Trends data, your phrase will be scored from 0 to 100. The player with the most points after
        5 round wins.
      </Text>

      <Card withBorder radius="md" bg="var(--mantine-color-body)" maw={500} mx="auto" mt="xl">
        <Group justify="space-between" mb={20}>
          <Avatar size={80} name={player.username} variant="beam" className={classes.avatar} />
          <TextInput
            placeholder="Enter your username"
            value={player.username}
            error={usernameError ? 'Username cannot be empty' : ''}
            onChange={handleUsernameChange}
            className={classes.input}
          />
        </Group>
        <Group justify="space-between" mb={20}>
          <Text c="dimmed">Joining a game?</Text>
          <TextInput
            placeholder="Enter the lobby code"
            value={lobbyID}
            onChange={(event) => setLobbyID(event.currentTarget.value)}
            className={classes.input}
          />
        </Group>
        <Button
          mt={10}
          variant="gradient"
          onClick={handleGoClick}
          className={classes.goBtn}
        >
          Go
        </Button>
      </Card>
    </Container>
  );
}
