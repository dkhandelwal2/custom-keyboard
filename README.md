# KeyBoard3D ⌨️

A stunning, interactive 3D keyboard component for React. Features real-time sound synthesis, haptic vibration feedback, multiple layouts (QWERTY, A–Z, Numeric), and a mobile-first premium design.

![KeyBoard3D Demo](https://raw.githubusercontent.com/dkhandelwal2/custom-keyboard/main/app/opengraph-image.png)

## Installation

Install the package via npm:

```bash
npm install react-keyboard3d-dkhandelwal
```

*Note: Since it's a React component, you'll need `react` and `react-dom` installed in your project.*

## Quick Start

Import the component and its CSS file into your React/Next.js application.

```tsx
import { useState } from 'react';
import { Keyboard3D } from 'react-keyboard3d-dkhandelwal';
import 'react-keyboard3d-dkhandelwal/dist/components/index.css'; // Important: Import the styles!

export default function MyKeyboardApp() {
  const [text, setText] = useState('');

  return (
    <div style={{ height: '100vh', background: '#0a0814' }}>
      <Keyboard3D 
        value={text}
        onChange={(newText) => setText(newText)}
        defaultLayout="qwerty"
      />
    </div>
  );
}
```

## Props Reference

`Keyboard3D` supports both controlled and uncontrolled state management.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `undefined` | The current value of the typed text. If provided, the component acts as a **controlled** component. |
| `defaultValue` | `string` | `""` | Initial text value for **uncontrolled** usage. |
| `onChange` | `(value: string) => void` | `undefined` | Callback fired whenever the text value changes. |
| `onKeyPress` | `(key: string) => void` | `undefined` | Callback fired for every individual key press (including modifiers). |
| `layout` | `LayoutType` | `undefined` | The current keyboard layout (`'abcd'`, `'qwerty'`, `'numeric'`). If provided, layout state is controlled. |
| `defaultLayout` | `LayoutType` | `'abcd'` | Initial layout for uncontrolled usage. |
| `onLayoutChange` | `(layout: LayoutType) => void`| `undefined` | Callback fired when the user switches the layout via the toggle buttons. |
| `showDisplayScreen` | `boolean` | `true` | Whether to show the top display screen showing the typed text. |
| `showLayoutToggle` | `boolean` | `true` | Whether to show the layout toggle buttons (ABC / QWERTY / 123). |
| `enableSound` | `boolean` | `undefined` | Whether to play sound on key press. If provided, sound state is controlled. |
| `defaultEnableSound`| `boolean` | `true` | Initial sound state for uncontrolled usage. |
| `onSoundToggle` | `(enabled: boolean) => void`| `undefined` | Callback fired when the sound toggle button is clicked. |

## Layout Types

The `LayoutType` is exported from the package and supports the following literal strings:
- `'abcd'` - A standard A-Z alphabetical layout.
- `'qwerty'` - A standard QWERTY layout.
- `'numeric'` - A number pad layout.

## Features

- **Controlled/Uncontrolled:** Use it as a drop-in uncontrolled component or hook it up to your own state.
- **Haptic & Sound:** Automatically handles sound and vibration on mobile devices.
- **Modifiers:** Supports Shift and Caps-Lock with intelligent auto-reverting shift behavior.
- **Beautiful UI:** Glassmorphism, 3D shadows, and CSS animations built-in.

## License

MIT
