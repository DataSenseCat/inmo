
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { getSiteConfig } from '@/lib/config';

export async function Footer() {
  const config = await getSiteConfig();

  return (
    <footer className="bg-[#0f172a] text-white">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4 font-headline">CATAMARCA INMOBILIARIA</h3>
                    <p className="text-sm text-gray-400">
                        Más de 15 años conectando personas con sus hogares ideales en el corazón de Argentina.
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <Link href={config?.socials?.facebook || '#'} aria-label="Facebook"><Facebook className="h-5 w-5 text-gray-400 hover:text-white" /></Link>
                        <Link href={config?.socials?.instagram || '#'} aria-label="Instagram"><Instagram className="h-5 w-5 text-gray-400 hover:text-white" /></Link>
                        <Link href={config?.socials?.twitter || '#'} aria-label="Twitter"><Twitter className="h-5 w-5 text-gray-400 hover:text-white" /></Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 font-headline">Enlaces Rápidos</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/properties" className="hover:underline text-gray-400 hover:text-white">Propiedades</Link></li>
                        <li><Link href="/emprendimientos" className="hover:underline text-gray-400 hover:text-white">Emprendimientos</Link></li>
                        <li><Link href="/tasaciones" className="hover:underline text-gray-400 hover:text-white">Tasaciones</Link></li>
                        <li><Link href="/la-empresa" className="hover:underline text-gray-400 hover:text-white">La Empresa</Link></li>
                        <li><Link href="/contact" className="hover:underline text-gray-400 hover:text-white">Contacto</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="font-semibold mb-3 font-headline">Servicios</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/properties?operation=sale" className="hover:underline text-gray-400 hover:text-white">Venta de Propiedades</Link></li>
                        <li><Link href="/properties?operation=rent" className="hover:underline text-gray-400 hover:text-white">Alquiler de Propiedades</Link></li>
                        <li><Link href="/tasaciones" className="hover:underline text-gray-400 hover:text-white">Tasaciones Gratuitas</Link></li>
                        <li><Link href="/emprendimientos" className="hover:underline text-gray-400 hover:text-white">Desarrollos Inmobiliarios</Link></li>
                        <li><Link href="/la-empresa" className="hover:underline text-gray-400 hover:text-white">Asesoramiento Legal</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 font-headline">Contacto</h4>
                    <address className="not-italic text-sm space-y-2 text-gray-400">
                        <p>{config?.address || 'Dirección no configurada'}</p>
                        <p><a href={`tel:${config?.contactPhone}`} className="hover:underline hover:text-white">{config?.contactPhone || 'Teléfono no configurado'}</a></p>
                        <p><a href={`mailto:${config?.contactEmail}`} className="hover:underline hover:text-white">{config?.contactEmail || 'Email no configurado'}</a></p>
                    </address>
                    <div className='mt-2 text-sm text-gray-400'>
                        <h5 className='font-semibold text-white'>Horarios</h5>
                        <p>{config?.officeHours || 'Horarios no configurados'}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500 flex justify-between flex-wrap">
                <p>&copy; {new Date().getFullYear()} Inmobiliaria Catamarca. Todos los derechos reservados.</p>
                <div className='space-x-4'>
                    <Link href="#" className="hover:underline">Politica de Privacidad</Link>
                    <Link href="#" className="hover:underline">Términos de Uso</Link>
                    <Link href="/admin" className="hover:underline">Panel Admin</Link>
                </div>
            </div>
        </div>
    </footer>
  );
}
