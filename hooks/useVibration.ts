
import { useCallback } from 'react';

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[] = 30) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently fail
      }
    }
  }, []);

  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  return { vibrate, isSupported };
}
