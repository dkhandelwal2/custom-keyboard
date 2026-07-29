'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Keyboard } from './Keyboard';
import { LayoutToggle } from './LayoutToggle';
import { DisplayScreen } from './DisplayScreen';
import { transliterate } from '../utils/transliterate';
import type { Keyboard3DProps, LayoutType } from '../types/types';
import styles from './Keyboard3D.module.css';

/**
 * Safely removes the last user-perceived character (grapheme cluster).
 * Essential for emojis so they aren't split into broken surrogate pairs.
 */
function safeBackspace(str: string): string {
  if (!str) return '';
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(str));
    segments.pop();
    return segments.map(s => s.segment).join('');
  } catch {
    // Fallback for environments without Intl.Segmenter
    const chars = Array.from(str);
    chars.pop();
    return chars.join('');
  }
}

export function Keyboard3D({
  className,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onKeyPress,
  layout: controlledLayout,
  defaultLayout = 'qwerty',
  onLayoutChange,
  showDisplayScreen = true,
  showLayoutToggle = true,
  showHeader = true,
  showFooter = true,
  headerTitle = 'KeyBoard',
  headerTitleAccent = ' 3D',
  headerSubtitle = 'Interactive · Animated · Immersive',
  footerText = 'Made with ❤️ in India.',
  enableSound,
  defaultEnableSound = true,
  onSoundToggle,
}: Keyboard3DProps) {
  // Internal uncontrolled state
  const [internalLayout, setInternalLayout] = useState<LayoutType>(defaultLayout);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalEnableSound, setInternalEnableSound] = useState(defaultEnableSound);

  const [isCaps, setIsCaps] = useState(false);
  const [isShifted, setIsShifted] = useState(false);

  // Buffer to track the English word currently being typed in phonetic layout
  const [phoneticBuffer, setPhoneticBuffer] = useState('');

  const isControlledValue = controlledValue !== undefined;
  const isControlledLayout = controlledLayout !== undefined;
  const isControlledSound = enableSound !== undefined;

  const currentLayout = isControlledLayout ? controlledLayout : internalLayout;
  const currentValue = isControlledValue ? controlledValue : internalValue;
  const currentEnableSound = isControlledSound ? enableSound : internalEnableSound;

  const stateRef = useRef({
    currentValue,
    currentLayout,
    phoneticBuffer,
    isCaps,
    isShifted,
    isControlledValue,
    onChange,
    onKeyPress
  });

  useEffect(() => {
    stateRef.current = {
      currentValue,
      currentLayout,
      phoneticBuffer,
      isCaps,
      isShifted,
      isControlledValue,
      onChange,
      onKeyPress
    };
  });

  // isUpperCase: Caps XOR Shift (mirrors real keyboard behaviour)
  const isUpperCase = isCaps !== isShifted;

  const handleKeyPress = useCallback((key: string) => {
    const {
      currentValue,
      currentLayout,
      phoneticBuffer,
      isCaps,
      isShifted,
      isControlledValue,
      onChange,
      onKeyPress
    } = stateRef.current;

    onKeyPress?.(key);

    // ── Modifier keys ────────────────────────────────────────
    if (key === 'Caps') {
      setIsCaps((prev) => !prev);
      return;
    }
    if (key === 'Shift' || key === '⇧') {
      setIsShifted((prev) => !prev);
      return;
    }

    let newValue = currentValue;

    // ── Utility keys ─────────────────────────────────────────
    if (currentLayout === 'phonetic-hindi') {
      if (key === 'Backspace' || key === '⌫') {
        newValue = safeBackspace(currentValue);
        setPhoneticBuffer(prev => safeBackspace(prev));
      } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        const upper = isCaps !== isShifted;
        const char = upper ? key.toUpperCase() : key.toLowerCase();
        newValue = currentValue + char;
        setPhoneticBuffer(prev => prev + char);
        if (isShifted) setIsShifted(false);
      } else {
        // Space, Enter, or non-letters commit the word and trigger transliteration
        const wordToConvert = phoneticBuffer;
        setPhoneticBuffer('');

        let appendChar = key;
        if (key === 'Enter' || key === '⏎') appendChar = '\n';
        else if (key === 'Space' || key === '') appendChar = ' ';
        else if (key === 'Tab' || key === '⇥') appendChar = '  ';

        newValue = currentValue + appendChar;
        if (isShifted && key.length === 1) setIsShifted(false);

        // Async Transliteration
        if (wordToConvert.length > 0) {
          transliterate(wordToConvert).then(hindiWord => {
            if (hindiWord !== wordToConvert) {
              const currentLatest = stateRef.current.currentValue;
              const lastIndex = currentLatest.lastIndexOf(wordToConvert);
              if (lastIndex !== -1) {
                const nextValue = currentLatest.slice(0, lastIndex) + hindiWord + currentLatest.slice(lastIndex + wordToConvert.length);
                if (!stateRef.current.isControlledValue) {
                  setInternalValue(nextValue);
                }
                stateRef.current.onChange?.(nextValue);
              }
            }
          });
        }
      }
    } else {
      // ── Standard Key Handling ────────────────────────────────
      if (key === 'Backspace' || key === '⌫') {
        newValue = safeBackspace(currentValue);
      } else if (key === 'Enter' || key === '⏎') {
        newValue = currentValue + '\n';
      } else if (key === 'Space' || key === '') {
        newValue = currentValue + ' ';
      } else if (key === 'Tab' || key === '⇥') {
        newValue = currentValue + '  ';
      } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        // ── Letter keys — apply current case ─────────────────────
        const upper = isCaps !== isShifted;
        const char = upper ? key.toUpperCase() : key.toLowerCase();
        newValue = currentValue + char;
        // Shift is momentary — reset after one character
        if (isShifted) setIsShifted(false);
      } else {
        // ── Everything else (numbers, symbols) ───────────────────
        newValue = currentValue + key;
        // Shift is momentary — reset after one character
        if (isShifted && key.length === 1) setIsShifted(false);
      }
    }

    if (!isControlledValue) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);

  }, []);

  const handleLayoutToggle = useCallback((newLayout: LayoutType) => {
    if (!isControlledLayout) {
      setInternalLayout(newLayout);
    }
    onLayoutChange?.(newLayout);
    // Reset modifier and buffer state when switching layouts
    setIsCaps(false);
    setIsShifted(false);
    setPhoneticBuffer('');
  }, [isControlledLayout, onLayoutChange]);

  const handleClear = useCallback(() => {
    if (!isControlledValue) {
      setInternalValue('');
    }
    onChange?.('');
  }, [isControlledValue, onChange]);

  const handleSoundToggle = useCallback(() => {
    const newState = !currentEnableSound;
    if (!isControlledSound) {
      setInternalEnableSound(newState);
    }
    onSoundToggle?.(newState);
  }, [currentEnableSound, isControlledSound, onSoundToggle]);

  return (
    <main className={`${styles.app} ${className || ''}`.trim()}>
      {/* Animated background orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        {showHeader && (
          <header className={styles.header}>
            <div className={styles.logoMark} aria-hidden="true">
              <span className={styles.logoIcon}>⌨</span>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h1 className={styles.title}>
                {headerTitle}
                {headerTitleAccent && <span className={styles.titleAccent}>{headerTitleAccent}</span>}
              </h1>
              <p className={styles.subtitle}>{headerSubtitle}</p>
            </div>
            <button
              className={styles.soundToggleBtn}
              onClick={handleSoundToggle}
              aria-label={currentEnableSound ? 'Mute sound' : 'Enable sound'}
              title={currentEnableSound ? 'Mute sound' : 'Enable sound'}
            >
              {currentEnableSound ? '🔊' : '🔇'}
            </button>
          </header>
        )}

        {/* Layout toggle */}
        {showLayoutToggle && (
          <LayoutToggle layout={currentLayout} onToggle={handleLayoutToggle} />
        )}

        {/* Display screen */}
        {showDisplayScreen && (
          <DisplayScreen value={currentValue} />
        )}

        {/* Keyboard */}
        <div className={styles.keyboardWrapper}>
          <div className={styles.keyboardGlow} aria-hidden="true" />
          <div className={styles.keyboardPanel}>
            <Keyboard
              layout={currentLayout}
              isUpperCase={isUpperCase}
              isCaps={isCaps}
              isShifted={isShifted}
              enableSound={currentEnableSound}
              onKeyPress={handleKeyPress}
              isTextEmpty={currentValue.length === 0}
            />
          </div>
        </div>

        {/* Indicator row */}
        {/* Caps/Shift indicators */}
        <div className={styles.toggleRow}>
          <div className={styles.modifierContainer}>
            <div className={styles.modifierBadges}>
              {isCaps && <span className={styles.badge}>⇪ CAPS-LOCK ON</span>}
              {isShifted && <span className={styles.badge}>⇧ SHIFT ON</span>}
              {currentLayout === 'phonetic-hindi' && phoneticBuffer.length > 0 && (
                <span className={`${styles.badge} ${styles.phoneticBadge}`}>Press Space to translate "{phoneticBuffer}"</span>
              )}
            </div>
            {currentValue.length > 0 && (
              <button
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label="Clear text"
                id="clear-button"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {showFooter && (
          <footer className={styles.footer}>
            <p>{footerText}</p>
          </footer>
        )}
      </div>
    </main>
  );
}
