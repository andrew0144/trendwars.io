import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Button, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import classes from './ButtonCopy.module.css';

export default function ButtonCopy({ lobbyId }: { lobbyId: string }) {
  const clipboard = useClipboard();
  return (
    <Tooltip
      label="Lobby ID copied!"
      offset={5}
      position="bottom"
      radius="xl"
      transitionProps={{ duration: 100, transition: 'slide-down' }}
      opened={clipboard.copied}
    >
      <div className={classes.btnDiv}>
        <Button
          variant="light"
          radius="xl"
          size="sm"
          visibleFrom="md"
          onClick={() => clipboard.copy(lobbyId)}
        >
          {clipboard.copied ? (
            <IconCheck size={20} stroke={1.5} />
          ) : (
            <IconCopy size={20} stroke={1.5} />
          )}
        </Button>
        <Button
          variant="light"
          radius="xl"
          size="xs"
          hiddenFrom="md"
          onClick={() => clipboard.copy(lobbyId)}
        >
          {clipboard.copied ? (
            <IconCheck size={15} stroke={1.5} />
          ) : (
            <IconCopy size={15} stroke={1.5} />
          )}
        </Button>
      </div>
    </Tooltip>
  );
}
