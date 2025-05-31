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
    <section className="mt-1 py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Nuestros Invitados</h2>
          <div className="h-1 w-16 bg-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            Conoce a los ministros y líderes que nos acompañarán en este tiempo de avivamiento y adoración.
          </p>
        </div>

        <div className="relative mt-16 w-full max-w-6xl mx-auto" style={{marginTop:'3rem', paddingTop:'1.5rem'}}>
          {invitados.length > visible && (
            <button 
              onClick={prev} 
              disabled={start===0}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all ${start===0?'opacity-50 cursor-not-allowed':'opacity-100 hover:scale-110'}`}
              aria-label="Anterior"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
          )}
          
          <div className="flex gap-6 md:gap-8 mt-6 justify-center px-10" >
            {invitados.slice(start, start+visible).map((inv) => (
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
                  <div className="text-sm text-blue-900/70">{inv.lugar}</div>
                </div>
              </div>
            ))}
          </div>
          
          {invitados.length > visible && (
            <button 
              onClick={next} 
              disabled={start===maxStart}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all ${start===maxStart?'opacity-50 cursor-not-allowed':'opacity-100 hover:scale-110'}`}
              aria-label="Siguiente"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          )}
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(invitados.length / visible) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i * visible)}
              className={`w-3 h-3 rounded-full transition-all ${i * visible === start ? 'bg-orange-500 w-8' : 'bg-blue-200'}`}
              aria-label={`Ir a la página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
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
