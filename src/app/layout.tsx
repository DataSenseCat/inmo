
'use client';
import { useEffect, useState } from 'react';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig } from '@/lib/config';
import type { SiteConfig } from '@/models/site-config';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    // Set a default title on mount
    document.title = 'Guerrero Inmobiliaria';
    
    async function fetchConfig() {
        const config = await getSiteConfig();
        setSiteConfig(config);
    }
    fetchConfig();
  }, []);

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
