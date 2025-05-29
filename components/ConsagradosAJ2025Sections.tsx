"use client";
import React from "react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-700 to-orange-500 text-white py-16 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">Consagrados a Jesús</h1>
      <p className="text-xl md:text-2xl mb-6 font-medium">Un llamado a profundizar la intimidad con Cristo y vivir una cultura de adoración.</p>
      <a href="#entradas" className="inline-block bg-white text-orange-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-orange-100 transition">¡Reservá tu lugar!</a>
      <div className="mt-4 text-sm opacity-80">Cultura de adoración e intimidad · 2025</div>
    </section>
  );
}

const invitados = [
  {
    nombre: "Griselda Alba",
    rol: "Pastora en Ministerio Crecer",
    lugar: "San Luis, Argentina",
    foto: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    nombre: "Valentino Nicolás",
    rol: "Líder de jóvenes en Ministerio (...)" ,
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



export function Invitados2025() {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto" id="invitados">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Invitados 2025</h2>
      <p className="mb-8 text-gray-700">Tres voces, tres historias, una misma pasión por Jesús. Cada invitado aporta su experiencia y visión para enriquecer la diversidad de ministerios y generaciones.</p>
      <InvitadosCarousel />
    </section>
  );
}

export function Entradas() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="entradas">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Entradas</h2>
      <p className="mb-4 text-gray-700">Adquirí tu entrada y asegurá tu lugar. Pronto publicaremos los detalles de precios y categorías. ¡No te lo pierdas!</p>
      <div className="mb-4 bg-orange-100 rounded-lg flex items-center justify-center h-40 text-orange-400 italic">
        (Aquí irá la imagen de la hoja de entradas)
      </div>
      <a href="#" className="inline-block bg-orange-700 text-white px-8 py-3 rounded-full shadow hover:bg-orange-800 transition">Consultar precios</a>
    </section>
  );
}

export function NuestroOrigen() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="origen">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Nuestro origen</h2>
      <p className="mb-4 text-gray-700">CAJ se inició en el año 2022 como una alternativa a las fiestas de primavera en Monte Hermoso, pero Dios tenía otros planes. Ese mismo año, nos convenció de que esto era de su corazón, transformó nuestra visión y nos llevó a ser un congreso interdenominacional para fomentar la comunión de la iglesia de Cristo en nuestra ciudad.</p>
      <p className="mb-4 text-gray-700">Actualmente, contamos con el apoyo de pastores de Bahía Blanca y un equipo comprometido a obedecer lo que Dios desea. ¿Qué significa ser consagrados a Jesús? Hemos sido nombrados reyes y sacerdotes (<span className="font-semibold">Apocalipsis 1:6</span>), apartados para Él. Queremos que esto arda en nuestra ciudad: vidas que eligen vivir para su amado y anhelan agradar a Dios.</p>
    </section>
  );
}

export function NuestraVision() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="vision">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Nuestra visión</h2>
      <p className="mb-4 text-gray-700">Por mucho tiempo, el cuerpo de Cristo estuvo fracturado: divisiones, malos tratos, competencia. "Consagrados a Jesús" viene a romper con esas estructuras, manifestando la unión dada por el Espíritu (<span className="font-semibold">Efesios 4:3-6</span>), enseñando a poner la mirada en Jesús y echar raíces donde Dios nos puso.</p>
      <p className="mb-4 text-gray-700">Nuestro mayor deseo es ayudar a la iglesia a ser una novia pura y unida por Cristo, la cabeza.</p>
    </section>
  );
}

export function Lema2025() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="lema">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Lema 2025: Cultura de adoración e intimidad</h2>
      <p className="mb-4 text-gray-700">La intimidad es fundamental para quienes desean establecer el reino de Dios en la tierra. Este año queremos profundizar en la intimidad personal con Cristo y también en comunidad. Seamos vidas que adoran no solo con música, sino a través de todo lo que somos.</p>
    </section>
  );
}

export function TestimoniosBreves() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="testimonios">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Testimonios breves</h2>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center text-orange-400 italic">
        (Próximamente, 3-5 testimonios reales de asistentes anteriores)
      </div>
    </section>
  );
}

