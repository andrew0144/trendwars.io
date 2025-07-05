import { useEffect, useState } from 'react';
import {
  Button,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import Message from '@/common/Message/Message';
import {
  sendLobbySettings,
  sendReadyMessage,
  sendStartGameMessage,
} from '@/common/Message/MessageUtils';
import { Player } from '@/common/Player';
import { ws } from '@/common/socketConfig';

function LobbyForm({ players, yourId }: { players: Player[]; yourId: number }) {
  const [settings, setSettings] = useState({
    rounds: 5,
    turnTimer: 'Off',
    wordGeneration: 'Random',
  });

  const handleConfirmSettings = () => {
    const maxTurns = settings.rounds;
    const timeLimit = settings.turnTimer === 'Off' ? -1 : Number(settings.turnTimer);
    const wordGeneration = settings.wordGeneration === "Player's choice" ? 'chosen' : 'default';
    const lobbySettings = {
      maxTurns,
      timeLimit,
      wordGeneration,
    };
    console.log('lobbySettings', lobbySettings);
    sendLobbySettings(lobbySettings);
  };

  const handleStartGame = () => {
    sendStartGameMessage();
  };

  const isHost = players.some((p) => p.id === yourId && p.host);
  const isReady = players.some((p) => p.id === yourId && p.ready);
  const canStartGame = isHost && players.length > 1 && players.every((p) => p.ready);

  useEffect(() => {
    ws.on('message', (json: string) => {
      let message = Message.fromJSON(json);
      console.log(message);

      if (message.msgType === 'LOBBY_SETTINGS_UPDATED') {
        const updatedSettings = message.msgData;
        setSettings({
          rounds: updatedSettings.maxTurns,
          turnTimer: updatedSettings.timeLimit === -1 ? 'Off' : String(updatedSettings.timeLimit),
          wordGeneration:
            updatedSettings.wordGeneration === 'chosen' ? "Player's choice" : 'Random',
        });
      }
    });
  }, []);

  return (
    <Stack maw={600} mx="auto" my={0} w={'100%'} gap={'sm'}>
      <Tooltip.Floating
        label="Only the host can change these settings"
        disabled={isHost}
        offset={15}
      >
        <Fieldset
          legend="Lobby Settings"
          disabled={!isHost}
          w={'100%'}
          style={isHost ? {} : { cursor: 'not-allowed' }}
          p={'md'}
        >
          <Stack gap="md">
            <Group grow justify="center" align="stretch">
              <Text>Number of Rounds</Text>
              <NumberInput
                placeholder="Enter a number between 1 and 25"
                min={1}
                max={25}
                value={settings.rounds}
                onChange={(value) => setSettings((prev) => ({ ...prev, rounds: Number(value) }))}
              />
            </Group>
            <Group grow justify="center" align="stretch">
              <Text>Turn Timer (seconds)</Text>
              <SegmentedControl
                data={['Off', '10', '30', '60']}
                value={settings.turnTimer}
                onChange={(value) => setSettings((prev) => ({ ...prev, turnTimer: value }))}
              />
            </Group>
            <Group grow justify="center" align="stretch">
              <Text>Word Generation</Text>
              <SegmentedControl
                data={['Random', "Player's choice"]}
                value={settings.wordGeneration}
                onChange={(value) => setSettings((prev) => ({ ...prev, wordGeneration: value }))}
              />
            </Group>
            {isHost && (
              <Group grow justify="center" align="stretch">
                <Button variant="light" color="green" onClick={handleConfirmSettings}>
                  Confirm Settings
                </Button>
              </Group>
            )}
          </Stack>
        </Fieldset>
      </Tooltip.Floating>
      <Group grow justify="center" align="stretch">
        <Button
          variant="gradient"
          gradient={{ to: 'cyan', from: 'violet' }}
          onClick={sendReadyMessage}
          className="fancyBtn"
        >
          {isReady ? 'Unready' : 'Ready Up'}
        </Button>
        {isHost && (
          <Button
            variant="gradient"
            gradient={{ from: 'pink', to: 'yellow' }}
            disabled={!canStartGame}
            onClick={handleStartGame}
            className="fancierBtn"
          >
            Start Game
          </Button>
        )}
      </Group>
    </Stack>
  );
}

export default LobbyForm;
