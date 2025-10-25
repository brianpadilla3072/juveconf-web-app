// components/app/ClientLoaderWrapper.tsx
"use client";

import heroBackground from '../../public/images/hero/hero-background.webp';
import { useEffect, useRef, useState } from "react";
import logo from '../../public/images/logo.webp';
import Image from 'next/image';

export function ClientLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const pulseAnimationStyle: React.CSSProperties = {
    animation: 'pulse-heart 1.5s ease-in-out infinite',
  };

  if (isLoading) {
    return (
      <div className="relative h-[100vh] overflow-hidden">
        {/* Fondo fijo con paralax sutil */}
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
            inset: '-123px',
          }}
        />

        {/* Gradiente oscuro */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.67) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.56) 100%)',
            opacity: 0.7,
            transition: 'transform 0.1s ease-out',
            transform: isVisible ? `translate3d(0, ${scrollY * 0.3}px, 0)` : 'translate3d(0, 0, 0)',
            willChange: 'transform',
            inset: '-123px',
          }}
        />

        {/* Logo con animación de latido */}
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={192}
            height={192}
            className="object-contain"
            style={{
              opacity: 0.8,
              ...pulseAnimationStyle,
            }}
          />
        </div>

        {/* Definición inline del keyframes (en caso de que no uses Tailwind extend) */}
        <style jsx>{`
          @keyframes pulse-heart {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
