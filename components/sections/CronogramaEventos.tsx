"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Clock,
  Coffee,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Utensils,
  CalendarCheck
} from "lucide-react";
import heroBackground from '../../public/images/hero/hero-background.jpg';

// Definir tipos para resolver errores de tipado
type TituloActividad =
  | "Recepción"
  | "CDO ABIERTA"
  | "Break"
  | "Break 2"
  | "Taller 1"
  | "Taller 2"
  | "Plenaria final"
  | "Plenaria final + Santa Cena"
  | "Cierre";

type IconosBloqueType = {
  [key in TituloActividad]: React.ReactNode;
};

// Datos separados para facilitar mantenimiento con tipado correcto
const iconosBloque: IconosBloqueType = {
  "Recepción": <CalendarCheck className="text-orange-400" size={20} />,
  "CDO ABIERTA": <BookOpen className="text-orange-500" size={20} />,
  "Break": <Coffee className="text-orange-300" size={20} />,
  "Break 2": <Utensils className="text-orange-300" size={20} />,
  "Taller 1": <Users className="text-orange-400" size={20} />,
  "Taller 2": <Users className="text-orange-400" size={20} />,
  "Plenaria final": <Star className="text-orange-500" size={20} />,
  "Plenaria final + Santa Cena": <Star className="text-orange-500" size={20} />,
  "Cierre": <CheckCircle className="text-orange-400" size={20} />
};

// Función auxiliar para generar badges según el tipo de actividad
const badgeBloque = (titulo: string): React.ReactNode => {
  if (titulo.includes("Taller"))
    return (
      <span className="ml-2 bg-orange-0/30 text-orange-400 border border-orange-300/30 rounded-full px-3 py-1 text-xs font-medium">
        Taller
      </span>
    );
  if (titulo.includes("Plenaria"))
    return (
      <span className="ml-2 bg-orange-0/30 text-orange-400 border border-orange-400/30 rounded-full px-3 py-1 text-xs font-medium">
        Plenaria
      </span>
    );
  if (titulo.includes("Santa Cena"))
    return (
      <span className="ml-2 bg-orange-0/30 text-orange-400 border border-orange-500/30 rounded-full px-3 py-1 text-xs font-medium">
        Santa Cena
      </span>
    );
  if (titulo.includes("CDO"))
    return (
      <span className="ml-2 bg-orange-0/30 text-orange-400 border border-orange-400/30 rounded-full px-3 py-1 text-xs font-medium">
        Encuentro
      </span>
    );
  return null;
};

// Función para obtener el color del borde según el tipo de actividad
const getBorderColor = (titulo: string): string => {
  if (titulo.includes("Taller")) return "border-l-orange-300/50";
  if (titulo.includes("Plenaria")) return "border-l-orange-300/50";
  if (titulo.includes("Santa Cena")) return "border-l-orange-300/50";
  if (titulo.includes("CDO")) return "border-l-orange-300/50";
  if (titulo.includes("Break")) return "border-l-orange-300/50";
  if (titulo.includes("Recepción")) return "border-l-orange-300/50";
  if (titulo.includes("Cierre")) return "border-l-orange-300/50";
  return "border-l-orange-300/50";
};

// Datos del cronograma (actualizado con la información proporcionada)
const cronograma = [
  {
    dia: "19 de Septiembre",
    fechaCompleta: "Viernes 19 de Septiembre, 2025",
    lugar: "Salones Arizu",
    direccion: "Av. Cerri 997, Bahia Blanca",
    bloques: [
      { hora: "09:30", titulo: "Recepción", duracion: "30min" },
      {
        hora: "10:00",
        titulo: "CDO ABIERTA",
        detalle: "Alabanza y palabra",
        duracion: "2h 30min"
      },
      {
        hora: "12:30",
        titulo: "Break",
        detalle: "Almuerzo (no incluido)",
        duracion: "2h 30min"
      },
      {
        hora: "15:00",
        titulo: "Taller 1",
        detalle: "Agustín Schiro",
        duracion: "1h 30min"
      },
      {
        hora: "16:30",
        titulo: "Taller 2",
        detalle: "Griselda Alba",
        duracion: "1h"
      },
      {
        hora: "17:30",
        titulo: "Break 2",
        detalle: "",
        duracion: "1h 30min"
      },
      {
        hora: "19:30",
        titulo: "Plenaria final",
        detalle: "Valentino Nicolás",
        duracion: "2h 30min"
      },
      {
        hora: "22:00",
        titulo: "Cierre",
        detalle: "",
        duracion: "30min"
      }
    ]
  },
  {
    dia: "20 de Septiembre",
    fechaCompleta: "Sábado 20 de Septiembre, 2025",
    lugar: "Salones Arizu",
    direccion: "Av. Cerri 997, Bahia Blanca",
    bloques: [
      { hora: "09:30", titulo: "Recepción", duracion: "30min" },
      {
        hora: "10:00",
        titulo: "CDO ABIERTA",
        detalle: "Alabanza y palabra",
        duracion: "2h 30min"
      },
      {
        hora: "12:30",
        titulo: "Break",
        detalle: "Almuerzo (No incluida puede traer o e en el lugar se venderan, ademas la zona contar con comercios cercanos)",
        duracion: "2h 30min"
      },
      {
        hora: "15:00",
        titulo: "Taller 1",
        detalle: "Griselda Alba",
        duracion: "1h 30min"
      },
      {
        hora: "16:30",
        titulo: "Taller 2",
        detalle: "Valentino Nicolás",
        duracion: "1h"
      },
      {
        hora: "17:30",
        titulo: "Break 2",
        detalle: "",
        duracion: "1h 30min"
      },
      {
        hora: "19:30",
        titulo: "Plenaria final - Agustín Schiro",
        detalle: "",
        duracion: "2h 30min"
      },
      {
        hora: "22:00",
        titulo: "Cierre",
        detalle: "Palabras finales y despedida hasta 2026",
        duracion: "30min"
      }
    ]
  }
];

