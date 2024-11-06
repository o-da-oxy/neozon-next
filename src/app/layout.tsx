import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'NeOzon',
  description: 'Order Manager',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div
          className="fixed absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg.png)',
            filter: 'opacity(0.2)',
          }}
        />
        <div className="relative z-10">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