const iconosBloque = {
  "Recepción": <CalendarCheck className="text-orange-400" size={20} />, 
  "CDO ABIERTA": <BookOpen className="text-orange-400" size={20} />, 
  "Break": <Coffee className="text-orange-400" size={20} />, 
  "Break 2": <Utensils className="text-orange-400" size={20} />, 
  "Taller 1": <Users className="text-orange-400" size={20} />, 
  "Taller 2": <Users className="text-orange-400" size={20} />, 
  "Plenaria final": <Star className="text-orange-500" size={20} />, 
  "Plenaria final + Santa Cena": <Star className="text-orange-500" size={20} />, 
  "Cierre": <CheckCircle className="text-orange-700" size={20} />
};

const badgeBloque = (titulo) => {
  if (titulo.includes("Taller")) return <span className="ml-2 bg-orange-100 text-orange-700 rounded px-2 py-0.5 text-xs font-bold">Taller</span>;
  if (titulo.includes("Plenaria")) return <span className="ml-2 bg-orange-200 text-orange-700 rounded px-2 py-0.5 text-xs font-bold">Plenaria</span>;
  if (titulo.includes("Santa Cena")) return <span className="ml-2 bg-orange-300 text-orange-800 rounded px-2 py-0.5 text-xs font-bold">Santa Cena</span>;
  return null;
};

const cronograma = [
  {
    dia: "19 de Septiembre",
    bloques: [
      { hora: "9:30", titulo: "Recepción" },
      { hora: "10:00 - 12:30", titulo: "CDO ABIERTA" },
      { hora: "12:30 - 15:00", titulo: "Break" },
      { hora: "15:00 - 16:30", titulo: "Taller 1", detalle: "Agustín Schiro" },
      { hora: "16:30 - 17:30", titulo: "Taller 2", detalle: "Griselda Alba" },
      { hora: "17:30 - 19:00", titulo: "Break 2" },
      { hora: "19:30", titulo: "Plenaria final", detalle: "Valentino Nicolás" },
      { hora: "22:00", titulo: "Cierre" },
    ]
  },
  {
    dia: "20 de Septiembre",
    bloques: [
      { hora: "9:30", titulo: "Recepción" },
      { hora: "10:00 - 12:30", titulo: "CDO ABIERTA" },
      { hora: "12:30 - 15:00", titulo: "Break" },
      { hora: "15:00 - 16:30", titulo: "Taller 1", detalle: "Griselda Alba" },
      { hora: "16:30 - 17:30", titulo: "Taller 2", detalle: "Valentino Nicolás" },
      { hora: "17:30 - 19:00", titulo: "Break 2" },
      { hora: "19:30", titulo: "Plenaria final + Santa Cena", detalle: "Agustín Schiro" },
      { hora: "22:00", titulo: "Cierre" },
    ]
  }
];

export function Cronograma() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto" id="cronograma">
      <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">Cronograma CAJ 2025</h2>
      <div className="flex flex-col gap-8">
        {cronograma.map((dia, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-orange-50 via-white to-yellow-100 rounded-2xl shadow-lg p-6 border-t-4 border-orange-400 animate-fadein"
          >
            <h3 className="text-2xl font-semibold text-orange-700 mb-6 flex items-center gap-2">
              <CalendarCheck className="text-orange-400" size={28} />
              {dia.dia}
            </h3>
            <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-y-2 justify-center">
              {dia.bloques.map((b, j) => (
                <div
                  key={j}
                  className="col-span-1 sm:col-span-12 grid grid-cols-3 items-center group rounded-lg transition hover:bg-orange-50 hover:shadow-md p-2"
                >
                  {/* Hora */}
                  <div className="col-span-1 text-right font-mono text-orange-700 text-lg font-bold flex items-center gap-1 justify-end pr-2">
                    <Clock className="inline-block mr-1 text-orange-300" size={18} />
                    {b.hora}hs
                  </div>
                  {/* Actividad */}
                  <div className="col-span-1 font-semibold text-gray-900 flex items-center justify-center">
                    {iconosBloque[b.titulo] || <Star className="text-orange-300" size={20} />}
                    <span className="ml-2">{b.titulo}</span>
                    {badgeBloque(b.titulo)}
                  </div>
                  {/* Detalle/Disertante */}
                  <div className="col-span-1 flex justify-start pl-2">
                    {b.detalle && <span className="block text-sm text-orange-500 font-medium">{b.detalle}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


import { ChevronDown, ChevronLeft, ChevronRight, Clock, Coffee, Users, Star, BookOpen, CheckCircle, Utensils, CalendarCheck } from "lucide-react";

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

