"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import heroBackground from '../../public/images/hero/hero-background.jpg';
import logo from '../../public/images/logo.webp';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const isElementInView = (
        rect.top <= window.innerHeight && rect.bottom >= 0
      );
      
      setIsVisible(isElementInView);
      
      if (isElementInView) {
        // Calcula el desplazamiento basado en la posición del scroll
        const scrollPosition = window.scrollY;
        const elementPosition = rect.top + scrollPosition;
        const windowHeight = window.innerHeight;
        
        // Ajusta la velocidad del efecto parallax (0.5 es la intensidad)
        const parallaxValue = (scrollPosition - elementPosition) * 0.5;
        setScrollY(parallaxValue);
      }
    };

    // Añadir el event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Llamar una vez al montar para establecer el estado inicial
    handleScroll();
    
    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-[99vh] w-full overflow-hidden"
    >
      {/* Capa de fondo */}
      <div 
        className="absolute inset-0"
        style={{
          background: `url(${heroBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'transform 0.1s ease-out',
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : 'translate3d(0, 0, 0)',
          willChange: 'transform',
          inset: '-123px'
        }}
      />
      
      {/* Gradiente */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 50%, rgba(0, 0, 0, 0.56) 100%)',
          opacity: 0.7,
          transition: 'transform 0.1s ease-out',
          transform: isVisible ? `translate3d(0, ${scrollY * 0.3}px, 0)` : 'translate3d(0, 0, 0)',
          willChange: 'transform',
          inset: '-123px'
        }}
      />
      
      {/* Contenido */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="z-30 text-center">
          <div className="space-y-6">
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '1.2',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.02em'
            }}>
              <span style={{ display: 'block' }}>CONSAGRADOS A JESÚS</span>
            </h1>
            <div className="w-40 h-40 mx-auto">
              <Image src={logo} alt="Logo" width={192} height={192} className="object-contain opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