export function CronogramaEventos() {
  const [activeDay, setActiveDay] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
   // Función para cambiar día con animación
   const changeDay = (newDay: number) => {
    if (newDay === activeDay || isAnimating) return; // evitar clicks rápidos
    setIsAnimating(true);
    setTimeout(() => {
      setActiveDay(newDay);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // duración fade-in
    }, 300); // duración fade-out
  };
  
  // Efecto para manejar el parallax y la visibilidad del section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(inView);
      if (inView) {
        const scrollPosition = window.scrollY;
        const elementTop = rect.top + scrollPosition;
        const parallax = (scrollPosition - elementTop) * 0.5;
        setScrollY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Inicializar estado
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Efecto para manejar el responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navegación entre días para móvil
  const nextDay = () => changeDay((activeDay + 1) % cronograma.length);
  const prevDay = () => changeDay((activeDay - 1 + cronograma.length) % cronograma.length)

  return (
    <section
      ref={sectionRef}
      id="cronograma"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground.src})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      {/* Gradiente overlay con movimiento parallax más lento */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.15), rgba(0,0,0,0.1))",
          transform: isVisible
            ? `translate3d(0, ${scrollY * 0.3}px, 0)`
            : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      />

      {/* Contenedor principal del contenido */}
      <div className="relative z-20 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-50 mb-4">
              Cronograma CAJ 2025
            </h2>
            <div className="h-1 w-16 bg-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-neutral-50/80 max-w-2xl mx-auto">
              Descubre todo lo que tenemos preparado para estos días de avivamiento y adoración
            </p>
          </div>

          {/* Selector de fecha para móvil */}
          {isMobile ? (
            <div className="flex items-center justify-center mb-6 px-4">
              <button 
                onClick={prevDay}
                className="p-2 text-white hover:bg-white/10 rounded-full"
                aria-label="Día anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              
              <div className="mx-4 text-center">
                <div className="text-white font-medium text-lg">
                  {cronograma[activeDay].dia}
                </div>
                <div className="text-sm text-white/70">
                  {cronograma[activeDay].fechaCompleta}
                </div>
              </div>
              
              <button 
                onClick={nextDay}
                className="p-2 text-white hover:bg-white/10 rounded-full"
                aria-label="Siguiente día"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : (
            // Pestañas de días para desktop
            <div className="flex justify-center mb-8 max-w-4xl mx-auto border-blue-100">
              {cronograma.map((dia, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDay(index)}
                  className={`px-6 py-3 font-medium text-sm md:text-base transition-colors relative ${
                    activeDay === index
                      ? "text-white font-semibold"
                      : "text-neutral-50 hover:text-neutral-100"
                  }`}
                >
                  {dia.dia}
                  {activeDay === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Contenido del cronograma */}
          <div className="space-y-8">
            {[cronograma[activeDay]].map((dia, diaIndex) => (
              <div
                key={diaIndex}
                className="w-full mx-auto bg-black/10 rounded-2xl shadow-xl backdrop-blur-[6px] p-8 md:p-12 lg:p-16"
              >
                <a
                  href="https://www.google.com/maps/place/Salones+Arizu/@-38.7252955,-62.2551845,17z/data=!3m1!4b1!4m6!3m5!1s0x95eda33622c626cd:0x2ad826b8e014bb84!8m2!3d-38.7252955!4d-62.2551845!16s%2Fg%2F11g8wwfry7?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center px-6 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-black/5 hover:backdrop-blur-sm transition-all duration-300 mb-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{dia.lugar}</p>
                    <p className="text-xs opacity-80">{dia.direccion}</p>
                  </div>
                </a>

                <div className="space-y-4">
                  {dia.bloques.map((bloque, index) => {
                    // Búsqueda exacta por clave en lugar de includes()
                    const Icono =
                      iconosBloque[bloque.titulo as TituloActividad] ?? (
                        <Clock className="text-orange-500" size={20} />
                      );

                    return (
                      <div
                        key={index}
                        className={`relative pl-6 pb-6 border-l-2 ${getBorderColor(
                          bloque.titulo
                        )} last:border-l-0 last:pb-0 last:mb-0`}
                      >
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-white border-4 border-orange-500/80 -translate-x-[calc(0.5rem+1px)] mt-1"></div>

                        <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">{Icono}</div>
                              <div className="ml-3">
                                <div className="flex items-center flex-wrap">
                                  <h4 className="text-base font-semibold text-white">
                                    {bloque.titulo}
                                  </h4>
                                  {badgeBloque(bloque.titulo)}
                                </div>
                                {bloque.detalle && (
                                  <p className="text-sm text-white/50 mt-1">{bloque.detalle}</p>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                                <Clock className="mr-1 h-3 w-3 text-white" />
                                {bloque.hora} • {bloque.duracion}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isMobile && (
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <a
                className="inline-flex items-center px-8 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-black/5 hover:backdrop-blur-sm transition-all duration-300 text-lg"
                href="/entradas"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Reservar mi lugar para el evento
              </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón de acción en desktop */}
          {!isMobile && (
            <div className="mt-12 text-center">
              <a
                className="inline-flex items-center px-8 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-black/5 hover:backdrop-blur-sm transition-all duration-300 text-lg"
                href="/entradas"
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Reservar mi lugar para el evento
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
