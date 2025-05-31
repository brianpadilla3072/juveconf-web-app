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
      <p className="text-blue-800/90">No contamos con devoluciones, pero podés cambiar la titularidad. Para cualquier inconveniente, comunicate al <a href="https://wa.me/5492914326563" className="text-blue-700 font-medium hover:underline hover:text-blue-800 transition-colors">+54 9 291 432 6563</a>.</p>
    )
  },
];

export function PreguntasFrecuentes() {
  const [open, setOpen] = React.useState<number | null>(null);
  
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">Preguntas frecuentes</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-orange-400 rounded-full mx-auto"></div>
        <p className="text-blue-800/90 mt-6 max-w-2xl mx-auto">
          Aquí encontrarás respuestas a las dudas más comunes sobre nuestro evento.
          Si necesitas más información, no dudes en contactarnos.
        </p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden transition-all duration-300
                     hover:shadow-md hover:border-blue-200"
          >
            <button
              className={`w-full text-left flex items-center justify-between font-semibold text-blue-900 p-5
                        transition-colors ${open === idx ? 'bg-blue-50' : 'hover:bg-blue-50'}
                        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 rounded-lg`}
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <span className="text-lg">{faq.pregunta}</span>
              <div className={`p-1 rounded-full transition-colors ${open === idx ? 'bg-blue-100 text-blue-700' : 'text-blue-500'}`}>
                <ChevronDown
                  className={`transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`}
                  size={22}
                  strokeWidth={2.2}
                />
              </div>
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-5 pt-5 pb-5 text-blue-800">{faq.respuesta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
