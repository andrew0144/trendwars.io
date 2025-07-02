import { Group } from '@mantine/core';
import classes from './Header.module.css';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import { Text } from '@mantine/core';

export function Header() {

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }} className={classes.logo}>
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