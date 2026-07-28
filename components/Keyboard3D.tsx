'use client';

import { useState, useCallback, useEffect } from 'react';
import { Keyboard } from './Keyboard';
import { LayoutToggle } from './LayoutToggle';
import { DisplayScreen } from './DisplayScreen';
import type { Keyboard3DProps, LayoutType } from './types';
import styles from './Keyboard3D.module.css';

export function Keyboard3D({
  className,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onKeyPress,
  layout: controlledLayout,
  defaultLayout = 'abcd',
  onLayoutChange,
  showDisplayScreen = true,
  showLayoutToggle = true,
  showHeader = true,
  showFooter = true,
  headerTitle = 'KeyBoard',
  headerTitleAccent = ' 3D',
  headerSubtitle = 'Interactive · Animated · Immersive',
  footerText = 'Tap keys to play sounds & feel vibration on mobile',
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

  const isControlledValue = controlledValue !== undefined;
  const isControlledLayout = controlledLayout !== undefined;
  const isControlledSound = enableSound !== undefined;

  const currentLayout = isControlledLayout ? controlledLayout : internalLayout;
  const currentValue = isControlledValue ? controlledValue : internalValue;
  const currentEnableSound = isControlledSound ? enableSound : internalEnableSound;

  // isUpperCase: Caps XOR Shift (mirrors real keyboard behaviour)
  const isUpperCase = isCaps !== isShifted;

  const handleKeyPress = useCallback((key: string) => {
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
    if (key === 'Backspace' || key === '⌫') {
      newValue = currentValue.slice(0, -1);
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

    if (!isControlledValue) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);

  }, [currentValue, isCaps, isShifted, isControlledValue, onChange, onKeyPress]);

  const handleLayoutToggle = useCallback((newLayout: LayoutType) => {
    if (!isControlledLayout) {
      setInternalLayout(newLayout);
    }
    onLayoutChange?.(newLayout);
    // Reset modifier state when switching layouts
    setIsCaps(false);
    setIsShifted(false);
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
              typedTextLength={currentValue.length}
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
