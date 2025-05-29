"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

// Datos separados para facilitar mantenimiento
const faqs = [
  {
    pregunta: "¿Qué debo llevar?",
    respuesta: (
      <ul className="list-disc pl-6 text-gray-700 mb-2">
        <li>Almuerzo y merienda (no hay buffet). <span className="italic">¡Traé tu tupper como un verdadero peregrino moderno!</span></li>
        <li>Equipo de mate y termo (habrá agua disponible).</li>
        <li>Biblia y algo para tomar notas.</li>
        <li>Instrumentos musicales para los breaks (opcional).</li>
      </ul>
    )
  },
  {
    pregunta: "¿Puedo cancelar mi entrada?",
    respuesta: (
      <p className="text-gray-700">No contamos con devoluciones, pero podés cambiar la titularidad. Para cualquier inconveniente, comunicate al <a href="https://wa.me/5492914326563" className="text-orange-700 underline">+54 9 291 432 6563</a>.</p>
    )
  },
];

export function PreguntasFrecuentes() {
  const [open, setOpen] = React.useState<number | null>(null);
  
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="faq">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Preguntas frecuentes</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-orange-200 pb-2">
            <button
              className={
                `w-full text-left flex items-center justify-between font-semibold text-orange-700 py-2 rounded transition
                ${open === idx ? 'bg-orange-50' : 'hover:bg-orange-50'}
                focus:outline-none`
              }
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <span>{faq.pregunta}</span>
              <ChevronDown
                className={`ml-2 transition-transform duration-200 ${open === idx ? 'rotate-180' : ''}`}
                size={22}
                strokeWidth={2.2}
              />
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="pl-2 pt-2">{faq.respuesta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
