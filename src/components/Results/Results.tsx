import { IconCrown } from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { Anchor, Group, ScrollArea, Stack, Table, TableTr, Text } from '@mantine/core';
import { Player } from '@/common/Player';

function Results({
  gameHistory,
  players,
  yourId,
}: {
  gameHistory: any[];
  players: Player[];
  yourId: number;
}) {
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  function getTrendsLink(round: any) {
    let roundsQuery = '';
    for (const submission of Object.values(round.submissions)) {
      if (submission) {
        roundsQuery += `${round.curWord}%20${submission},`;
      }
    }
    return `https://trends.google.com/trends/explore?date=now%207-d&geo=US&q=${roundsQuery}&hl=en`;
  }

  return (
    <ScrollArea scrollbars="y" offsetScrollbars={true}>
      <Table verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            {sortedPlayers.map((player, index) => (
              <Table.Th key={player.id}>
                <Group gap="sm">
                  <Stack justify="center" align="center" gap={0}>
                    <Avatar size={37} name={player.username} variant={player.variant ?? 'beam'} />
                  </Stack>
                  <Stack justify="center" gap={0}>
                    <Text fz="sm" fw={500}>
                      {player.username}
                      {player.id === yourId && ' (You)'}
                    </Text>
                    <Text fz="xs" c="dimmed" ta={'left'}>
                      #{index + 1}
                    </Text>
                  </Stack>
                </Group>
              </Table.Th>
            ))}
            <Table.Th>Google Trends Link</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {gameHistory.map((round, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                Round {index + 1}: "{round.curWord}"
              </Table.Td>
              {sortedPlayers.map((player) => (
                <Table.Td key={player.id}>
                  {round.submissions[player.id]
                    ? round.submissions[player.id]
                    : 'No word submitted'}
                </Table.Td>
              ))}
              <Table.Td>
                <Anchor href={getTrendsLink(round)} target="_blank" rel="noopener noreferrer">
                  Explore on Google Trends
                </Anchor>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export default Results;
