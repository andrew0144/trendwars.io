import {
  IconCircleCheckFilled,
  IconCircleDashedCheck,
  IconCrown,
  IconLaurelWreath,
  IconLaurelWreath1,
  IconLaurelWreath2,
  IconLaurelWreath3,
} from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { Group, ScrollArea, Stack, Table, Text } from '@mantine/core';
import { Player } from '@/common/Player';
import classes from './PlayersStack.module.css';

export function PlayersStack({
  players,
  yourId,
  hasGameStarted,
  round,
  hasGameEnded,
}: {
  players: Player[];
  yourId: number;
  hasGameStarted: boolean;
  round: number;
  hasGameEnded: boolean;
}) {
  let readyCondition = hasGameStarted
    ? (player: Player) => player.wordSubmittedThisTurn
    : (player: Player) => player.ready;

  function getCardIcon(index: number) {
    switch (index) {
      case 0:
        return <IconLaurelWreath1 size={32} stroke={1.5} />;
      case 1:
        return <IconLaurelWreath2 size={32} stroke={1.5} />;
      case 2:
        return <IconLaurelWreath3 size={32} stroke={1.5} />;

      default:
        return <IconLaurelWreath size={32} stroke={1.5} />;
    }
  }

  const rows = players
    .sort((a, b) => b.score - a.score)
    .map((player, index) => (
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
            <Stack justify="center" gap={0}>
              <Text fz="sm" fw={500}>
                {player.username}
                {player.id === yourId && ' (You)'}
              </Text>
              {hasGameStarted && round > 1 && (
                <Text fz="xs" c="dimmed" ta={'left'}>
                  #{index + 1}
                </Text>
              )}
            </Stack>
          </Group>
        </Table.Td>
        {hasGameStarted && round > 1 && (
          <Table.Td>
            <Text fz="sm" fw={500}>
              {player.score} points (+{player.pointInc})
            </Text>
          </Table.Td>
        )}
        <Table.Td>
          <Group gap={0} justify="flex-end">
            {hasGameEnded ? (
              getCardIcon(index)
            ) : readyCondition(player) ? (
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
