import { useEffect, useState } from 'react';
import { Button, Stack } from '@mantine/core';
import Message from '@/common/Message/Message';
import MessageType from '@/common/Message/MessageType';
import { ws } from '@/common/socketConfig';
import { TypewriterInput } from '../TypewriterInput/TypewriterInput';

function Game({ firstWord = 'Hello' }: { firstWord?: string }) {
  const [word, setWord] = useState<string>('');
  const [wordDisabled, setWordDisabled] = useState<boolean>(false);
  const [duplicateError, setDuplicateError] = useState<boolean>(false);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Reset duplicate error when typing
    setDuplicateError(false);
    if (event.key === 'Enter') {
      // Handle the Enter key press, e.g., submit the input or start the game
      setWordDisabled(true);
      submitWord();
    }
  }

  function submitWord() {
    if (word.trim() === '') {
      setWord('');
      return;
    }
    setWordDisabled(true);
    const msg = new Message(MessageType.SUBMIT_WORD, {
      data: '',
      word: word.trim(),
    });
    ws.emit('message', msg.toJSON());
  }

  useEffect(() => {
    console.log('first word changed');
    setWordDisabled(false);
    setWord('');
  }, [firstWord]);

  useEffect(() => {
    ws.on('message', (json: string) => {
      const message = Message.fromJSON(json);
      console.log(message);
      switch (message.msgType) {
        case MessageType.DUPLICATE_WORD:
          setDuplicateError(true);
          setWordDisabled(false);
          break;
        default:
          break;
      }
    });

    return () => {
      ws.off('message');
    };
  }, []);

  return (
    <Stack maw={600} mx="auto" my="sm" w="100%" gap="sm">
      <TypewriterInput
        firstWord={firstWord}
        onKeyDown={handleKeyDown}
        onValueChange={setWord}
        value={word}
        disabled={wordDisabled}
        error={duplicateError ? 'This word has already been submitted!' : ''}
      />
      <Button
        variant="gradient"
        gradient={{ to: 'cyan', from: 'violet' }}
        onClick={submitWord}
        disabled={wordDisabled}
        className="fancyBtn"
      >
        Submit Word
      </Button>
    </Stack>
  );
}

export default Game;
