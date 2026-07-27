'use client';

import { Key } from './Key';
import styles from './Keyboard.module.css';

export type LayoutType = 'qwerty' | 'abcd' | 'numeric';

interface KeyboardProps {
  layout: LayoutType;
  isUpperCase: boolean;
  isCaps: boolean;
  isShifted: boolean;
  onKeyPress: (key: string) => void;
  typedTextLength?: number;
}

// ── QWERTY Layout rows ───────────────────────────────────────────────────────
// Stored as uppercase; display adjusts via isUpperCase prop.
const QWERTY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
];

// ── ABCD Layout rows — 4 rows × 7 keys each (perfect symmetry) ───────────────
// Row 3: Caps on left · V W X Y Z in centre · Shift on right  = 7 total
const ABCD_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],     // row 0 — 7 keys
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],     // row 1 — 7 keys
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],     // row 2 — 7 keys
  ['Caps', 'V', 'W', 'X', 'Y', 'Z', 'Shift'], // row 3 — 7 keys ← new
];

// ── Numeric Layout rows ──────────────────────────────────────────────────────
const NUMERIC_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

const ACCENT_KEYS = new Set([
  'Backspace', 'Enter', 'Tab', 'Shift', 'Caps', 'Space',
]);

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

const SHIFT_SYMBOLS: Record<string, string> = {
  '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
  '[': '{', ']': '}', '\\': '|', ';': ':', '\'': '"', ',': '<', '.': '>', '/': '?'
};

/** Compute the visible label for a key */
function resolveDisplay(key: string, isUpperCase: boolean, isShifted: boolean = false): React.ReactNode {
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
  if (isShifted && SHIFT_SYMBOLS[key]) return SHIFT_SYMBOLS[key];
  if (key.length === 1 && /[A-Z]/.test(key)) {
    return isUpperCase ? key.toUpperCase() : key.toLowerCase();
  }
  return key;
}

export function Keyboard({ layout, isUpperCase, isCaps, isShifted, onKeyPress, typedTextLength }: KeyboardProps) {
  const rows = layout === 'qwerty' ? QWERTY_ROWS : (layout === 'abcd' ? ABCD_ROWS : NUMERIC_ROWS);

  return (
    <div
      className={styles.keyboard}
      role="group"
      aria-label={`${layout === 'qwerty' ? 'QWERTY' : 'A-Z'} Keyboard`}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>

          {/* ── QWERTY leading modifier keys ───────── */}
          {layout === 'qwerty' && rowIndex === 1 && (
            <Key label="Tab" displayLabel={resolveDisplay('Tab', isUpperCase)} rowIndex={rowIndex} width="wide" accent onKeyPress={onKeyPress} />
          )}
          {layout === 'qwerty' && rowIndex === 2 && (
            <Key label="Caps" displayLabel={resolveDisplay('Caps', isUpperCase)} rowIndex={rowIndex} width="wide" accent isActive={isCaps} onKeyPress={onKeyPress} />
          )}
          {layout === 'qwerty' && rowIndex === 3 && (
            <Key label="Shift" displayLabel={resolveDisplay('Shift', isUpperCase)} rowIndex={rowIndex} width="wider" accent isActive={isShifted} onKeyPress={onKeyPress} />
          )}

          {/* ── Letter / inline keys ────────────────── */}
          {row.map((key) => {
            const actualLabel = (isShifted && SHIFT_SYMBOLS[key]) ? SHIFT_SYMBOLS[key] : key;
            return (
            <Key
              key={key}
              label={actualLabel}
              displayLabel={resolveDisplay(key, isUpperCase, isShifted)}
              rowIndex={rowIndex}
              width={getKeyWidth(key, layout, rowIndex)}
              accent={ACCENT_KEYS.has(key)}
              // Pass active state for inline Caps/Shift in ABCD row 3
              isActive={
                (key === 'Caps' && isCaps) ||
                (key === 'Shift' && isShifted)
              }
              onKeyPress={onKeyPress}
            />
            );
          })}

          {/* ── QWERTY trailing modifier keys ──────── */}
          {layout === 'qwerty' && rowIndex === 1 && (
            <Key label="Backspace" displayLabel={resolveDisplay('Backspace', isUpperCase)} rowIndex={rowIndex} width="wider" accent onKeyPress={onKeyPress} isDisabled={typedTextLength === 0} />
          )}
          {layout === 'qwerty' && rowIndex === 2 && (
            <Key label="Enter" displayLabel={resolveDisplay('Enter', isUpperCase)} rowIndex={rowIndex} width="wider" accent onKeyPress={onKeyPress} />
          )}
          {layout === 'qwerty' && rowIndex === 3 && (
            <Key label="Shift" displayLabel={resolveDisplay('Shift', isUpperCase)} rowIndex={rowIndex} width="wider" accent isActive={isShifted} onKeyPress={onKeyPress} />
          )}
        </div>
      ))}

      {/* ── Bottom row — common to all layouts ──── */}
      <div className={styles.row}>
        {layout !== 'qwerty' && (
          <Key label="Backspace" displayLabel={resolveDisplay('Backspace', isUpperCase)} rowIndex={rows.length} width="wider" accent onKeyPress={onKeyPress} isDisabled={typedTextLength === 0} />
        )}
        {layout !== 'numeric' && (
          <Key label="Space" displayLabel={resolveDisplay('Space', isUpperCase)} rowIndex={rows.length} width="widest" onKeyPress={onKeyPress} />
        )}
        {layout === 'abcd' && (
          <Key label="Enter" displayLabel={resolveDisplay('Enter', isUpperCase)} rowIndex={rows.length} width="wider" accent onKeyPress={onKeyPress} />
        )}
      </div>
    </div>
  );
}
