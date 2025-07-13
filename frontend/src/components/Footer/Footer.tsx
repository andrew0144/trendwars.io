import { IconDeviceGamepad, IconList, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer({
  hasGameStarted,
  onIconClick,
  currentTab,
}: {
  hasGameStarted: boolean;
  onIconClick: (tab: string) => void;
  currentTab: string;
}) {
  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group gap="xs" justify="space-between" wrap="nowrap">
          <ActionIcon
            size="input-lg"
            variant={currentTab === 'main' ? 'light' : 'subtle'}
            radius="xl"
            onClick={() => onIconClick('main')}
            className={currentTab === 'main' ? classes.active : ''}
          >
            {hasGameStarted ? (
              <IconDeviceGamepad size={25} stroke={1.5} />
            ) : (
              <IconSettings size={25} stroke={1.5} />
            )}
          </ActionIcon>
          <ActionIcon
            size="input-lg"
            variant={currentTab === 'players' ? 'light' : 'subtle'}
            radius="xl"
            onClick={() => onIconClick('players')}
            className={currentTab === 'players' ? classes.active : ''}
          >
            <IconList size={25} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="input-lg"
            variant={currentTab === 'chat' ? 'light' : 'subtle'}
            radius="xl"
            onClick={() => onIconClick('chat')}
            className={currentTab === 'chat' ? classes.active : ''}
          >
            <IconMessageCircle size={25} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
