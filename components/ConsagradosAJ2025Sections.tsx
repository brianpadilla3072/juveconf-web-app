/**
 * ConsagradosAJ2025Sections.tsx
 * Archivo de re-exportación de todas las secciones del congreso
 * para mantener la compatibilidad con el código existente.
 */

// Re-exportamos todos los componentes desde sus archivos individuales
export { HeroSection } from './sections/HeroSection';
export { Lema2025 } from './sections/Lema2025';
export { Invitados2025 } from './sections/Invitados2025';
export { NuestroOrigen } from './sections/NuestroOrigen';
export { NuestraVision } from './sections/NuestraVision';
export { PreguntasFrecuentes } from './sections/PreguntasFrecuentes';
export { CronogramaEventos as Cronograma } from './sections/CronogramaEventos';

// Componente de testimonios (pendiente de mover a su propio archivo)
export function TestimoniosBreves() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="testimonios">
      <h2 className="text-3xl font-bold text-violet-700 mb-6">Testimonios breves</h2>
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-8 text-center text-violet-400 italic">
        (Próximamente, 3-5 testimonios reales de asistentes anteriores)
      </div>
    </section>
  );
}

// Componente de entradas (pendiente de mover a su propio archivo)
export function Entradas() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="entradas">
      <h2 className="text-3xl font-bold text-violet-700 mb-6">Entradas</h2>
      <p className="mb-4 text-gray-700">Adquirí tu entrada y asegurá tu lugar. Pronto publicaremos los detalles de precios y categorías. ¡No te lo pierdas!</p>
      <div className="mb-4 bg-violet-100 rounded-lg flex items-center justify-center h-40 text-violet-400 italic">
        (Aquí irá la imagen de la hoja de entradas)
      </div>
      <a href="#" className="inline-block bg-violet-700 text-white px-8 py-3 rounded-full shadow hover:bg-violet-800 transition">Consultar precios</a>
    </section>
  );
}
