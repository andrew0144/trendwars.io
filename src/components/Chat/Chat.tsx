import { useEffect, useState } from 'react';
import { IconMessageSearch } from '@tabler/icons-react';
import { Card, ScrollArea, Stack } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { ws } from '@/common/socketConfig';
import { InputWithButton } from '../InputWithButton/InputWithButton';
import classes from './Chat.module.css';

function Chat() {
  const [state, setState] = useState({
    messages: ['Welcome to the chat! Type your message below.'],
    currentMessage: '',
  });

  useEffect(() => {
    ws.on('message', (json: string) => {
      const message = Message.fromJSON(json);
      console.log(message);

      switch (message.msgType) {
        case MessageType.CHAT:
          if (message.msgData.text === '') {
            return;
          }
          setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message.msgData.text],
          }));
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <Card withBorder radius="md" bg="var(--mantine-color-body)" mx="auto" mah={400}>
      <ScrollArea h={400} scrollbars="y" offsetScrollbars={true}>
        <Stack px={10}>
          {state.messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </Stack>
      </ScrollArea>
      <InputWithButton
        mt={30}
        className={classes.chatInput}
        onKeyDown={(e) => {
          if (state.currentMessage.trim() === '') {
            return; // Ignore empty messages
          }
          if (e.key === 'Enter') {
            const msg = new Message(MessageType.CHAT, {
              text: state.currentMessage,
            });
            ws.emit('message', msg.toJSON());
            setState((prevState) => ({
              ...prevState,
              currentMessage: '',
            }));
          }
        }}
        onChange={(e) => {
          setState((prevState) => ({
            ...prevState,
            currentMessage: e.target.value,
          }));
        }}
        onButtonClick={(e) => {
          if (state.currentMessage.trim() === '') {
            return; // Ignore empty messages
          }
          const msg = new Message(MessageType.CHAT, {
            text: state.currentMessage,
          });
          ws.emit('message', msg.toJSON());
          setState((prevState) => ({
            ...prevState,
            currentMessage: '',
          }));
        }}
        value={state.currentMessage}
      />
    </Card>
  );
}

export default Chat;
