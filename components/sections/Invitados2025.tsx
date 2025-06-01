"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Background image configuration
const invitadosBackground = {
  src: "/images/hero/hero-background.jpg",
  width: 1920,
  height: 1080,
};

// Guest speakers data
const invitados = [
  {
    nombre: "Griselda Alba",
    rol: "Pastora en Ministerio Crecer",
    lugar: "San Luis, Argentina",
    foto: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    nombre: "Valentino Nicolás",
    rol: "Líder de jóvenes en Ministerio",
    lugar: "Tandil, Argentina",
    foto: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    nombre: "Agustín Schiro",
    rol: "Ministerio 'Toma tu lugar'",
    lugar: "Córdoba, Argentina",
    foto: "https://randomuser.me/api/portraits/men/86.jpg"
  }
];

export function Invitados2025() {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Si la sección está fuera de vista, no calculamos parallax
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      // Distancia desde el top de la ventana hasta el top de la sección
      const scrollTop = window.scrollY;
      const elementTop = rect.top + scrollTop;
      // Movemos el fondo a la mitad de la velocidad del scroll (factor 0.5)
      const parallaxValue = (scrollTop - elementTop) * 0.5;
      setOffsetY(parallaxValue);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Cálculo inicial en caso de que ya esté scrolleado
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Contenedor del fondo con parallax */}
      <div
        className="absolute inset-0 z-0 transform-gpu will-change-transform"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <Image
          src={invitadosBackground.src}
          alt="Fondo de invitados"
          fill
          priority
          className="object-cover"
          quality={80}
        />
      </div>

      {/* Overlay semitransparente (se queda fijo pero se difumina el fondo) */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.49), rgba(0, 0, 0, 0.1))"
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-20 py-16 px-2 flex justify-center flex-col items-center">
        <div className="text-start flex flex-col mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Invitados 2025
          </h2>
          <div className="h-1 w-16 bg-orange-500 mb-6 rounded-full"></div>
          <p className="text-lg text-white/70 max-w-2xl mb-4">
            Tres voces, tres historias, una misma pasión por Jesús. Cada invitado aporta su experiencia y visión para enriquecer la diversidad de ministerios y generaciones.
          </p>
        </div>
        <div className="max-w-6xl w-full backdrop-blur-[6px] bg-piedra-50/50 rounded-2xl p-6 shadow-xl border border-white/20">
          {/* Encabezado de sección */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Invitados
            </h2>
            <div className="h-1 w-16 bg-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-base text-white/70 max-w-2xl mx-auto">
              Conoce a los ministros y líderes que nos acompañarán en este tiempo de avivamiento y adoración.
            </p>
          </div>

          {/* Componente Carousel */}
          <InvitadosCarousel />
        </div>
      </div>
    </section>
  );
};

// Carousel component for displaying guests
const InvitadosCarousel = () => {
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(3);

  // Handle responsive carousel display
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisible(1);
      } else if (window.innerWidth < 1024) {
        setVisible(2);
      } else {
        setVisible(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxStart = Math.max(0, invitados.length - visible);

  const prev = () => {
    setStart((prevStart) => Math.max(0, prevStart - 1));
  };

  const next = () => {
    setStart((prevStart) => Math.min(maxStart, prevStart + 1));
  };

  const goToPage = (pageIndex: number) => {
    setStart(pageIndex * visible);
  };

  return (
    <div className="relative mt-16 w-full opacity-90 hover:opacity-100 transition-opacity duration-300">
      {/* Previous button */}
      {invitados.length > visible && (
        <button
          onClick={prev}
          disabled={start === 0}
          className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all ${
            start === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:scale-110"
          }`}
          aria-label="Anterior"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* Guest cards */}
      <div className="flex gap-6 md:gap-8 mt-6 justify-center px-4">
        {invitados.slice(start, start + visible).map((invitado) => (
          <div
            key={invitado.nombre}
            className="bg-white/20 backdrop-blur-sm rounded-xl shadow-md border border-white/20 min-w-[280px] max-w-xs flex-shrink-0 flex flex-col items-center transition-all duration-300 hover:bg-white/30 hover:backdrop-blur-sm relative"
          >
            {/* Profile image */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white p-1">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={invitado.foto}
                  alt={invitado.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Guest information */}
            <div className="p-6 pt-16 mt-4 text-center duration-300">
              <h3 className="font-bold text-xl text-white mb-1">
                {invitado.nombre}
              </h3>
              <div className="text-orange-500 font-medium mb-2">
                {invitado.rol}
              </div>
              <div className="text-sm text-white/70">
                {invitado.lugar}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next button */}
      {invitados.length > visible && (
        <button
          onClick={next}
          disabled={start === maxStart}
          className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all ${
            start === maxStart ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:scale-110"
          }`}
          aria-label="Siguiente"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* Pagination dots */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: Math.ceil(invitados.length / visible) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index * visible === start ? "bg-orange-500 w-8" : "bg-orange-200"
            }`}
            aria-label={`Ir a la página ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
