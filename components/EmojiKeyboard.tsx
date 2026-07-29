import { useState, useMemo } from 'react';
import { Key } from './Key';
import type { KeyboardProps } from '../types/types';
import { FULL_EMOJIS } from '../data/emoji-data';
import styles from './Keyboard.module.css';
import { getKeyWidth, resolveDisplay } from '../utils/keyboardUtils';
import { ACCENT_KEYS, SHIFT_SYMBOLS } from '../data/constants';

const CATEGORY_ICONS: Record<string, string> = {
  'Smileys & Emotion': '😀',
  'People & Body': '👋',
  'Animals & Nature': '🐱',
  'Food & Drink': '🍔',
  'Travel & Places': '✈️',
  'Activities': '⚽',
  'Objects': '💡',
  'Symbols': '🔣',
  'Flags': '🏁'
};

export function EmojiKeyboard({ layout, isUpperCase, isCaps, isShifted, enableSound = true, onKeyPress }: KeyboardProps) {
  const [emojiSearch, setEmojiSearch] = useState('');
  const [emojiCategory, setEmojiCategory] = useState<string | null>(null);

  const emojiCategories = useMemo(() => {
    const groups = new Set<string>();
    FULL_EMOJIS.forEach(e => {
      if (e.group !== 'Component') {
        groups.add(e.group);
      }
    });
    return Array.from(groups);
  }, []);

  const currentEmojiRows = useMemo(() => {
    // Filter out skin tone variations to avoid duplicates
    let filtered = FULL_EMOJIS.filter(e => !e.name.includes('skin tone'));

    if (emojiCategory) {
      filtered = filtered.filter(e => e.group === emojiCategory);
    }
    if (emojiSearch) {
      const lowerSearch = emojiSearch.toLowerCase();
      filtered = filtered.filter(e => e.name.toLowerCase().includes(lowerSearch));
    }
    const rows: string[][] = [];
    const rowLen = 12;
    for (let i = 0; i < filtered.length; i += rowLen) {
      const slice = filtered.slice(i, i + rowLen).map(e => e.char);
      while (slice.length < rowLen) {
        slice.push(''); // Pad with empty strings for symmetry
      }
      rows.push(slice);
    }
    return rows;
  }, [emojiSearch, emojiCategory]);

  return (
    <>
      <div className={styles.emojiToolbar}>
        <input
          name='emoji-seach'
          type="text"
          placeholder="Search emojis..."
          value={emojiSearch}
          onChange={e => setEmojiSearch(e.target.value)}
          className={styles.emojiSearch}
        />
        <div className={styles.emojiCategories}>
          <button
            className={!emojiCategory ? styles.activeCategory : ''}
            onClick={() => setEmojiCategory(null)}
            title="All"
          >All</button>
          {emojiCategories.map(cat => (
            <button
              key={cat}
              className={emojiCategory === cat ? styles.activeCategory : ''}
              onClick={() => setEmojiCategory(cat)}
              title={cat}
            >{CATEGORY_ICONS[cat] || cat}</button>
          ))}
        </div>
      </div>

      <div className={styles.emojiScrollContainer}>
        {currentEmojiRows.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateIcon}>😕</span>
            <p>No emojis found</p>
          </div>
        ) : (
          currentEmojiRows.map((row, rowIndex) => (
            <div key={rowIndex} className={`${styles.row} ${styles.emojiRow}`}>
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
                    isActive={(key === 'Caps' && isCaps) || (key === 'Shift' && isShifted)}
                    enableSound={enableSound}
                    onKeyPress={onKeyPress}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
}
