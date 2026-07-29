'use client';

import type { LayoutType, LayoutToggleProps } from '../types/types';
import styles from './LayoutToggle.module.css';

const LAYOUT_LABELS: Record<LayoutType, string> = {
  qwerty: 'QWERTY ⌨️',
  abcd: 'ABCD 🔠',
  hindi: 'हिंदी 🇮🇳',
  'phonetic-hindi': 'Eng->Hi 🔄',
  numeric: 'Numeric 123 🔢',
  emoji: 'Emoji 😊'
};

const LAYOUT_OPTIONS: LayoutType[] = ['qwerty', 'abcd', 'numeric', 'hindi', 'phonetic-hindi', 'emoji'];

export function LayoutToggle({ layout, onToggle }: LayoutToggleProps) {
  return (
    <div className={styles.toggleWrapper} role="group" aria-label="Keyboard layout selector">
      <p className={styles.keypadTitle}>Select keyboard type: </p>
      <div className={styles.radioGroup}>
        {(LAYOUT_OPTIONS as LayoutType[]).map((option) => (
          <label key={option} className={[styles.radioLabel, layout === option ? styles.radioLabelActive : ''].join(' ')} title={LAYOUT_LABELS[option]}>
            <input
              type="radio"
              name="layout"
              value={option}
              checked={layout === option}
              onChange={() => onToggle(option)}
              className={styles.radioInput}
              aria-label={LAYOUT_LABELS[option]}
            />
            <span className={styles.radioText}>
              {LAYOUT_LABELS[option]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
