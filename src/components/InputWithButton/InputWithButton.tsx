import { IconArrowRight } from '@tabler/icons-react';
import { ActionIcon, TextInput, TextInputProps, useMantineTheme } from '@mantine/core';

export function InputWithButton(props: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      radius="xl"
      size="md"
      placeholder="Type a chat message"
      rightSectionWidth={42}
      rightSection={
        <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      {...props}
    />
  );
}