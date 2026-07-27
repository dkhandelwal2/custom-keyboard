/**
 * Next.js Instrumentation Hook — runs once at server startup.
 *
 * Problem: Next.js 15's internal app-router accesses `localStorage`
 * and `sessionStorage` on the Node.js server where they don't exist
 * (or exist as non-writable getters), causing:
 *   TypeError: localStorage.getItem is not a function → 500
 *
 * Fix: Use Object.defineProperty to forcibly install a silent no-op
 * Storage polyfill before any request is handled.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const noopStorage = {
    length: 0,
    getItem:    (_key: string)               => null,
    setItem:    (_key: string, _val: string) => {},
    removeItem: (_key: string)               => {},
    clear:      ()                           => {},
    key:        (_index: number)             => null,
  } as Storage;

  const patch = (name: 'localStorage' | 'sessionStorage') => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
      // If it's already a proper Storage with getItem, leave it alone
      if (descriptor?.value && typeof descriptor.value.getItem === 'function') return;

      // Define or redefine — works even if it was a non-writable getter
      Object.defineProperty(globalThis, name, {
        value:        noopStorage,
        writable:     true,
        configurable: true,
        enumerable:   false,
      });
    } catch {
      // Last resort: direct assignment
      (globalThis as any)[name] = noopStorage;
    }
  };

  patch('localStorage');
  patch('sessionStorage');
}
