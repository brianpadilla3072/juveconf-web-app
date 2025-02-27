import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/navigation'
export const metadata: Metadata = {
  title: 'Consagrados',
  description: 'Created with v0'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="mt-16 pt-3">
          {children}
          </main>
      </body>
    </html>
  );
}
