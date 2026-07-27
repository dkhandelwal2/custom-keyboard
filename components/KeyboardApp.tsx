'use client';

import { useState, useCallback } from 'react';
import { Keyboard, type LayoutType } from './Keyboard';
import { LayoutToggle } from './LayoutToggle';
import { DisplayScreen } from './DisplayScreen';
import styles from './KeyboardApp.module.css';

export function KeyboardApp() {
  const [layout, setLayout] = useState<LayoutType>('abcd');
  const [typedText, setTypedText] = useState('');
  const [isCaps, setIsCaps] = useState(false);
  const [isShifted, setIsShifted] = useState(false);

  // isUpperCase: Caps XOR Shift (mirrors real keyboard behaviour)
  const isUpperCase = isCaps !== isShifted;

  const handleKeyPress = useCallback((key: string) => {
    // ── Modifier keys ────────────────────────────────────────
    if (key === 'Caps') {
      setIsCaps((prev) => !prev);
      return;
    }
    if (key === 'Shift' || key === '⇧') {
      setIsShifted((prev) => !prev);
      return;
    }

    // ── Utility keys ─────────────────────────────────────────
    if (key === 'Backspace' || key === '⌫') {
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }
    if (key === 'Enter' || key === '⏎') {
      setTypedText((prev) => prev + '\n');
      return;
    }
    if (key === 'Space' || key === '') {
      setTypedText((prev) => prev + ' ');
      return;
    }
    if (key === 'Tab' || key === '⇥') {
      setTypedText((prev) => prev + '  ');
      return;
    }

    // ── Letter keys — apply current case ─────────────────────
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      // Read current state directly via closure; isCaps/isShifted are stable here.
      const upper = isCaps !== isShifted;
      const char = upper ? key.toUpperCase() : key.toLowerCase();
      setTypedText((prev) => prev + char);
      // Shift is momentary — reset after one character
      if (isShifted) setIsShifted(false);
      return;
    }

    // ── Everything else (numbers, symbols) ───────────────────
    setTypedText((prev) => prev + key);
    // Shift is momentary — reset after one character
    if (isShifted && key.length === 1) setIsShifted(false);
  }, [isCaps, isShifted]);

  const handleLayoutToggle = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    // Reset modifier state when switching layouts
    setIsCaps(false);
    setIsShifted(false);
  }, []);

  return (
    <main className={styles.app}>
      {/* Animated background orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logoMark} aria-hidden="true">
            <span className={styles.logoIcon}>⌨</span>
          </div>
          <div>
            <h1 className={styles.title}>KeyBoard<span className={styles.titleAccent}> 3D</span></h1>
            <p className={styles.subtitle}>Interactive · Animated · Immersive</p>
          </div>
        </header>

        {/* Layout toggle */}
        <LayoutToggle layout={layout} onToggle={handleLayoutToggle} />

        {/* Display screen */}
        <DisplayScreen value={typedText} />

        {/* Indicator row */}
        {/* Caps/Shift indicators */}
        {(isCaps || isShifted || typedText.length > 0) && (
          <div className={styles.toggleRow}>
            <div className={styles.modifierContainer}>
              <div className={styles.modifierBadges}>
                {isCaps && <span className={styles.badge}>⇪ CAPS-LOCK ON</span>}
                {isShifted && <span className={styles.badge}>⇧ SHIFT ON</span>}
              </div>
              {typedText.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setTypedText('')}
                  aria-label="Clear text"
                  id="clear-button"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Keyboard */}
        <div className={styles.keyboardWrapper}>
          <div className={styles.keyboardGlow} aria-hidden="true" />
          <div className={styles.keyboardPanel}>
            <Keyboard
              layout={layout}
              isUpperCase={isUpperCase}
              isCaps={isCaps}
              isShifted={isShifted}
              onKeyPress={handleKeyPress}
              typedTextLength={typedText.length}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Tap keys to play sounds &amp; feel vibration on mobile</p>
        </footer>
      </div>
    </main>
  );
}
