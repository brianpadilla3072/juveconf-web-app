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
  
  
];

export default function InvitadosPage() {
  return (
    <section className="pt-24 pb-12 px-4 md:px-8 w-full bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl mb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Nuestros Invitados</h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-800/80 max-w-2xl mx-auto">
            Conoce a los increíbles ministros y líderes que nos acompañan en esta edición
          </p>
        </div>
      </div>
      <br />
      <div className="w-full mt-16 pt-16 flex justify-center"  >
        <div className="w-full max-w-7xl space-y-32" >
        {invitadosPorAnio.map((anio) => (
          <div key={anio.anio} className="py-16 first:pt-0 last:pb-0">
            <div className="relative mb-24">
              <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-center mb-16">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">
                  CAJ {anio.anio}
                </span>
              </h2>
            </div>
            
            <br />
            <div className="flex gap-10 md:gap-12 justify-center px-10 mt-15 pt-15" >
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
