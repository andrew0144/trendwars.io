import {
  IconCircleDashedCheck,
  IconCircleCheckFilled,
} from '@tabler/icons-react';
import { ActionIcon, Group, Menu, ScrollArea, Table, Text } from '@mantine/core';
import classes from './UsersStack.module.css';
import Avatar from 'boring-avatars';

const data = [
  {
    name: 'Robert Wolfkisser',
    ready: true,
  },
  {
    name: 'Jill Jailbreaker',
    ready: false,
  },
  {
    name: 'Henry Silkeater',
    ready: false,
  },
  {
    name: 'Bill Horsefighter',
    ready: false,
  },
  {
    name: 'Jeremy Footviewer',
    ready: false
},
];

export function UsersStack() {
  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
            <Avatar size={40} name={item.name} variant="beam" className={classes.avatar} />
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
            {item.ready ? (
              <IconCircleCheckFilled size={32} stroke={1.5} />
            ) : (
              <IconCircleDashedCheck size={32} stroke={1.5} />
            )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={400} scrollbars='y' offsetScrollbars={true}>
      <Table>
        <Table verticalSpacing="md">
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table>
    </ScrollArea>
  );
}
