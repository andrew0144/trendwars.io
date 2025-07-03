import { IconArrowRight } from '@tabler/icons-react';
import { ActionIcon, TextInput, TextInputProps, useMantineTheme } from '@mantine/core';

export interface InputWithButtonProps extends TextInputProps {
    onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function InputWithButton({ onButtonClick, ...props }: InputWithButtonProps) {
    const theme = useMantineTheme();

    return (
        <TextInput
            radius="xl"
            size="md"
            placeholder="Type a chat message"
            rightSectionWidth={42}
            rightSection={
                <ActionIcon
                    size={32}
                    radius="xl"
                    color={theme.primaryColor}
                    variant="filled"
                    onClick={onButtonClick}
                >
                    <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
            }
            {...props}
        />
    );
}