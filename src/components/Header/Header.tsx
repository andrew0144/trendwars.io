import { Group, Text } from '@mantine/core';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import classes from './Header.module.css';

export function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: 'pink', to: 'yellow' }}
            className={classes.logo}
          >
            Trend Wars
          </Text>
        </Group>

        <Group>
          <DarkModeToggle />
        </Group>
      </div>
    </header>
  );
}
