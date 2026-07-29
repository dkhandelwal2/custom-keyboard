'use client';

import React from 'react';
import { Key } from './Key';
import type { LayoutType, KeyboardProps } from '../types/types';
import { QWERTY_ROWS, ABCD_ROWS, NUMERIC_ROWS, HINDI_ROWS, ACCENT_KEYS, SHIFT_SYMBOLS } from '../data/constants';
import { EmojiKeyboard } from './EmojiKeyboard';
import { getKeyWidth, resolveDisplay } from '../utils/keyboardUtils';
import styles from './Keyboard.module.css';

const LAYOUT_ROWS_MAP: Partial<Record<LayoutType, string[][]>> = {
  qwerty: QWERTY_ROWS,
  'phonetic-hindi': QWERTY_ROWS,
  abcd: ABCD_ROWS,
  hindi: HINDI_ROWS,
  numeric: NUMERIC_ROWS,
};

const LAYOUT_ARIA_MAP: Record<LayoutType, string> = {
  qwerty: 'QWERTY',
  'phonetic-hindi': 'Phonetic Hindi',
  hindi: 'Hindi',
  abcd: 'A-Z',
  numeric: 'Numeric',
  emoji: 'Emoji',
};

export function Keyboard(props: KeyboardProps) {
  const { layout, isUpperCase, isCaps, isShifted, enableSound = true, onKeyPress, typedTextLength } = props;
  const isQwertyLike = layout === 'qwerty' || layout === 'phonetic-hindi';
  const isStandard = isQwertyLike || layout === 'hindi';

  let rows = LAYOUT_ROWS_MAP[layout] || QWERTY_ROWS;

  const renderRows = () => (
    rows.map((row, rowIndex) => (
      <div key={rowIndex} className={`${styles.row} ${layout === 'emoji' ? styles.emojiRow : ''}`}>

        {/* ── Standard leading modifier keys (QWERTY & Hindi) ───────── */}
        {isStandard && rowIndex === 1 && (
          <Key label="Tab" displayLabel={resolveDisplay('Tab', isUpperCase, false, layout)} rowIndex={rowIndex} width="wide" accent enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
        {isStandard && rowIndex === 2 && (
          <Key label="Caps" displayLabel={resolveDisplay('Caps', isUpperCase, false, layout)} rowIndex={rowIndex} width="wide" accent isActive={isCaps} enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
        {isStandard && rowIndex === 3 && (
          <Key label="Shift" displayLabel={resolveDisplay('Shift', isUpperCase, false, layout)} rowIndex={rowIndex} width="wider" accent isActive={isShifted} enableSound={enableSound} onKeyPress={onKeyPress} />
        )}

        {/* ── Letter / inline keys ────────────────── */}
        {row.map((key, index) => {
          if (key === '') {
            return <div key={`empty-${index}`} style={{ flex: 1 }} />;
          }
          const actualLabel = (isShifted && SHIFT_SYMBOLS[key]) ? SHIFT_SYMBOLS[key] : key;
          return (
            <Key
              key={key}
              label={actualLabel}
              displayLabel={resolveDisplay(key, isUpperCase, isShifted, layout)}
              rowIndex={rowIndex}
              width={getKeyWidth(key, layout, rowIndex)}
              accent={ACCENT_KEYS.has(key)}
              // Pass active state for inline Caps/Shift in ABCD row 3
              isActive={
                (key === 'Caps' && isCaps) ||
                (key === 'Shift' && isShifted)
              }
              enableSound={enableSound}
              onKeyPress={onKeyPress}
            />
          );
        })}

        {/* ── Standard trailing modifier keys (QWERTY & Hindi) ──────── */}
        {isStandard && rowIndex === 1 && (
          <Key label="Backspace" displayLabel={resolveDisplay('Backspace', isUpperCase, false, layout)} rowIndex={rowIndex} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} isDisabled={typedTextLength === 0} />
        )}
        {isStandard && rowIndex === 2 && (
          <Key label="Enter" displayLabel={resolveDisplay('Enter', isUpperCase, false, layout)} rowIndex={rowIndex} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
        {isStandard && rowIndex === 3 && (
          <Key label="Shift" displayLabel={resolveDisplay('Shift', isUpperCase, false, layout)} rowIndex={rowIndex} width="wider" accent isActive={isShifted} enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
      </div>
    ))
  );

  return (
    <div
      className={styles.keyboard}
      role="group"
      aria-label={`${LAYOUT_ARIA_MAP[layout] || 'QWERTY'} Keyboard`}
    >
      {layout === 'emoji' ? (
        <EmojiKeyboard {...props} enableSound={enableSound} />
      ) : (
        renderRows()
      )}

      {/* ── Bottom row — common to all layouts ──── */}
      <div className={styles.row}>
        {!isStandard && (
          <Key label="Backspace" displayLabel={resolveDisplay('Backspace', isUpperCase, false, layout)} rowIndex={rows.length} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} isDisabled={typedTextLength === 0} />
        )}
        <Key label="Space" displayLabel={resolveDisplay('Space', isUpperCase, false, layout)} rowIndex={rows.length} width="widest" enableSound={enableSound} onKeyPress={onKeyPress} />
        {!isStandard && (
          <Key label="Enter" displayLabel={resolveDisplay('Enter', isUpperCase, false, layout)} rowIndex={rows.length} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
      </div>
    </div>
  );
}
