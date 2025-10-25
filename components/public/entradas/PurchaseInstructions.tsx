"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import heroBackground from '../../../public/images/hero/hero-background.webp';

export default function PurchaseInstructions() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(inView);
      if (inView) {
        const scrollPosition = window.scrollY;
        const elementTop = rect.top + scrollPosition;
        const parallaxValue = (scrollPosition - elementTop) * 0.5;
        setScrollY(parallaxValue);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[80vh]"
      style={{
        backgroundImage: `url(${heroBackground.src})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Gradiente overlay con parallax */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(22, 22, 22, 0.4), rgba(15, 15, 15, 0.07))",
          transform: isVisible
            ? `translate3d(0, ${scrollY * 0.3}px, 0)`
            : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-20 py-16 px-4 max-h-[90vh] overflow-auto">
        <div className="rounded-xl bg-piedra/10 backdrop-blur-[6px] mx-auto max-w-6xl border  border-white/30 shadow-lg overflow-hidden">
          <div className=" text-white p-2">
            <div className="flex flex-col m-auto justify-center items-center space-y-2 p-8 pb-4">
              <div className="tracking-tight m-auto w-full justify-center items-center text-2xl md:text-3xl font-bold text-center text-white">
                Compra de Entradas
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-violet-400 to-violet-500 rounded-full my-3" />

              <div className="text-sm text-center text-white/60">
                Para adquirir tus entradas, sigue estos pasos:
              </div>
            </div>
          </div>
          <div className="p-8 pt-6 space-y-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold  text-white mb-2">1. Contacto</h3>
                <p className="text-white/60 mb-4">
                  Envía un mensaje al WhatsApp:{" "}
                  <a
                    href="https://wa.me/5492914326563" className="text-violet-500 hover:text-violet-400"
                  >
                    +54 9 291 432 6563                  </a>
                </p>
                <div className="bg-piedra-100/30 p-4 rounded-lg backdrop-blur-lg bg-white/10">
                  <p className="text-sm text-neutral-300">
                    Expresa tu interés en adquirir entradas y proporciona tus datos básicos
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold  text-white mb-2">2. Pago</h3>
                <p className=" text-white/60 mb-4">Realiza la transferencia a la cuenta:</p>
                <div className="bg-piedra-100/30 p-4 rounded-lg backdrop-blur-lg bg-white/10">
                  <p className="text-sm font-medium text-neutral-300">consagradosajesus</p>
                </div>
              </div>
              <div className="text-center">
                <Button
                  className="inline-flex items-center px-8 py-3 border border-white/30 text-white rounded-full font-medium bg-black/5 hover:bg-black/10 transition-all duration-300 text-lg">
                  <a href="https://wa.me/5492914326563" className="flex items-center space-x-2">
                    <MessageSquare className="text-white w-5 h-5 mr-2" />
                    <span>¡Contactar por WhatsApp!</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
