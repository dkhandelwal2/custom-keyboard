'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import keyboard with ssr:false — must be inside a 'use client' file
const KeyboardApp = dynamic(
  () => import('@/components/KeyboardApp').then((m) => ({ default: m.KeyboardApp })),
  { ssr: false }
);

// Placeholder rendered on BOTH server and client during initial hydration.
// Must be 100% identical on server + client to avoid hydration mismatch.
function HydrationPlaceholder() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        background: '#06040f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    />
  );
}

export function ClientKeyboard() {
  // Start as false on both server and client.
  // useEffect only fires on the client, after hydration is complete.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount: server and client both render the same placeholder → no mismatch.
  // After mount:  client renders the real keyboard (no server involved at this point).
  if (!mounted) return <HydrationPlaceholder />;

  return <KeyboardApp />;
}
