import { useState } from 'react';
import Avatar from 'boring-avatars';
import { Anchor, Card, Container, Group, Text, TextInput, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  const [player, setPlayer] = useState({
    bestWord: '',
    id: 0,
    rank: -1,
    ready: false,
    score: 0,
    username: '',
    wordSubmittedThisTurn: false,
  });

  return (
    <Container fluid>
      <Title className={classes.title} ta="center" mt={20}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Trend Wars
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={650} mx="auto" mt="xl">
        Trend Wars is a multiplayer word game inspired by Google Trends played with 2 to 5 players.
        You will be given a word each round. Come up with a trendy phrase to pair with it. Based on
        Trends data, your phrase will be scored from 0 to 100. The player with the most points after
        5 round wins.
      </Text>

      <Card withBorder radius="md" bg="var(--mantine-color-body)" maw={500} mx="auto" mt="xl">
        <Group justify="center">
          <Avatar size={80} name={player.username} variant="beam" />
          <TextInput
            placeholder="Enter your username"
            value={player.username}
            onChange={(event) => setPlayer({ ...player, username: event.currentTarget.value })}
            className={classes.input}
          />
        </Group>
      </Card>
    </Container>
  );
}
