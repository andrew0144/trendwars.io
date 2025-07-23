import { useEffect, useState } from 'react';
import Avatar from 'boring-avatars';
import { Card, Flex, Group, ScrollArea, Text, Title } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { AvatarVariants, Player } from '@/common/Player';
import { ws } from '@/common/socketConfig';
import ButtonCopy from '../ButtonCopy/ButtonCopy';
import Chat, { ChatMessage } from '../Chat/Chat';
import { Footer } from '../Footer/Footer';
import Game from '../Game/Game';
import LobbyForm from '../LobbyForm/LobbyForm';
import { PlayersStack } from '../PlayersStack/PlayersStack';
import Results from '../Results/Results';
import classes from './WaitingLobby.module.css';

type WaitingLobbyState = {
  players: Player[];
  hasGameStarted: boolean;
  lobbyDoesntExist: boolean;
  playerListShouldShow: boolean;
  firstStartingWord: string;
  results: string;
  round: number | 'N/A';
  messages: ChatMessage[];
  maxTurns: number;
  startingWord: string;
  gameHistory: any[]; // Adjust type as needed
  resultsPlayers: Player[];
};

function WaitingLobby({ players, yourId }: { players: Player[]; yourId: number }) {
  const [state, setState] = useState<WaitingLobbyState>({
    players: players || [],
    hasGameStarted: false,
    lobbyDoesntExist: false,
    playerListShouldShow: true,
    firstStartingWord: 'N/A',
    results: '',
    round: 1,
    messages: [
      {
        username: 'System',
        variant: AvatarVariants.SUNSET,
        text: 'Welcome to the chat! Type your message below.',
      },
    ],
    maxTurns: 5,
    startingWord: 'N/A',
    gameHistory: [],
    resultsPlayers: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [statusText, setStatusText] = useState('Waiting for players to join...');
  const [currentTab, setCurrentTab] = useState('main');
  const lobbyId = window.location.pathname.split('/').pop() || '';

  const you = state.players.find((p) => p.id === yourId)!;

  const youRank = state.players.findIndex((p) => p.id === yourId);

  function handleIconClick(tab: string) {
    setCurrentTab(tab);
  }

  function updateStatusText(players: Player[]) {
    if (players.length < 2) {
      setStatusText('Waiting for players to join...');
    } else if (players.every((p) => p.ready)) {
      setStatusText('Waiting for host to start the game...');
    } else {
      setStatusText(`Waiting for players to ready up...`);
    }
  }

  useEffect(() => {
    const msg = new Message(MessageType.URL, { data: window.location.href });
    ws.emit('message', msg.toJSON());

    ws.on('message', (json: string) => {
      const message = Message.fromJSON(json);
      // console.log(message);

      switch (message.msgType) {
        case 'CHAT':
          if (message.msgData.text === '') {
            return;
          }
          setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message.msgData as ChatMessage],
          }));
          break;
        case 'GAME_STARTED':
          setState((prevState) => ({
            ...prevState,
            hasGameStarted: true,
            firstStartingWord: message.msgData.firstStartingWord,
            startingWord: message.msgData.firstStartingWord,
          }));
          updateStatusText(message.msgData.players);
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
            gameHistory: message.msgData.gameHistory || [],
            resultsPlayers: prevState.players.slice(),
          }));
          setShowResults(true);
          break;
        case 'LOBBY_STATE':
          setState((prevState) => ({
            ...prevState,
            round: message.msgData.turnNumber,
            players: message.msgData.players,
            startingWord: message.msgData.startingWord || prevState.startingWord,
          }));
          updateStatusText(message.msgData.players);
          break;
        case 'LOBBY_SETTINGS_UPDATED':
          setState((prevState) => ({
            ...prevState,
            maxTurns: message.msgData.maxTurns || prevState.maxTurns,
          }));
          break;
        default:
          break;
      }
    });
  }, [showResults]);

  return (
    <>
      <Flex direction="column" w="100%" h="100%" px="lg" visibleFrom="xs">
        <Group grow justify="center" align="stretch">
          <Card
            withBorder
            radius="md"
            bg="var(--mantine-color-body)"
            mx="auto"
            mt="xs"
            className={classes.mainCard}
          >
            <Title ta="center" size="xl" maw={650} mx="auto" my="0" className={classes.title}>
              {state.hasGameStarted ? (
                showResults ? (
                  <Group justify="center" align="center" mb={10}>
                    <span>Explore</span>
                    <Text
                      inherit
                      variant="gradient"
                      component="span"
                      gradient={{ from: 'pink', to: 'yellow' }}
                    >
                      Results
                    </Text>
                  </Group>
                ) : (
                  <Group justify="center" align="center">
                    <span>
                      Round {state.round === 'N/A' ? 1 : state.round} of {state.maxTurns}:{' '}
                    </span>
                    <Text
                      inherit
                      variant="gradient"
                      component="span"
                      gradient={{ from: 'pink', to: 'yellow' }}
                    >
                      Fight!
                    </Text>
                  </Group>
                )
              ) : (
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
              )}
            </Title>
            <Text ta="center" inherit component="span">
              {state.hasGameStarted && !showResults ? (
                <Group gap="md" justify="center" align="center" my="lg">
                  <Avatar size={50} name={you.username} variant={you.variant ?? 'beam'} />
                  <Text fz="lg" fw={500}>
                    {you.username}:
                  </Text>
                  <Text fz="lg" fw={500}>
                    {you.score} points{you.score > 0 && ` (+${you.pointInc})`}
                  </Text>
                  {state.hasGameStarted && Number(state.round) > 1 && (
                    <Text fz="lg" c="dimmed">
                      Rank #{youRank + 1}
                    </Text>
                  )}
                </Group>
              ) : (
                !showResults && statusText
              )}
            </Text>
            {state.hasGameStarted ? (
              showResults ? (
                <Results
                  gameHistory={state.gameHistory}
                  players={state.resultsPlayers}
                  yourId={yourId}
                />
              ) : (
                <Game firstWord={state.startingWord} />
              )
            ) : (
              <LobbyForm players={state.players} yourId={yourId} />
            )}
          </Card>
        </Group>
        <Group
          grow
          justify="center"
          align="stretch"
          mt="xs"
          mb="xs"
          gap="xs"
          className={classes.bottomGroup}
        >
          <Card withBorder radius="md" bg="var(--mantine-color-body)" mx="auto" mih={350}>
            <ScrollArea.Autosize h="100%">
              <PlayersStack
                players={state.players}
                yourId={yourId}
                hasGameStarted={state.hasGameStarted}
                round={state.round !== 'N/A' ? state.round : 1}
                hasGameEnded={showResults}
              />
            </ScrollArea.Autosize>
          </Card>
          <Card
            withBorder
            radius="md"
            bg="var(--mantine-color-body)"
            mx="auto"
            mih={350}
            className={classes.chatCard}
          >
            <Chat />
          </Card>
        </Group>
      </Flex>

      <Card
        className={classes.cardMobile}
        display={currentTab !== 'main' ? 'none' : 'flex'}
        style={state.hasGameStarted ? { justifyContent: 'center' } : {}}
        hiddenFrom="xs"
        p="sm"
      >
        <Title ta="center" size="lg" maw="100%" mx="auto" my="0" className={classes.title}>
          {state.hasGameStarted ? (
            showResults ? (
              <Group justify="center" align="center" mb={10} fz={{ base: 30, xxs: 32 }}>
                <span>Explore</span>
                <Text
                  inherit
                  variant="gradient"
                  component="span"
                  gradient={{ from: 'pink', to: 'yellow' }}
                >
                  Results
                </Text>
              </Group>
            ) : (
              <>
                <Group justify="center" align="center" fz={{ base: 30, xxs: 32 }}>
                  <span>
                    Round {state.round === 'N/A' ? 1 : state.round} of {state.maxTurns}:{' '}
                  </span>
                  <Text
                    inherit
                    variant="gradient"
                    component="span"
                    gradient={{ from: 'pink', to: 'yellow' }}
                  >
                    Fight!
                  </Text>
                </Group>
              </>
            )
          ) : (
            <Group justify="center" align="center">
              <span>Lobby ID: </span>
              <Text
                inherit
                variant="gradient"
                component="span"
                gradient={{ from: 'pink', to: 'yellow' }}
                pr={2}
              >
                {lobbyId}
              </Text>
              <ButtonCopy lobbyId={lobbyId} />
            </Group>
          )}
        </Title>
        <Text ta="center" inherit component="span">
          {state.hasGameStarted && !showResults ? (
            <Group gap="md" justify="center" align="center" my="lg">
              <Avatar size={50} name={you.username} variant={you.variant ?? 'beam'} />
              <Text fz="md" fw={500}>
                {you.username}:
              </Text>
              <Text fz="md" fw={500}>
                {you.score} points{you.score > 0 && ` (+${you.pointInc})`}
              </Text>
              {state.hasGameStarted && Number(state.round) > 1 && (
                <Text c="dimmed">Rank #{youRank + 1}</Text>
              )}
            </Group>
          ) : (
            !showResults && statusText
          )}
        </Text>
        {state.hasGameStarted ? (
          showResults ? (
            <Results
              gameHistory={state.gameHistory}
              players={state.resultsPlayers}
              yourId={yourId}
            />
          ) : (
            <Game firstWord={state.startingWord} />
          )
        ) : (
          <LobbyForm players={state.players} yourId={yourId} />
        )}
      </Card>
      <Card
        className={classes.cardMobile}
        display={currentTab !== 'players' ? 'none' : 'flex'}
        hiddenFrom="xs"
        p="sm"
      >
        <ScrollArea.Autosize h="100%">
          <PlayersStack
            players={state.players}
            yourId={yourId}
            hasGameStarted={state.hasGameStarted}
            round={state.round !== 'N/A' ? state.round : 1}
            hasGameEnded={showResults}
          />
        </ScrollArea.Autosize>
      </Card>
      <Card
        className={classes.cardMobile}
        display={currentTab !== 'chat' ? 'none' : 'flex'}
        hiddenFrom="xs"
        p="sm"
      >
        <Chat />
      </Card>

      <Footer
        hasGameStarted={state.hasGameStarted}
        onIconClick={handleIconClick}
        currentTab={currentTab}
      />
    </>
  );
}

export default WaitingLobby;
