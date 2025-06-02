"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from '../../public/images/logo.webp';
import backgroundImage from '../../public/images/hero/hero-background.jpg'; // puede cambiar esta imagen

export function NuestraVision() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isElementInView = (
        rect.top <= window.innerHeight && rect.bottom >= 0
      );

      setIsVisible(isElementInView);

      if (isElementInView) {
        const scrollPosition = window.scrollY;
        const elementPosition = rect.top + scrollPosition;
        const parallaxValue = (scrollPosition - elementPosition) * 0.5;
        setScrollY(parallaxValue);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="vision" className="relative min-h-[100vh] w-full overflow-hidden">
      {/* Imagen de fondo con parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `url(${backgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : 'translate3d(0, 0, 0)',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
        }}
      />

      {/* Gradiente superpuesto */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.49), rgba(0,0,0,0.3))',
          transform: isVisible ? `translate3d(0, ${scrollY * 0.3}px, 0)` : 'translate3d(0, 0, 0)',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-20 py-16 px-4">
        <div className="max-w-5xl mx-auto bg-piedra-900/50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-[6px] p-8 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-center">
            {/* Logo con animación de latido */}
            <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8 relative h-32 w-32">
              <Image
                src={logo}
                alt="Logo"
                width={192}
                height={192}
                className="object-contain opacity-80"
                style={{
                  animation: 'pulse-heart 2s ease-in-out infinite'
                }}
              />
            </div>

            {/* Texto */}
            <div className="md:w-2/3 text-white space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Nuestra Visión</h2>
              <p className="text-lg leading-relaxed text-white-100/60">
                Por mucho tiempo, el cuerpo de Cristo estuvo fracturado: divisiones, malos tratos, competencia. <span className="font-semibold text-orange-500">"Consagrados a Jesús"</span> viene a romper con esas estructuras, manifestando la unión dada por el Espíritu (<span className="text-orange-500 font-medium">Efesios 4:3-6</span>), enseñando a poner la mirada en Jesús y echar raíces donde Dios nos puso.
              </p>
              <div className="p-4 rounded-lg border-l-4 border-orange-400">
                <p className="italic text-white-100/60">
                  "Solícitos en guardar la unidad del Espíritu en el vínculo de la paz; un cuerpo, y un Espíritu, como fuisteis también llamados en una misma esperanza de vuestra vocación; un Señor, una fe, un bautismo, un Dios y Padre de todos, el cual es sobre todos, y por todos, y en todos."
                </p>
                <p className="text-right text-white-200/60 mt-2 text-sm">— Efesios 4:3-6 (RVR1960)</p>
              </div>
              <p className="text-lg font-medium text-orange-200">
                Nuestro mayor deseo es ayudar a la iglesia a ser una novia pura y unida por Cristo, la cabeza.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes inline */}
      <style jsx>{`
        @keyframes pulse-heart {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
