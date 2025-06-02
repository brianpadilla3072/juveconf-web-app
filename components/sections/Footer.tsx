'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import heroBackground from '../../public/images/hero/hero-background-green.jpeg'; // asegúrese que exista
import logo from '../../public/images/logo.webp';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const [scrollY, setScrollY] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      // Get the scroll position
      const scrollPosition = window.scrollY + window.innerHeight;
      // Get the footer position
      const footerTop = footerRef.current.offsetTop;
      // Calculate how much of the footer is visible
      const footerVisible = scrollPosition - footerTop;

      // Only apply parallax when footer is in view
      if (footerVisible > 0) {
        // Smooth parallax effect (slower than scroll)
        const parallaxOffset = footerVisible * 0.3;
        setScrollY(parallaxOffset);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
    >
      {/* Fondo con efecto de paralaje */}
      <div
        className="absolute inset-0"
        style={{
          background: `url(${heroBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
          transition: 'transform 0.5s ease-out',
          willChange: 'transform',
          zIndex: 0,
          inset: '-100px',
          filter: 'brightness(0.6)'
        }}
      />

      {/* Overlay oscuro */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.52) 0%, rgba(13, 17, 27, 0.4) 100%)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 1,
          opacity: 0.95
        }}
      />



      {/* Contenido del footer */}
      <div className="relative z-50 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Sección de logo y descripción */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src={logo.src}
                  alt="Logo Consagrados a Jesús"
                  className="w-10 h-10 object-contain"
                />
                <h3 className="text-1xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Consagrados a Jesús
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Donde la novia se prepara, el cuerpo se edifica, la cabeza <span className="font-bold text-orange-400">Cristo</span> es glorificada, y cada creyente es enviado a echar raíces en su comunidad.              </p>
              <div className="flex space-x-4 pt-2">
                {/* <a 
                  href="#" 
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <span className="sr-only">Facebook</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                    <Facebook className="w-5 h-5" />
                  </div>
                </a> */}
                <a
                  href="https://www.instagram.com/consagradosa_jesus/"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <span className="sr-only">Instagram</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                    <Instagram className="w-5 h-5" />
                  </div>
                </a>
                {/* <a 
                  href="#" 
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <span className="sr-only">YouTube</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                    <Youtube className="w-5 h-5" />
                  </div>
                </a> */}
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-6 pb-2 border-b border-gray-700/50">
                Navegación
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Inicio', href: '/' },
                  { name: 'Entradas', href: '/entradas' },
                  { name: 'Nuestro Origen', href: '/#nuestro-origen' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información de contacto */}
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-6 pb-2 border-b border-gray-700/50">
                Contáctanos
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-300">equipo@consagradosajesus.com</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-300">
                    <a
                      href="https://wa.me/5492914326563" className="text-orange-500 hover:text-orange-400"
                    >
                      +54 9 291 432 6563                  </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-300">Bahía Blanca, Buenos Aires, Argentina</span>
                </li>
              </ul>

              {/* Boletín informativo */}
              {/* <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Suscríbete a nuestro boletín</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Tu correo" 
                    className="flex-grow px-4 py-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-lg transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Derechos de autor */}
          {/* <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Consagrados a Jesús. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Términos', 'Privacidad', 'Cookies'].map((item) => (
                  <a 
                    key={item} 
                    href="#" 
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
