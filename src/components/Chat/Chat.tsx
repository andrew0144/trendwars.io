import { Card, ScrollArea, Stack } from '@mantine/core';
import { InputWithButton } from '../InputWithButton/InputWithButton';
import classes from './Chat.module.css';

function Chat() {
  return (
    <Card
      withBorder
      radius="md"
      bg="var(--mantine-color-body)"
      mx="auto"
      mah={400}
    >
        <ScrollArea h={400} scrollbars="y" offsetScrollbars={true}>
      <Stack px={10}>
        <div>Foobar: "This is an example message.an example message.an example message.an example message.an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
        <div>Foobar: "This is an example message."</div>
      </Stack>
              </ScrollArea>
      <InputWithButton mt={30} className={classes.chatInput} />

    </Card>
  );
}

export default Chat;
