import { useEffect, useRef, useState } from 'react';
import Avatar from 'boring-avatars';
import { Group, ScrollArea, Stack } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { AvatarVariants } from '@/common/Player';
import { ws } from '@/common/socketConfig';
import { InputWithButton } from '../InputWithButton/InputWithButton';
import classes from './Chat.module.css';

type ChatMessage = {
  username: string;
  variant: AvatarVariants;
  text: string;
};

function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{
    messages: ChatMessage[];
    currentMessage: string;
  }>({
    messages: [
      {
        username: 'System',
        variant: AvatarVariants.SUNSET,
        text: 'Welcome to the chat! Type your message below.',
      },
    ],
    currentMessage: '',
  });

  const scrollToBottom = () => {
    if (viewportRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            messages: [...prevState.messages, message.msgData as ChatMessage],
          }));
          // Use setTimeout to ensure the message is rendered before scrolling
          setTimeout(() => {
            scrollToBottom();
          }, 0);
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <>
      <ScrollArea h={400} scrollbars="y" offsetScrollbars={true} viewportRef={viewportRef}>
        <Stack px={10}>
          {state.messages.map((msg, index) => (
            <Group gap={5} key={index}>
              {msg.username !== 'System' && (
                <Avatar
                  size={20}
                  name={msg.username}
                  variant={msg.variant}
                  className={classes.avatar}
                />
              )}
              {msg.username !== 'System' ? `${msg.username}: ${msg.text}` : `${msg.text}`}
            </Group>
          ))}
          <div ref={messagesEndRef} />
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
    </>
  );
}

export default Chat;
