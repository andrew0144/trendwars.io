import { use, useEffect, useState } from 'react';
import { Button, Group, NumberInput, SegmentedControl, Stack, Text, Tooltip } from '@mantine/core';
import Message from '@/common/Message/Message';
import { sendLobbySettings, sendReadyMessage } from '@/common/Message/MessageUtils';
import { ws } from '@/common/socketConfig';

function LobbyForm() {
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
    <Stack maw={600} mx="auto" mt="xs" mb={'xs'} w={'100%'}>
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
      <Group grow justify="center" align="stretch">
        <Button variant="light" color="green" onClick={handleConfirmSettings}>
          Confirm Settings
        </Button>
      </Group>
      <Group grow justify="center" align="stretch">
        <Button
          variant="gradient"
          gradient={{ to: 'cyan', from: 'violet' }}
          onClick={sendReadyMessage}
        >
          Ready Up
        </Button>
        <Button variant="gradient" gradient={{ from: 'pink', to: 'yellow' }} disabled={true}>
          Start Game
        </Button>
      </Group>
    </Stack>
  );
}

export default LobbyForm;
