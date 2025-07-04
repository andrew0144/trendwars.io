import React, { useEffect, useRef, useState } from 'react';
import { Paper, TextInput, TextInputProps } from '@mantine/core';

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
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .typewriter-cursor {
          animation: blink 1s infinite;
        }
        
        .typewriter-container {
          position: relative;
          cursor: text;
        }
        
        .typewriter-content {
          display: flex;
          align-items: center;
          min-height: 40px;
          padding: 10px 16px;
        }
        
        .typewriter-first-word {
          color: var(--mantine-color-text);
          font-weight: 500;
          user-select: none;
          display: flex;
          align-items: center;
        }
        
        .typewriter-input {
          flex: 1;
          outline: none;
          background-color: transparent !important;
          border: none !important;
          min-width: 100px;
          padding: 0 !important;
          margin-left: 8px;
        }
        
        .typewriter-input input {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          outline: none !important;
        }
        
        .typewriter-label {
          position: absolute;
          left: 16px;
          top: ${isFocused || displayedText || userInput ? '-8px' : '16px'};
          font-size: ${isFocused || displayedText || userInput ? '12px' : '16px'};
          background-color: var(--mantine-color-body);
          padding: 0 4px;
          color: var(--mantine-color-dimmed);
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <Paper
        ref={containerRef}
        onClick={handleContainerClick}
        className="typewriter-container"
        p={0}
        radius="md"
        withBorder
      >
        <div className="typewriter-content">
          <span className="typewriter-first-word">
            {displayedText}
            {!isTypingComplete && <span className="typewriter-cursor">|</span>}
          </span>

          <TextInput
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isTypingComplete ? placeholder : ''}
            className="typewriter-input"
            variant={variant}
            size={size}
            autoFocus={isTypingComplete}
            disabled={!isTypingComplete}
            style={{ 
              opacity: isTypingComplete ? 1 : 0,
              pointerEvents: isTypingComplete ? 'auto' : 'none'
            }}
            {...textInputProps}
          />
        </div>

        <div className="typewriter-label">Current Phrase</div>
      </Paper>
    </>
  );
};
