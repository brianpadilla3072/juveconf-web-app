"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Flame } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import donationBackground from "../../../public/images/hero/hero-background.jpg";

export default function DonationCard() {
  // Estados para copiar y mostrar agradecimiento
  const [copiedCVU, setCopiedCVU] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  // Estados para parallax
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Datos de donación (provienen de variables de entorno)
  const cvu = process.env.NEXT_PUBLIC_DONATION_CVU!;
  const alias = process.env.NEXT_PUBLIC_DONATION_ALIAS!;
  const email = process.env.NEXT_PUBLIC_DONATION_EMAIL!;
  const title = "Apoyá nuestra misión";
  const description = "Tu ayuda nos permite seguir avanzando con este fuego que no se apaga.";

  // Manejo del scroll para parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(inView);
      if (inView) {
        const scrollPosition = window.scrollY;
        const elementTop = rect.top + scrollPosition;
        const parallax = (scrollPosition - elementTop) * 0.5;
        setScrollY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // inicializar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función que copia al portapapeles y dispara toast + overlay de agradecimiento
  const copyToClipboard = async (text: string, type: "cvu" | "alias") => {
    try {
      await navigator.clipboard.writeText(text);

      if (type === "cvu") {
        setCopiedCVU(true);
        setTimeout(() => setCopiedCVU(false), 2000);
      } else {
        setCopiedAlias(true);
        setTimeout(() => setCopiedAlias(false), 2000);
      }

      toast({
        title: "¡Copiado!",
        description: `${type === "cvu" ? "CVU" : "Alias"} copiado al portapapeles 👍`,
      });

      if (!showThanks) {
        // Esperamos 1s antes de mostrar el agradecimiento, dura 5s
        setTimeout(() => {
          setShowThanks(true);
          setTimeout(() => setShowThanks(false), 5000);
        }, 1000);
      }
    } catch (err) {
      toast({
        title: "Ups, algo falló",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen"
      style={{
        backgroundImage: `url(${donationBackground.src})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay de gradiente con parallax más lento */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2), rgba(0,0,0,0.1))",
          transform: isVisible
            ? `translate3d(0, ${scrollY * 0.3}px, 0)`
            : "translate3d(0, 0, 0)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      />

      {/* Contenedor principal: centramos el contenido y aplicamos un blur detrás */}
      <div className="relative z-20 py-16 px-4 flex justify-center">
        <div className="max-w-3xl w-full">
          {/* Enhanced glassmorphism effect with better blur and backdrop filter */}
          <div className="backdrop-blur-[6px]  rounded-2xl p-6 shadow-2xl border border-white/30">
            <Card className="shadow-none bg-transparent border-0 ">
              <CardHeader className="pb-8 pt-10 px-8">
                <div className="flex flex-col items-center">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
                    {title}
                  </CardTitle>
                  <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full my-3" />
                  <CardDescription className="text-white/70 text-center text-base max-w-2xl">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-6 relative">
                {showThanks && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <div className="w-full h-full backdrop-blur-[10px] bg-white/60 rounded-xl p-6 flex flex-col items-center justify-center shadow-xl border border-white/20">
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                      >
                        <Flame className="h-16 w-16 text-red-600 fill-red-500 mb-4 drop-shadow-lg" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2 text-red-700">
                        ¡Gracias por tu apoyo!
                      </h3>
                      <p className="text-center text-red-800">
                        Tu contribución ayuda a mantener viva la llama
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-white/70 flex items-center">
                        <span className="bg-white/50 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                          CVU
                        </span>
                        Transferencia bancaria
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                        onClick={() => copyToClipboard(cvu, "cvu")}
                      >
                        {copiedCVU ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedCVU ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white/10 p-3 rounded-lg text-white/80 font-mono w-full break-all border-2  border-red-200/30">
                        {cvu}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-white/70 flex items-center">
                        <span className="bg-white/50 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                          ALIAS
                        </span>
                        Más fácil de recordar
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                        onClick={() => copyToClipboard(alias, "alias")}
                      >
                        {copiedAlias ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedAlias ? "¡Copiado!" : "Copiar"}
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white/10 p-3 rounded-lg text-white/80 font-mono w-full break-all border-2  border-red-200/30">
                        {alias}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="bg-gradient-to-r from-piedras-50/50 to-piedras-100/50 p-6 rounded-lg border border-piedras-100/50">
                      <p className="text-sm text-white/80 text-center">
                        <span className="font-semibold text-white/90">
                          ¡Cada aporte enciende la llama!
                        </span>{" "}
                        Después de realizar tu donación, envíanos un mensaje a{" "}
                        <span className="font-semibold text-orange-500/90 underline">
                          {email}
                        </span>{" "}
                        para agradecerte personalmente.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
