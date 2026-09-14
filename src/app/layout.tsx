import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Enigame — Mobile Adventure & Mystery Exploration',
  description: 'Uncover urban mysteries, decipher real-world riddles with QR checkpoints, and team up with explorers in historical cities.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#7C82ED',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex items-center justify-center bg-[#0F1021] text-[#1E1F3D]">
        {children}
      </body>
    </html>
  );
}
