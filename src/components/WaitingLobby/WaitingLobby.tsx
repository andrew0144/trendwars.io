import { Card, Container, Group, Text, Title } from '@mantine/core';
import ButtonCopy from '../ButtonCopy/ButtonCopy';
import Chat from '../Chat/Chat';
import LobbyForm from '../LobbyForm/LobbyForm';
import { UsersStack } from '../UsersStack/UsersStack';
import classes from './WaitingLobby.module.css';

function WaitingLobby() {
  const lobbyId = window.location.pathname.split('/').pop() || '';

  return (
    <Container fluid>
      <Group grow justify="center" align="stretch" >
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
          <UsersStack />
        </Card>
        <Chat />
      </Group>
    </Container>
  );
}

export default WaitingLobby;
