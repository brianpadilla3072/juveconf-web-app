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
    <section className="py-10 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <h1 className="text-4xl font-bold text-orange-700 mb-12 text-center">Invitados por Año</h1>
      <div className="space-y-16">
        {invitadosPorAnio.map((anio) => (
          <div key={anio.anio} className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-8 border-b border-orange-200 pb-2 text-center">
              {anio.anio}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 justify-items-center">
              {anio.invitados.map((inv) => (
                <div
                  key={inv.nombre}
                  className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500 w-full max-w-xs flex flex-col items-center hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={inv.foto}
                    alt={inv.nombre}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-orange-200"
                  />
                  <h3 className="font-bold text-lg text-orange-700 mb-1 text-center">{inv.nombre}</h3>
                  <div className="text-sm text-gray-600 mb-1 text-center">{inv.rol}</div>
                  <div className="text-xs text-gray-500 text-center">{inv.ciudad}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
