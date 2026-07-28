// ── QWERTY Layout rows ───────────────────────────────────────────────────────
// Stored as uppercase; display adjusts via isUpperCase prop.
export const QWERTY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
];

// ── ABCD Layout rows — 4 rows × 7 keys each (perfect symmetry) ───────────────
// Row 3: Caps on left · V W X Y Z in centre · Shift on right  = 7 total
export const ABCD_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],     // row 0 — 7 keys
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],     // row 1 — 7 keys
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],     // row 2 — 7 keys
  ['Caps', 'V', 'W', 'X', 'Y', 'Z', 'Shift'], // row 3 — 7 keys
];

// ── Numeric Layout rows ──────────────────────────────────────────────────────
export const NUMERIC_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

export const ACCENT_KEYS = new Set([
  'Backspace', 'Enter', 'Tab', 'Shift', 'Caps', 'Space',
]);

export const SHIFT_SYMBOLS: Record<string, string> = {
  '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
  '[': '{', ']': '}', '\\': '|', ';': ':', '\'': '"', ',': '<', '.': '>', '/': '?'
};
