import React from 'react';
import type { LayoutType } from '../types/types';
import { SHIFT_SYMBOLS } from '../data/constants';
import styles from '../components/Keyboard.module.css';

/**
 * Keys that sit inline in the ABCD row 3 should use normal flex-1 width
 * so all 7 keys in that row stay perfectly symmetrical.
 */
export function getKeyWidth(
  key: string,
  layout: LayoutType,
  rowIndex: number,
): 'normal' | 'wide' | 'wider' | 'widest' | 'half' {
  if (key === 'Space') return 'widest';

  // In ABCD row 3, Caps & Shift are inline → same width as letters
  if (layout === 'abcd' && rowIndex === 3 && (key === 'Caps' || key === 'Shift')) {
    return 'normal';
  }

  // QWERTY special widths
  if (['Backspace', 'Enter', 'Shift'].includes(key)) return 'wider';
  if (['Tab', 'Caps'].includes(key)) return 'wide';

  return 'normal';
}

/** Compute the visible label for a key */
export function resolveDisplay(
  key: string,
  isUpperCase: boolean,
  isShifted: boolean = false,
  layout?: LayoutType
): React.ReactNode {
  const renderSpecial = (name: string, icon: string) => (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
      <span style={{ fontSize: '1.2em' }}>{icon}</span>
      <span style={{ fontSize: '0.65em', opacity: 0.8, letterSpacing: '0.05em' }}>{name}</span>
    </span>
  );

  const specialMap: Record<string, React.ReactNode> = {
    Backspace: renderSpecial('Delete', '⌫'),
    Enter: renderSpecial('Enter', '⏎'),
    Tab: renderSpecial('Tab', '⇥'),
    Shift: renderSpecial('Shift', '⇧'),
    Caps: renderSpecial('CAPS', '⇪'),
    Space: renderSpecial('Space', '␣'),
  };
  if (specialMap[key]) return specialMap[key];

  let displayChar: React.ReactNode = key;
  if (isShifted && SHIFT_SYMBOLS[key]) {
    displayChar = SHIFT_SYMBOLS[key];
  } else if (key.length === 1 && /[A-Z]/.test(key)) {
    displayChar = isUpperCase ? key.toUpperCase() : key.toLowerCase();
  }

  // Nudge logic for keys with shift symbols (excluding numeric layout which has no shift key)
  if (layout !== 'numeric' && !isShifted && SHIFT_SYMBOLS[key]) {
    return (
      <span className={styles.nudgeContainer}>
        <span className={styles.nudge}>
          {SHIFT_SYMBOLS[key]}
        </span>
        <span>{displayChar}</span>
      </span>
    );
  }

  return displayChar;
}
