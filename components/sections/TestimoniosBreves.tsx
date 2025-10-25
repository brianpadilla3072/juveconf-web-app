"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonios = [
  {
    id: 1,
    nombre: "María G.",
    rol: "Asistente CAJ 2023",
    contenido: "Fue un antes y un después en mi vida espiritual. La presencia de Dios se sintió de una manera poderosa y mi relación con Él se profundizó como nunca antes.",
    foto: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    nombre: "Juan P.",
    rol: "Voluntario",
    contenido: "Servir en CAJ transformó mi perspectiva de la adoración. Ver a tantas iglesias unidas fue un testimonio vivo de lo que Dios quiere hacer en nuestra ciudad.",
    foto: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 3,
    nombre: "Ana M.",
    rol: "Líder de alabanza",
    contenido: "Tocar en Consagrados a Jesús fue una experiencia única. El nivel de unidad y amor entre los músicos de diferentes iglesias fue increíble. ¡Dios se movió poderosamente!",
    foto: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    nombre: "Carlos R.",
    rol: "Pastor",
    contenido: "Como pastor, ver a mis jóvenes conectarse con Dios de esta manera me llena de esperanza. CAJ es un faro en nuestra ciudad que sigue brillando todo el año.",
    foto: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

export function TestimoniosBreves() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemsToShow = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, testimonios.length - itemsToShow);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused, maxIndex]);

  const nextTestimonio = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const prevTestimonio = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToTestimonio = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgxMDIsMTI2LDIzNCwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Testimonios</h2>
          <div className="h-1 w-16 bg-violet-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-900/80 max-w-2xl mx-auto">
            Lo que Dios ha hecho en las vidas de quienes han sido parte de Consagrados a Jesús
          </p>
        </div>

        <div 
          className="relative w-full max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
            >
              {testimonios.map((testimonio, index) => (
                <div 
                  key={testimonio.id} 
                  className={`flex-shrink-0 w-full ${itemsToShow === 2 ? 'md:w-1/2' : 'w-full'} px-4`}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 h-full border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-200">
                          <img 
                            src={testimonio.foto} 
                            alt={testimonio.nombre} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-violet-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-blue-900/90 italic mb-4">"{testimonio.contenido}"</p>
                        <div className="text-right">
                          <div className="font-semibold text-blue-900">{testimonio.nombre}</div>
                          <div className="text-sm text-blue-600">{testimonio.rol}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonios.length > itemsToShow && (
            <>
              <button 
                onClick={prevTestimonio}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button 
                onClick={nextTestimonio}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-900 rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonio(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index * itemsToShow === currentIndex 
                  ? 'w-8 bg-violet-500' 
                  : 'w-3 bg-blue-200 hover:bg-blue-300'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center px-6 py-3 border border-violet-500 text-violet-600 font-medium rounded-full hover:bg-violet-50 transition-colors"
            onClick={() => {
              // Aquí podrías agregar lógica para mostrar más testimonios o abrir un modal
              const element = document.getElementById('contacto');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Comparte tu testimonio
            <ChevronRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
