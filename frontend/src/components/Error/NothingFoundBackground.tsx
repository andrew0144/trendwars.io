import { useNavigate, useRouteError } from 'react-router-dom';
import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NothingFoundBackground.module.css';

export function NothingFoundBackground() {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  function rerouteToHome() {
    navigate('/');
  }

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Gosh Darn It</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            The lobby you tried reaching does not exist. Maybe the game already ended?
          </Text>
          <Group justify="center">
            <Button size="md" onClick={rerouteToHome}>
              Get me out of here!
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
