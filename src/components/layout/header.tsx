import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Mail, User, Heart, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#0f172a] text-white text-xs">
        <div className="container mx-auto flex justify-between items-center h-8 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <a href="tel:+543834901545" className="flex items-center gap-1.5 hover:text-primary">
              <Phone size={14} />
              <span>+54 383 490-1545</span>
            </a>
            <a href="mailto:info@inmobiliariacatamarca.com" className="hidden md:flex items-center gap-1.5 hover:text-primary">
              <Mail size={14} />
              <span>info@inmobiliariacatamarca.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>Catamarca, Argentina</span>
            <Link href="#" className="flex items-center gap-1.5 hover:text-primary">
              <Heart size={14} />
              <span>Favoritos</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-primary">
              <User size={14} />
              <span>Salir</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg sm:text-xl font-headline text-[#0f172a]">
              CATAMARCA <br/> INMOBILIARIA
            </span>
          </Link>
          
          <nav className="hidden lg:flex gap-4 text-sm font-medium items-center">
            <Link href="/" className="text-gray-600 hover:text-primary">Inicio</Link>
            <Link href="/properties" className="text-gray-600 hover:text-primary">Propiedades</Link>
            <Link href="#" className="text-gray-600 hover:text-primary">Emprendimientos</Link>
            <Link href="#" className="text-gray-600 hover:text-primary">Tasaciones</Link>
            <Link href="#" className="text-gray-600 hover:text-primary">La Empresa</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">Contacto</Link>
            <Button size="sm" asChild>
              <Link href="#">Admin</Link>
            </Button>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <Input type="search" placeholder="Buscar por código..." className="pr-8 h-9" />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-9 w-9 text-muted-foreground">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="font-bold font-headline text-[#0f172a]">CATAMARCA INMOBILIARIA</span>
                  </Link>
                  <Link href="/" className="hover:text-primary">Inicio</Link>
                  <Link href="/properties" className="text-muted-foreground hover:text-primary">Propiedades</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">Emprendimientos</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">Tasaciones</Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary">La Empresa</Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">Contacto</Link>
                  <Button asChild>
                    <Link href="#">Admin</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
