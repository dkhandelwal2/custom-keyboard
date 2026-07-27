'use client';

import { useState, useCallback, useRef } from 'react';
import { useSoundEngine } from '@/hooks/useSoundEngine';
import { useVibration } from '@/hooks/useVibration';
import styles from './Key.module.css';

interface KeyProps {
  label: string;
  displayLabel?: React.ReactNode;
  rowIndex: number;
  width?: 'normal' | 'wide' | 'wider' | 'widest' | 'half';
  accent?: boolean;
  isActive?: boolean;   // for Caps / Shift active state
  isDisabled?: boolean;
  onKeyPress: (key: string) => void;
}

export function Key({ label, displayLabel, rowIndex, width = 'normal', accent = false, isActive = false, isDisabled = false, onKeyPress }: KeyProps) {
  const [pressed, setPressed] = useState(false);
  const [burst, setBurst] = useState(false);
  const { playClick } = useSoundEngine();
  const { vibrate } = useVibration();
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = useCallback((e?: React.PointerEvent) => {
    if (isDisabled) {
      // Prevent default to stop any focus/click events from propagating
      if (e) e.preventDefault();
      return;
    }
    setPressed(true);
    setBurst(true);
    playClick(label, rowIndex);
    vibrate(25);
    onKeyPress(label);

    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => setBurst(false), 400);
  }, [label, rowIndex, playClick, vibrate, onKeyPress, isDisabled]);

  const handleRelease = useCallback(() => {
    setPressed(false);
  }, []);

  return (
    <button
      className={[
        styles.key,
        styles[width],
        pressed  ? styles.pressed : '',
        accent   ? styles.accent  : '',
        isActive ? styles.active  : '',
      ].join(' ')}
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerLeave={handleRelease}
      aria-label={label}
      aria-pressed={isActive || undefined}
      disabled={isDisabled}
      type="button"
    >
      <span className={styles.keyFace}>
        <span className={styles.keyLabel}>{displayLabel ?? label}</span>
      </span>
      <span className={styles.keyDepth} />
      {burst && (
        <span className={styles.particleBurst} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
}
