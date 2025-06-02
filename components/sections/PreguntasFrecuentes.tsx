"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import faqBackground from "../../public/images/hero/hero-background-green.jpeg"; // Cambialo si hace falta

const faqs = [
  {
    pregunta: "¿Qué debo llevar?",
    respuesta: (
      <ul className="list-disc pl-6 text-gray-700 mb-2">
        <li>
          Almuerzo y merienda (no hay buffet).{" "}
          <span className="italic">
            ¡Traé tu tupper como un verdadero peregrino moderno!
          </span>
        </li>
        <li>Equipo de mate y termo (habrá agua disponible).</li>
        <li>Biblia y algo para tomar notas.</li>
        <li>Instrumentos musicales para los breaks (opcional).</li>
      </ul>
    ),
  },
  {
    pregunta: "¿Puedo cancelar mi entrada?",
    respuesta: (
      <div className="text-white/95">
        No contamos con devoluciones, pero podés cambiar la titularidad. Para
        cualquier inconveniente, comunicate al{" "}
        <a
          href="https://wa.me/5492914326563"
          className="text-orange-300 font-medium hover:underline hover:text-orange-200 transition-colors"
        >
           +54 9 291 432 6563
        </a>
        .
      </div>
    ),
  },
];

export function PreguntasFrecuentes() {
  const [open, setOpen] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const faqRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!faqRef.current) return;

      const rect = faqRef.current.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(isInView);

      if (isInView) {
        const scrollPosition = window.scrollY;
        const elementPosition = rect.top + scrollPosition;
        const parallax = (scrollPosition - elementPosition) * 0.3;
        setScrollY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={faqRef} className="relative py-24 px-4 overflow-hidden" id="faq">
      {/* Fondo Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `url(${faqBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
          inset: "-123px"
        }}
      />

      
      {/* Gradiente oscuro encima del fondo */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.81), rgba(0, 0, 0, 0.34))",
          transform: isVisible ? `translate3d(0, ${scrollY * 0.3}px, 0)` : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
          inset: '-123px'
        }}
      />

      {/* Contenido */}
      <div className="relative z-20 max-w-4xl mx-auto bg-piedra/10 backdrop-blur-[6px] rounded-2xl shadow-xl border border-white/30 p-6 md:p-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Preguntas frecuentes
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mx-auto"></div>
          <p className="text-white/80 mt-6 max-w-2xl mx-auto">
            Aquí encontrarás respuestas a las dudas más comunes sobre nuestro evento.
            Si necesitas más información, no dudes en contactarnos.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-piedra/20 backdrop-blur-sm rounded-xl shadow-md border border-piedra/30 transition-all duration-300 hover:bg-piedra/30"
            >
              <button
                className={`w-full text-left flex items-center justify-between font-semibold text-white p-5
                transition-colors ${open === idx ? "bg-piedra/30" : "hover:bg-piedra/20"}
                focus:outline-none focus:ring-2 focus:ring-piedra/50 focus:ring-offset-2 rounded-lg`}
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={`faq-panel-${idx}`}
              >
                <span className="text-lg">{faq.pregunta}</span>
                <div
                  className={`p-1 rounded-full transition-colors ${
                    open === idx ? "bg-piedra/20 text-white" : "text-piedra/10"
                  }`}
                >
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      open === idx ? "rotate-180" : ""
                    }`}
                    size={22}
                    strokeWidth={2.2}
                  />
                </div>
              </button>
              <div
                id={`faq-panel-${idx}`}
                className={`overflow-hidden transition-all duration-300 ${
                  open === idx ? "max-h-96 opacity-60" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pt-4 pb-6 text-white/95">
                {typeof faq.respuesta === 'string' ? (
                  <p className="text-white/95">{faq.respuesta}</p>
                ) : (
                  <div className="[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul>li]:text-white/95 [&>ul>li]:leading-relaxed">
                    {faq.respuesta}
                  </div>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
