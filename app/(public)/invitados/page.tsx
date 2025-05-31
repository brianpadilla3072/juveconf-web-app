"use client";
import React from "react";

const invitadosPorAnio = [
  {
    anio: 2025,
    invitados: [
      {
        nombre: "Griselda Alba",
        rol: "Pastora en Ministerio Crecer",
        ciudad: "San Luis, Argentina",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        nombre: "Valentino Nicolás",
        rol: "Pastor y Músico",
        ciudad: "Córdoba, Argentina",
        foto: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        nombre: "María Paz Díaz",
        rol: "Líder Juvenil",
        ciudad: "Mendoza, Argentina",
        foto: "https://randomuser.me/api/portraits/women/65.jpg",
      },
    ],
  },
  {
    anio: 2024,
    invitados: [
      {
        nombre: "Juan Pérez",
        rol: "Evangelista",
        ciudad: "Buenos Aires, Argentina",
        foto: "https://randomuser.me/api/portraits/men/11.jpg",
      },
      {
        nombre: "Lucía Gómez",
        rol: "Conferencista",
        ciudad: "Rosario, Argentina",
        foto: "https://randomuser.me/api/portraits/women/22.jpg",
      },
    ],
  },
];

export default function InvitadosPage() {
  return (
    <section className="pt-24 pb-12 px-4 md:px-8 w-full bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Nuestros Invitados</h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-800/80 max-w-2xl mx-auto">
            Conoce a los increíbles ministros y líderes que nos acompañan en esta edición
          </p>
        </div>
      </div>
      
      <div className="w-full flex justify-center mt-8">
        <div className="w-full max-w-7xl space-y-20">
        {invitadosPorAnio.map((anio) => (
          <div key={anio.anio} className="mb-16">
            <div className="relative mb-10">
              <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-center mt-12 mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500 mb-2">
                  CAJ {anio.anio}
                </span>
              </h2>
            </div>
            
            <div className="flex gap-6 md:gap-8 justify-center  px-10">
              {anio.invitados.map((inv) => (
                <div
                  key={inv.nombre}
                  className="bg-white rounded-xl shadow-md overflow-visible border border-blue-100 min-w-[280px] max-w-xs flex-shrink-0 flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
                  style={{ zIndex: 1 }}
                >
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white p-1" style={{ zIndex: 1000 }}>
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={inv.foto}
                        alt={inv.nombre}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ zIndex: 1001 }}
                      />
                    </div>
                  </div>
                  <div className="p-6 pt-16 mt-4 text-center">
                    <h3 className="font-bold text-xl text-blue-900 mb-1">{inv.nombre}</h3>
                    <div className="text-orange-600 font-medium mb-2">{inv.rol}</div>
                    <div className="text-sm text-blue-900/70">{inv.ciudad}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
}
