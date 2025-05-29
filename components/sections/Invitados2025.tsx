"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Datos de invitados separados para mantenimiento más fácil
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
  },
  {
    nombre: "Sofía Torres",
    rol: "Líder de alabanza",
    lugar: "Rosario, Argentina",
    foto: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    nombre: "Juan Pérez",
    rol: "Pastor invitado",
    lugar: "Buenos Aires, Argentina",
    foto: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

// Componente para el carrusel de invitados
function InvitadosCarousel() {
  const [start, setStart] = React.useState(0);
  // Responsive: 1 en mobile, 2 en md, 3 en lg+
  const [visible, setVisible] = React.useState(3);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxStart = Math.max(0, invitados.length - visible);
  function prev() { setStart((s) => Math.max(0, s - 1)); }
  function next() { setStart((s) => Math.min(maxStart, s + 1)); }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-4xl">
        {invitados.length > visible && (
          <button onClick={prev} disabled={start===0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-orange-200 hover:bg-orange-300 text-orange-700 rounded-full p-2 shadow z-10 transition ${start===0?'opacity-50 cursor-not-allowed':'opacity-100'}`}
            aria-label="Anterior"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>
        )}
        <div className="flex gap-6 md:gap-8 justify-center px-10">
          {invitados.slice(start, start+visible).map((inv) => (
            <div
              key={inv.nombre}
              className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500 min-w-[260px] max-w-xs flex-shrink-0 flex flex-col items-center"
            >
              <img
                src={inv.foto}
                alt={inv.nombre}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-orange-200"
              />
              <h3 className="font-bold text-lg text-orange-700">{inv.nombre}</h3>
              <div className="text-sm text-gray-600">{inv.rol}</div>
              <div className="text-xs text-gray-500">{inv.lugar}</div>
            </div>
          ))}
        </div>
        {invitados.length > visible && (
          <button onClick={next} disabled={start===maxStart}
            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-orange-200 hover:bg-orange-300 text-orange-700 rounded-full p-2 shadow z-10 transition ${start===maxStart?'opacity-50 cursor-not-allowed':'opacity-100'}`}
            aria-label="Siguiente"
          >
            <ChevronRight size={22} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}

// Componente principal exportado
export function Invitados2025() {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto" id="invitados">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Invitados 2025</h2>
      <p className="mb-8 text-gray-700">Tres voces, tres historias, una misma pasión por Jesús. Cada invitado aporta su experiencia y visión para enriquecer la diversidad de ministerios y generaciones.</p>
      <InvitadosCarousel />
    </section>
  );
}
