import { IconCircleCheckFilled, IconCircleDashedCheck } from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { ActionIcon, Group, Menu, ScrollArea, Table, Text } from '@mantine/core';
import { Player } from '@/common/Player';
import classes from './PlayersStack.module.css';

export function PlayersStack({ players, yourId }: { players: Player[]; yourId: number }) {
  console.log(yourId);

  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} name={player.username} variant={player.variant ?? 'beam'} className={classes.avatar} />
          <div>
            <Text fz="sm" fw={500}>
              {player.username}
              {player.id === yourId && ' (You)'}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          {player.ready ? (
            <IconCircleCheckFilled size={32} stroke={1.5} />
          ) : (
            <IconCircleDashedCheck size={32} stroke={1.5} />
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={400} scrollbars="y" offsetScrollbars={true}>
      <Table verticalSpacing="md">
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
