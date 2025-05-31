"use client";
import React from "react";
import { 
  ChevronDown, 
  Clock, 
  Coffee, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Utensils, 
  CalendarCheck 
} from "lucide-react";

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
  "Recepción": <CalendarCheck className="text-blue-500" size={20} />,
  "CDO ABIERTA": <BookOpen className="text-orange-500" size={20} />,
  "Break": <Coffee className="text-amber-500" size={20} />,
  "Break 2": <Utensils className="text-amber-500" size={20} />,
  "Taller 1": <Users className="text-blue-400" size={20} />,
  "Taller 2": <Users className="text-blue-400" size={20} />,
  "Plenaria final": <Star className="text-orange-400" size={20} />,
  "Plenaria final + Santa Cena": <Star className="text-orange-400" size={20} />,
  "Cierre": <CheckCircle className="text-green-500" size={20} />
};

// Función auxiliar para generar badges según el tipo de actividad
const badgeBloque = (titulo: string): React.ReactNode => {
  if (titulo.includes("Taller")) 
    return (
      <span className="ml-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium">
        Taller
      </span>
    );
  if (titulo.includes("Plenaria")) 
    return (
      <span className="ml-2 bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-medium">
        Plenaria
      </span>
    );
  if (titulo.includes("Santa Cena")) 
    return (
      <span className="ml-2 bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-xs font-medium">
        Santa Cena
      </span>
    );
  if (titulo.includes("CDO")) 
    return (
      <span className="ml-2 bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-medium">
        Encuentro
      </span>
    );
  return null;
};

// Función para obtener el color del borde según el tipo de actividad
const getBorderColor = (titulo: string): string => {
  if (titulo.includes("Taller")) return "border-l-blue-400";
  if (titulo.includes("Plenaria")) return "border-l-orange-500";
  if (titulo.includes("Santa Cena")) return "border-l-purple-500";
  if (titulo.includes("CDO")) return "border-l-orange-400";
  if (titulo.includes("Break")) return "border-l-amber-400";
  if (titulo.includes("Recepción")) return "border-l-blue-400";
  if (titulo.includes("Cierre")) return "border-l-green-400";
  return "border-l-gray-300";
};

// Datos del cronograma (actualizado con la información proporcionada)
const cronograma = [
  {
    dia: "19 de Septiembre",
    fechaCompleta: "Sábado 19 de Septiembre, 2025",
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
        detalle: "Agustín Schiro (Grupos por edades y ministerios)", 
        duracion: "1h 30min" 
      },
      { 
        hora: "16:30", 
        titulo: "Taller 2", 
        detalle: "Griselda Alba (Grupos por interés y ministerios)", 
        duracion: "1h" 
      },
      { 
        hora: "17:30", 
        titulo: "Break 2", 
        detalle: "Merienda liviana (incluida)", 
        duracion: "1h 30min" 
      },
      { 
        hora: "19:30", 
        titulo: "Plenaria final", 
        detalle: "Valentino Nicolás (Adoración colectiva)", 
        duracion: "2h 30min" 
      },
      { 
        hora: "22:00", 
        titulo: "Cierre", 
        detalle: "Palabras finales y agradecimientos", 
        duracion: "30min" 
      }
    ]
  },
  {
    dia: "20 de Septiembre",
    fechaCompleta: "Domingo 20 de Septiembre, 2025",
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
        detalle: "Griselda Alba (Grupos por edades y ministerios)", 
        duracion: "1h 30min" 
      },
      { 
        hora: "16:30", 
        titulo: "Taller 2", 
        detalle: "Valentino Nicolás (Grupos por interés y ministerios)", 
        duracion: "1h" 
      },
      { 
        hora: "17:30", 
        titulo: "Break 2", 
        detalle: "Merienda liviana (incluida)", 
        duracion: "1h 30min" 
      },
      { 
        hora: "19:30", 
        titulo: "Plenaria final + Santa Cena", 
        detalle: "Agustín Schiro (Adoración y Santa Cena)", 
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
  const [activeDay, setActiveDay] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  // Efecto para manejar el responsive
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white" id="cronograma">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Cronograma CAJ 2025
          </h2>
          <div className="h-1 w-16 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            Descubre todo lo que tenemos preparado para estos días de avivamiento y adoración
          </p>
        </div>
        
        {/* Pestañas de días - Solo en desktop */}
        {!isMobile && (
          <div className="flex justify-center mb-8 border-b border-blue-100 max-w-4xl mx-auto">
            {cronograma.map((dia, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-6 py-3 font-medium text-sm md:text-base transition-colors relative ${
                  activeDay === index 
                    ? "text-orange-600 font-semibold" 
                    : "text-blue-600 hover:text-blue-800"
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
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transition-all hover:shadow-xl"
            >
              <div className="p-6 md:p-8">
                {isMobile && (
                  <h3 className="text-xl font-bold text-blue-900 mb-6 pb-4 border-b border-blue-100">
                    {dia.dia}
                  </h3>
                )}
                
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <svg 
                        className="h-5 w-5 text-blue-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-900">{dia.lugar}</p>
                      <p className="text-xs text-blue-600">{dia.direccion}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dia.bloques.map((bloque, index) => {
                    // → Corrección: uso de búsqueda exacta por clave en lugar de includes()
                    const Icono = 
                      (iconosBloque[bloque.titulo as TituloActividad] ?? 
                      <Clock className="text-blue-400" size={20} />);
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative pl-6 pb-6 border-l-2 ${getBorderColor(bloque.titulo)} last:border-l-0 last:pb-0 last:mb-0`}
                      >
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500 -translate-x-[calc(0.5rem+1px)] mt-1"></div>
                        
                        <div className="bg-white p-4 rounded-lg hover:bg-blue-50/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                {Icono}
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center flex-wrap">
                                  <h4 className="text-base font-semibold text-blue-900">
                                    {bloque.titulo}
                                  </h4>
                                  {badgeBloque(bloque.titulo)}
                                </div>
                                {bloque.detalle && (
                                  <p className="text-sm text-blue-800/90 mt-1">
                                    {bloque.detalle}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Clock className="mr-1 h-3 w-3" />
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
                    <button 
                      className="w-full flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-600 rounded-full font-medium hover:bg-orange-50 transition-colors"
                      onClick={() => {
                        const element = document.getElementById("entradas");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Reservar mi lugar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Botón de acción en desktop */}
        {!isMobile && (
          <div className="mt-12 text-center">
            <button 
              className="inline-flex items-center px-8 py-3 border border-orange-500 text-orange-600 font-medium rounded-full hover:bg-orange-50 transition-colors text-lg"
              onClick={() => {
                const element = document.getElementById("entradas");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <CalendarCheck className="mr-2 h-5 w-5" />
              Reservar mi lugar para el evento
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
