import type { ReactNode } from 'react';

export type LayoutType = 'qwerty' | 'abcd' | 'numeric';

export interface Keyboard3DProps {
  /** The current value of the typed text. If provided, the component acts as controlled. */
  value?: string;
  /** Initial text value for uncontrolled usage. */
  defaultValue?: string;
  /** Callback fired when the text value changes. */
  onChange?: (value: string) => void;
  /** Callback fired for every individual key press. */
  onKeyPress?: (key: string) => void;
  /** The current layout. If provided, the layout state is controlled. */
  layout?: LayoutType;
  /** Initial layout for uncontrolled usage. */
  defaultLayout?: LayoutType;
  /** Callback fired when the layout changes. */
  onLayoutChange?: (layout: LayoutType) => void;
  /** Whether to show the display screen. Defaults to true. */
  showDisplayScreen?: boolean;
  /** Whether to show the layout toggle buttons. Defaults to true. */
  showLayoutToggle?: boolean;
  /** Whether to play sound on key press. If provided, sound state is controlled. */
  enableSound?: boolean;
  /** Initial sound enabled state for uncontrolled usage. Defaults to true. */
  defaultEnableSound?: boolean;
  /** Callback fired when the sound is toggled. */
  onSoundToggle?: (enabled: boolean) => void;
}

export interface KeyboardProps {
  layout: LayoutType;
  isUpperCase: boolean;
  isCaps: boolean;
  isShifted: boolean;
  onKeyPress: (key: string) => void;
  typedTextLength?: number;
  enableSound?: boolean;
}

export interface KeyProps {
  label: string;
  displayLabel?: ReactNode;
  rowIndex: number;
  width?: 'normal' | 'wide' | 'wider' | 'widest' | 'half';
  accent?: boolean;
  isActive?: boolean;   // for Caps / Shift active state
  isDisabled?: boolean;
  enableSound?: boolean;
  onKeyPress: (key: string) => void;
}

export interface LayoutToggleProps {
  layout: LayoutType;
  onToggle: (layout: LayoutType) => void;
}

export interface DisplayScreenProps {
  value: string;
}
