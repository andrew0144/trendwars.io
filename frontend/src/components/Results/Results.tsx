import Avatar from 'boring-avatars';
import { Anchor, Card, Divider, Group, ScrollArea, Stack, Table, Text } from '@mantine/core';
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
    <ScrollArea scrollbars="y">
      <Table verticalSpacing="md" visibleFrom="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
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
                    <Text fz="xs" c="dimmed" ta="left">
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
                Round {index + 1}: <b>{round.curWord}</b>
              </Table.Td>
              {sortedPlayers.map((player) => (
                <Table.Td key={player.id}>
                  {round.submissions[player.id] ? (
                    <b>{round.submissions[player.id]}</b>
                  ) : (
                    'No word submitted'
                  )}
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
      <Stack hiddenFrom="xs" justify="center" align="center">
        {gameHistory.map((round, index) => (
          <Card
            withBorder
            radius="md"
            bg="var(--mantine-color-body)"
            w='100%'
            mx="auto"
            key={index}
          >
            <Card.Section>
              <Text fz="lg" fw={500} ta="center" mt="md" mb="xs">
                Round {index + 1}: <b>{round.curWord}</b>
              </Text>
            </Card.Section>
            <Card.Section>
              <Stack justify="center" gap="sm" p="md">
                {sortedPlayers.map((player) => (
                  <>
                    <Group gap="sm" justify="space-between" mx={15}>
                      <Group gap="sm">
                        <Avatar
                          size={25}
                          name={player.username}
                          variant={player.variant ?? 'beam'}
                        />
                        <Text fz="sm" fw={500}>
                          {player.username}
                          {player.id === yourId && ' (You)'}
                        </Text>
                      </Group>
                      <Text key={player.id}>
                        {round.submissions[player.id] ? (
                          <b>{round.submissions[player.id]}</b>
                        ) : (
                          'No word submitted'
                        )}
                      </Text>
                    </Group>
                    <Divider />
                  </>
                ))}
                <Anchor
                  href={getTrendsLink(round)}
                  target="_blank"
                  rel="noopener noreferrer"
                  ta="center"
                >
                  Explore on Google Trends
                </Anchor>
              </Stack>
            </Card.Section>
          </Card>
        ))}
      </Stack>
    </ScrollArea>
  );
}

export default Results;
