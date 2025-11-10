"use client";
import React, { useEffect, useRef, useState } from "react";
import lemaBackground from "../../public/images/hero/hero-background-green.jpeg"; // Asegurate que exista la imagen

export function Lema2025() {
  const [scrollY, setScrollY] = useState(0);
  const lemaRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!lemaRef.current) return;

      const rect = lemaRef.current.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(isInView);

      if (isInView) {
        const scrollPosition = window.scrollY;
        const elementPosition = rect.top + scrollPosition;
        const parallax = (scrollPosition - elementPosition) * 0.4;
        setScrollY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={lemaRef} className="relative py-32 px-4 overflow-hidden" id="lema">
      {/* Fondo Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `url(${lemaBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isVisible ? `translate3d(0, ${scrollY}px, 0)` : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
          inset: '-123px'
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
      <div className="relative z-20 max-w-5xl mx-auto bg-gray-700/30 backdrop-blur-[6px] rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">
        <div className="inline-block mb-4">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
            Lema 2025
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Cultura de adoración e intimidad
        </h2>

        <div className="h-1 w-20 bg-violet-500 mb-6 rounded-full"></div>

        <p className="text-lg text-white/70 leading-relaxed mb-6 max-w-3xl">
          La intimidad es fundamental para todos aquellos que desean establecer el Reino de Dios en la tierra. Por eso, este año queremos profundizar en una intimidad personal con Cristo, pero también en comunidad. Anhelamos ser vidas que adoren no solo con música, sino con todo lo que somos.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          {["#Adoración", "#Intimidad", "#Comunidad"].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white/90 hover:bg-white/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
