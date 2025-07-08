import { IconHelp } from '@tabler/icons-react';
import { ActionIcon, Card, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HowToPlay } from '../HowToPlay/HowToPlay';
import classes from './HelpButton.module.css';

export function HelpButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        radius="lg"
        opened={opened}
        onClose={close}
        title="How To Play"
        size="xl"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        classNames={{
          title: classes['modal-title'],
        }}
      >
        <Card bg="transparent">
          <Text size="md" mb="md">
            Welcome to Trend Wars! This game is all about predicting trends and competing with
            others to see who can come up with the best phrases. Follow these steps to get started:
          </Text>
          <HowToPlay />
        </Card>
      </Modal>
      <Group justify="center">
        <ActionIcon
          onClick={open}
          variant="default"
          size="xl"
          radius="md"
          aria-label="Toggle color scheme"
        >
          <IconHelp className={classes.icon} stroke={1.5} />
        </ActionIcon>
      </Group>
    </>
  );
}
