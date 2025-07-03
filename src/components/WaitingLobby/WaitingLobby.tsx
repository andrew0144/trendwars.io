import { useEffect, useState } from 'react';
import { Card, Container, Group, Text, Title } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { Player } from '@/common/Player';
import { ws } from '@/common/socketConfig';
import ButtonCopy from '../ButtonCopy/ButtonCopy';
import Chat from '../Chat/Chat';
import LobbyForm from '../LobbyForm/LobbyForm';
import { PlayersStack } from '../PlayersStack/PlayersStack';
import classes from './WaitingLobby.module.css';

type WaitingLobbyState = {
  players: Player[];
  hasGameStarted: boolean;
  lobbyDoesntExist: boolean;
  playerListShouldShow: boolean;
  firstStartingWord: string;
  results: string;
  round: number;
  messages: string[];
  currentMessage: string;
};

function WaitingLobby({ players }: { players: Player[] }) {
  const [state, setState] = useState<WaitingLobbyState>({
    players: players || [],
    hasGameStarted: false,
    lobbyDoesntExist: false,
    playerListShouldShow: true,
    firstStartingWord: 'N/A',
    results: '',
    round: 1,
    messages: [],
    currentMessage: '',
  });
  const lobbyId = window.location.pathname.split('/').pop() || '';

  useEffect(() => {
    const msg = new Message(MessageType.URL, { data: window.location.href });
    ws.emit('message', msg.toJSON());

    ws.on('message', (json: string) => {
      let message = Message.fromJSON(json);
      console.log(message);

      switch (message.msgType) {
        case 'CHAT':
          if (message.msgData.text === '') {
            return; // Ignore empty messages
          }
          setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message.msgData.text],
          }));
          break;
        case 'GAME_STARTED':
          setState((prevState) => ({
            ...prevState,
            hasGameStarted: true,
            firstStartingWord: message.msgData['firstStartingWord'],
          }));
          break;
        case 'LOBBY_DOESNT_EXIST':
          setState((prevState) => ({
            ...prevState,
            lobbyDoesntExist: true,
          }));
          break;
        case 'RESULTS':
          setState((prevState) => ({
            ...prevState,
            results: message.msgData.scores,
          }));
          break;
        case 'LOBBY_STATE':
          setState((prevState) => ({
            ...prevState,
            round: message.msgData.turnNumber,
            players: message.msgData.players,
          }));
          break;
        case 'PLAYER_STATE':
          console.log('on player state', message.msgData);
          setState((prevState) => ({
            ...prevState,
            players: message.msgData.players,
          }));
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <Container fluid>
      <Group grow justify="center" align="stretch">
        <Card withBorder radius="md" bg="var(--mantine-color-body)" mx="auto" mt="md" mah={450}>
          <Title ta="center" size="xl" maw={650} mx="auto" my="sm" className={classes.title}>
            <Group justify="center" align="center" mb={10}>
              <span>Lobby ID: </span>
              <Text
                inherit
                variant="gradient"
                component="span"
                gradient={{ from: 'pink', to: 'yellow' }}
              >
                {lobbyId}
              </Text>
              <ButtonCopy lobbyId={lobbyId} />
            </Group>
          </Title>
          <LobbyForm />
        </Card>
      </Group>
      <Group grow justify="center" align="stretch" mt={'md'} mb={'sm'} gap={'xs'}>
        <Card withBorder radius="md" bg="var(--mantine-color-body)" mx="auto" mah={400}>
          <PlayersStack players={state.players} />
        </Card>
        <Chat />
      </Group>
    </Container>
  );
}

export default WaitingLobby;
