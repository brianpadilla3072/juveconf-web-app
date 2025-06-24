"use client";

import { useRouter } from "next/navigation";
import heroBackground from '../public/images/hero/hero-background.jpg';
import { useState, useEffect } from "react";
import logo from '../public/images/logo.webp';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const pulseAnimationStyle: React.CSSProperties = {
    animation: 'pulse-heart 1.5s ease-in-out infinite',
  };
  useEffect(() => {
    // Redirigir al login después de 3 segundos
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0"
        style={{
          background: `url(${heroBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />
      
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.67) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.56) 100%)',
          opacity: 0.7,
        }}
      />
      
      {/* Contenido centrado */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-piedra/5 backdrop-blur-[6px] rounded-lg shadow-xl text-center border border-orange-100/10">
            <div className="flex justify-center">
              <div className="p-3  rounded-full">
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
            </div>
            <h1 className="text-2xl font-bold text-white">404 - Página no encontrada</h1>
            <p className="text-white/60">
              La página que estás buscando no existe o ha sido movida.
            </p>
            
          </div>
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
