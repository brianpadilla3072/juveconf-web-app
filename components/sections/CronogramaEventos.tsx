"use client";
import React from "react";
import { ChevronDown, Clock, Coffee, Users, Star, BookOpen, CheckCircle, Utensils, CalendarCheck } from "lucide-react";

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
  "CDO ABIERTA": <BookOpen className="text-orange-400" size={20} />, 
  "Break": <Coffee className="text-orange-400" size={20} />, 
  "Break 2": <Utensils className="text-orange-400" size={20} />, 
  "Taller 1": <Users className="text-orange-400" size={20} />, 
  "Taller 2": <Users className="text-orange-400" size={20} />, 
  "Plenaria final": <Star className="text-orange-500" size={20} />, 
  "Plenaria final + Santa Cena": <Star className="text-orange-500" size={20} />, 
  "Cierre": <CheckCircle className="text-orange-700" size={20} />
};

// Función auxiliar para generar badges según el tipo de actividad
const badgeBloque = (titulo: string): React.ReactNode => {
  if (titulo.includes("Taller")) return <span className="ml-2 bg-orange-100 text-orange-700 rounded px-2 py-0.5 text-xs font-bold">Taller</span>;
  if (titulo.includes("Plenaria")) return <span className="ml-2 bg-orange-200 text-orange-700 rounded px-2 py-0.5 text-xs font-bold">Plenaria</span>;
  if (titulo.includes("Santa Cena")) return <span className="ml-2 bg-orange-300 text-orange-800 rounded px-2 py-0.5 text-xs font-bold">Santa Cena</span>;
  return null;
};

// Datos del cronograma
const cronograma = [
  {
    dia: "19 de Septiembre",
    bloques: [
      { hora: "9:30", titulo: "Recepción" },
      { hora: "10:00", titulo: "CDO ABIERTA", detalle: "Alabanza + Palabra" },
      { hora: "12:30", titulo: "Break" },
      { hora: "14:30", titulo: "Taller 1", detalle: "Grupos por edades" },
      { hora: "16:00", titulo: "Break 2" },
      { hora: "16:30", titulo: "Taller 2", detalle: "Grupos por interés" },
      { hora: "18:00", titulo: "Plenaria final", detalle: "Adoración colectiva" },
      { hora: "19:30", titulo: "Cierre", detalle: "Día 1" }
    ]
  },
  {
    dia: "20 de Septiembre",
    bloques: [
      { hora: "9:30", titulo: "Recepción" },
      { hora: "10:00", titulo: "CDO ABIERTA", detalle: "Alabanza + Palabra" },
      { hora: "12:30", titulo: "Break" },
      { hora: "14:30", titulo: "Taller 1", detalle: "Grupos por edades" },
      { hora: "16:00", titulo: "Break 2" },
      { hora: "16:30", titulo: "Taller 2", detalle: "Grupos por interés" },
      { hora: "18:00", titulo: "Plenaria final + Santa Cena", detalle: "Adoración colectiva" },
      { hora: "19:30", titulo: "Cierre", detalle: "¡Hasta 2026!" }
    ]
  }
];

export function CronogramaEventos() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="cronograma">
      <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">Cronograma CAJ 2025</h2>
      <div className="flex flex-col gap-8">
        {cronograma.map((dia, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-orange-50 via-white to-yellow-100 rounded-2xl shadow-lg p-6 border-t-4 border-orange-400 animate-fadein"
          >
            <h3 className="text-2xl font-semibold text-orange-700 mb-6 flex items-center gap-2">
              <CalendarCheck className="text-orange-400" size={28} />
              {dia.dia}
            </h3>
            <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-2 sm:gap-y-2 gap-x-0 sm:gap-x-4">
              {dia.bloques.map((b, j) => (
                <div
                  key={j}
                  className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center group rounded-lg transition hover:bg-orange-50 hover:shadow-md p-2 sm:p-2 px-2 py-3"
                >
                  {/* Hora */}
                  <div className="col-span-1 text-left sm:text-right font-mono text-orange-700 text-lg font-bold flex items-center gap-1 sm:justify-end pr-0 sm:pr-2 mb-1 sm:mb-0">
                    <Clock className="inline-block mr-1 text-orange-300" size={18} />
                    {b.hora}hs
                  </div>
                  {/* Actividad */}
                  <div className="col-span-1 font-semibold text-gray-900 flex items-center justify-start sm:justify-center mb-1 sm:mb-0">
                    {((titulo) => {
                      // Verificar si el título es una clave válida de iconosBloque
                      return Object.keys(iconosBloque).includes(titulo) 
                        ? iconosBloque[titulo as TituloActividad] 
                        : <Star className="text-orange-300" size={20} />
                    })(b.titulo)}
                    <span className="ml-2">{b.titulo}</span>
                    {badgeBloque(b.titulo)}
                  </div>
                  {/* Detalle/Disertante */}
                  <div className="col-span-1 flex justify-start pl-0 sm:pl-2">
                    {b.detalle && <span className="block text-sm text-orange-500 font-medium">{b.detalle}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
