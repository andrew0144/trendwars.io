import { IconCircleCheckFilled, IconCircleDashedCheck, IconCrown } from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { ActionIcon, Group, Menu, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { Player } from '@/common/Player';
import classes from './PlayersStack.module.css';

export function PlayersStack({
  players,
  yourId,
  hasGameStarted,
}: {
  players: Player[];
  yourId: number;
  hasGameStarted: boolean;
}) {
  let readyCondition = hasGameStarted
    ? (player: Player) => player.wordSubmittedThisTurn
    : (player: Player) => player.ready;

  const rows = players.map((player) => (
    <Table.Tr key={player.id}>
      <Table.Td>
        <Group gap="sm">
          <Stack justify="center" align="center" gap={0}>
            {player.host && <IconCrown size={16} stroke={1.5} />}
            <Avatar
              size={37}
              name={player.username}
              variant={player.variant ?? 'beam'}
              className={classes.avatar}
            />
          </Stack>
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
          {readyCondition(player) ? (
            <IconCircleCheckFilled size={32} stroke={1.5} />
          ) : (
            <IconCircleDashedCheck size={32} stroke={1.5} />
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea scrollbars="y" offsetScrollbars={true}>
      <Table verticalSpacing="md">
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
