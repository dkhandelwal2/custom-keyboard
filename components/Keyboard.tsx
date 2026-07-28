'use client';

import { Key } from './Key';
import type { LayoutType, KeyboardProps } from './types';
import { QWERTY_ROWS, ABCD_ROWS, NUMERIC_ROWS, HINDI_ROWS, ACCENT_KEYS, SHIFT_SYMBOLS } from './constants';
import styles from './Keyboard.module.css';

// Keys that sit inline in the ABCD row 3 should use normal flex-1 width
// so all 7 keys in that row stay perfectly symmetrical.
function getKeyWidth(
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
function resolveDisplay(key: string, isUpperCase: boolean, isShifted: boolean = false, layout?: LayoutType): React.ReactNode {
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

  // Nudge logic for Hindi keys
  if (layout === 'hindi' && !isShifted && SHIFT_SYMBOLS[key]) {
    return (
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <span style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '0.6em', opacity: 0.5 }}>
          {SHIFT_SYMBOLS[key]}
        </span>
        <span>{displayChar}</span>
      </span>
    );
  }

  return displayChar;
}

export function Keyboard({ layout, isUpperCase, isCaps, isShifted, enableSound = true, onKeyPress, typedTextLength }: KeyboardProps) {
  const rows = layout === 'qwerty' ? QWERTY_ROWS : (layout === 'abcd' ? ABCD_ROWS : (layout === 'hindi' ? HINDI_ROWS : NUMERIC_ROWS));
  const isStandard = layout === 'qwerty' || layout === 'hindi';

  return (
    <div
      className={styles.keyboard}
      role="group"
      aria-label={`${layout === 'qwerty' ? 'QWERTY' : (layout === 'hindi' ? 'Hindi' : 'A-Z')} Keyboard`}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>

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
          {row.map((key) => {
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
      ))}

      {/* ── Bottom row — common to all layouts ──── */}
      <div className={styles.row}>
        {!isStandard && (
          <Key label="Backspace" displayLabel={resolveDisplay('Backspace', isUpperCase, false, layout)} rowIndex={rows.length} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} isDisabled={typedTextLength === 0} />
        )}
        {layout !== 'numeric' && (
          <Key label="Space" displayLabel={resolveDisplay('Space', isUpperCase, false, layout)} rowIndex={rows.length} width="widest" enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
        {layout === 'abcd' && (
          <Key label="Enter" displayLabel={resolveDisplay('Enter', isUpperCase, false, layout)} rowIndex={rows.length} width="wider" accent enableSound={enableSound} onKeyPress={onKeyPress} />
        )}
      </div>
    </div>
  );
}
