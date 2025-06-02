"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import lemaBackground from "../../public/images/hero/hero-background-green.jpeg"; // Asegurate que exista

export function NuestroOrigen() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (isInView) {
        setIsVisible(true);
        const scrollTop = window.scrollY;
        const offsetTop = sectionRef.current.offsetTop;
        const parallax = (scrollTop - offsetTop) * 0.3;
        setScrollY(parallax);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-4 overflow-hidden"
      id="nuestro-origen"
    >
      {/* Fondo Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${lemaBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
          inset: '-123px'
        }}
      />

      {/* Capa de oscurecimiento suave */}
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
      <div className="relative z-20 max-w-5xl mx-auto bg-gray-700/30 backdrop-blur-[6px] rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">
        <div className="inline-block mb-6">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
            Nuestro Origen
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Nuestra Historia
        </h2>

        <div className="h-1 w-20 bg-orange-500 mb-8 rounded-full"></div>

        <div className="prose prose-lg max-w-none text-white/80">
          <p className="text-lg leading-relaxed mb-6">
            <span className="text-orange-400 font-semibold">CAJ</span> se inició en el año 2022 como una alternativa a las fiestas de primavera en Monte Hermoso, pero Dios tenía otros planes. Ese mismo año, nos convenció de que esto era de su corazón, transformó nuestra visión y nos llevó a ser un congreso interdenominacional para fomentar la comunión de la iglesia de Cristo en nuestra ciudad.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            Actualmente, contamos con el apoyo de pastores de Bahía Blanca y un equipo comprometido a obedecer lo que Dios desea. ¿Qué significa ser consagrados a Jesús? Hemos sido nombrados <span className="font-semibold text-white">reyes y sacerdotes</span> (<span className="text-orange-400 font-medium">Apocalipsis 1:6</span>), apartados para Él. Queremos que esto arda en nuestra ciudad: vidas que eligen vivir para su amado y anhelan agradar a Dios.
          </p>

          <div className="mt-10 pt-8 border-t border-white/20">
            <blockquote className="relative pl-6 border-l-4 border-orange-500 italic text-white/80">
              <p className="mb-3 text-lg">
                "Y nos ha hecho reyes y sacerdotes para Dios, su Padre; a él sea gloria e imperio por los siglos de los siglos. Amén."
              </p>
              <footer className="text-right font-medium text-white/90">
                — <cite>Apocalipsis 1:6 (RVR1960)</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
