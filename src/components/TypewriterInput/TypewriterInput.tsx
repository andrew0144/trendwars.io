import React, { useEffect, useRef, useState } from 'react';
import { Paper, TextInput, TextInputProps } from '@mantine/core';
import classes from './TypewriterInput.module.css';

interface TypewriterInputProps
  extends Omit<TextInputProps, 'onChange' | 'onFocus' | 'onBlur' | 'ref'> {
  firstWord?: string;
  onValueChange?: (value: string) => void;
}

export const TypewriterInput: React.FC<TypewriterInputProps> = ({
  firstWord = 'Hello',
  onValueChange,
  placeholder = 'continue typing...',
  size = 'md',
  variant = 'unstyled',
  ...textInputProps
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when firstWord changes
  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    setUserInput('');
  }, [firstWord]);

  // Typewriter effect for the first word
  useEffect(() => {
    if (displayedText.length < firstWord.length) {
      const timer = setTimeout(() => {
        setDisplayedText(firstWord.slice(0, displayedText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(() => {
        setIsTypingComplete(true);
      }, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [displayedText, firstWord]);

  const handleContainerClick = (): void => {
    if (isTypingComplete && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserInput(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && userInput === '' && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  return (
    <>
      <Paper
        ref={containerRef}
        onClick={handleContainerClick}
        className={classes.typewriterContainer}
        p={0}
        radius="md"
        withBorder
      >
        <div className={classes.typewriterContent}>
          <span className={classes.typewriterFirstWord}>
            {displayedText}
            {!isTypingComplete && <span className={classes.typewriterCursor}>|</span>}
          </span>

          <TextInput
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isTypingComplete ? placeholder : ''}
            className={classes.typewriterInput}
            variant={variant}
            size={size}
            autoFocus={isTypingComplete}
            disabled={!isTypingComplete}
            style={{
              opacity: isTypingComplete ? 1 : 0,
              pointerEvents: isTypingComplete ? 'auto' : 'none',
            }}
            {...textInputProps}
          />
        </div>

        <div
          className={classes.typewriterLabel}
          style={{
            top: isFocused || displayedText || userInput ? '-8px' : '16px',
            fontSize: isFocused || displayedText || userInput ? '12px' : '16px',
          }}
        >
          Current Phrase
        </div>
      </Paper>
    </>
  );
};
