import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Guerrero Inmobiliaria',
  description: 'Encuentre su propiedad ideal en Catamarca.',
  icons: {
    icon: "/favicon.ico",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          <Header config={siteConfig} />
          <main className="flex-grow">{children}</main>
          <Footer config={siteConfig} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
