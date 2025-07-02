import {
  Button,
  Grid,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  Text,
} from '@mantine/core';

function LobbyForm() {
  return (
    <Stack maw={600} mx="auto" mt="xs" mb={'xs'} w={'100%'}>
      <Group grow justify="center" align="stretch">
        <Text>Number of Rounds</Text>
        <NumberInput
          placeholder="Enter a number between 1 and 50"
          min={1}
          max={50}
          defaultValue={5}
        />
      </Group>
      <Group grow justify="center" align="stretch">
        <Text>Turn Timer (seconds)</Text>
        <SegmentedControl data={['Off', '10', '30', '60']} defaultValue="Off" />
      </Group>
      <Group grow justify="center" align="stretch">
        <Text>Word Generation</Text>
        <SegmentedControl data={['Random', "Player's choice"]} defaultValue="Random" />
      </Group>
      <Group grow justify="center" align="stretch">
        <Button variant="light" color="green">
          Confirm Settings
        </Button>
      </Group>
      <Group grow justify="center" align="stretch">
        <Button variant="gradient" gradient={{ to: 'cyan', from: 'violet' }}>
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
