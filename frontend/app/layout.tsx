import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { MobileMenu } from '@/components/MobileMenu';
import { ClientLayout } from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const metadata: Metadata = {
  title: "Changelog - Corey’s Engineering Log",
  description: "Developer work log and impact tracker",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans`}>
        <ClientLayout>
          <nav
            className="border-b sticky top-0 z-50 backdrop-blur-md"
            style={{
              backgroundColor: `${THEME.colors.background.primary}F0`,
              borderColor: THEME.colors.border.hairline,
            }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-12">
                  <span className="font-semibold text-sm tracking-wider">{'>_'} changelog/</span>
                  <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm hover:text-white transition-colors"
                        style={{color: THEME.colors.text.secondary}}
                    >
                      tickets/
                    </Link>
                    <Link
                        href="/timeline"
                        className="text-sm hover:text-white transition-colors"
                        style={{color: THEME.colors.text.secondary}}
                    >
                      timeline/
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm hover:text-white transition-colors"
                        style={{color: THEME.colors.text.secondary}}
                    >
                      about/
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MobileMenu />
                </div>
              </div>
            </div>
          </nav>
          <main className="min-h-screen">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
