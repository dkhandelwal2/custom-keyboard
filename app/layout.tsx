import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://custom-keyboard-lilac.vercel.app/'),
  title: 'KeyBoard3D — Interactive 3D Keyboard with Sound & Vibration',
  description:
    'A stunning 3D interactive keyboard with real-time sound synthesis, haptic vibration, QWERTY and A–Z layouts. Mobile-first design with premium animations.',
  keywords: ['3D keyboard', 'interactive keyboard', 'QWERTY', 'sound keyboard', 'mobile keyboard'],
  authors: [{ name: 'KeyBoard3D' }],
  openGraph: {
    title: 'KeyBoard3D — Interactive 3D Keyboard',
    description: 'Tap keys, hear sounds, feel vibration. A premium 3D keyboard experience.',
    url: 'https://custom-keyboard-lilac.vercel.app/',
    siteName: 'KeyBoard3D',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyBoard3D — Interactive 3D Keyboard',
    description: 'Tap keys, hear sounds, feel vibration. A premium 3D keyboard experience.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0814',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts loaded by browser at runtime — no build-time fetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
