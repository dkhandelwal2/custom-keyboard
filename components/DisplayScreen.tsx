'use client';

import { useEffect, useRef } from 'react';
import type { DisplayScreenProps } from './types';
import styles from './DisplayScreen.module.css';

export function DisplayScreen({ value }: DisplayScreenProps) {
  const textAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever text changes
  useEffect(() => {
    const el = textAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [value]);

  const displayText = value || '';

  return (
    <div className={styles.screen} role="textbox" aria-label="Typed text display" aria-readonly="true">
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.textArea} ref={textAreaRef}>
        <span className={styles.text}>{displayText}</span>
        <span className={styles.cursor} aria-hidden="true" />
      </div>
      <div className={styles.charCount}>{value.replace(/\s/g, '').length} chars</div>
    </div>
  );
}
