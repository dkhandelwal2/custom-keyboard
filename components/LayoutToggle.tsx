'use client';

import type { LayoutType, LayoutToggleProps } from './types';
import styles from './LayoutToggle.module.css';

export function LayoutToggle({ layout, onToggle }: LayoutToggleProps) {
  return (
    <div className={styles.toggleWrapper} role="group" aria-label="Keyboard layout selector">
      <p className={styles.keypadTitle}>Select keyboard type: </p>
      <div className={styles.radioGroup}>
        {(['qwerty', 'abcd', 'numeric', 'hindi'] as LayoutType[]).map((option) => (
          <label key={option} className={[styles.radioLabel, layout === option ? styles.radioLabelActive : ''].join(' ')}>
            <input
              type="radio"
              name="layout"
              value={option}
              checked={layout === option}
              onChange={() => onToggle(option)}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>
              {option === 'qwerty' ? 'QWERTY' : option === 'abcd' ? 'A–Z' : option === 'hindi' ? 'हिंदी' : '123'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
