import { Anchor, Group } from '@mantine/core';
import { DarkModeToggle } from '../DarkModeToggle/DarkModeToggle';
import classes from './Header.module.css';
import { HelpButton } from '../HelpButton/HelpButton';

export function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Anchor
            href={import.meta.env.BASE_URL}
            underline="never"
            inherit
            variant="gradient"
            gradient={{ from: 'pink', to: 'yellow' }}
            className={classes.logo}
          >
            Trend Wars
          </Anchor>
        </Group>

        <Group gap={'sm'}>
          <HelpButton />
          <DarkModeToggle />
        </Group>
      </div>
    </header>
  );
}
