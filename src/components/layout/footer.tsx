import Link from 'next/link';
import { Mountain, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted py-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-6">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center space-x-2 mb-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">
              Catamarca Estates
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Your trusted real estate partner in Catamarca.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 font-headline">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/properties" className="text-sm hover:underline text-muted-foreground">Properties</Link></li>
            <li><Link href="/contact" className="text-sm hover:underline text-muted-foreground">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 font-headline">Contact</h4>
          <address className="not-italic text-sm space-y-2 text-muted-foreground">
            <p>123 Real Estate Ave, Catamarca, Argentina</p>
            <p>Email: <a href="mailto:info@catamarcaestates.com" className="hover:underline">info@catamarcaestates.com</a></p>
            <p>Phone: <a href="tel:+54123456789" className="hover:underline">+54 (123) 456-789</a></p>
          </address>
        </div>
        <div>
          <h4 className="font-semibold mb-3 font-headline">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Catamarca Estates. All rights reserved.</p>
      </div>
    </footer>
  );
}
