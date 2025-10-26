'use client';

import React from 'react';
import { CombosGrid } from '@/components/public/combos/CombosGrid';
import { useQueryCurrentEvent } from '@/hooks/Events/useQueryEvents';
import { Loader2 } from 'lucide-react';

export default function InscripcionPage() {
  const { event, isLoading, error } = useQueryCurrentEvent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-violet-700">
        <Loader2 className="w-16 h-16 animate-spin text-lime-400" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 to-violet-700">
        <div className="text-center text-white">
          <h1 className="text-4xl font-black mb-4">Error</h1>
          <p className="text-lg">No se pudo cargar la información del evento.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/images/hero/hero-background.webp)',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 md:p-10 lg:p-12 xl:p-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6 mb-8 lg:mb-12">
          <h1 className="text-[#CCFF00] font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none">
            INSCRIPCIÓN
          </h1>

          <div className="hidden lg:block text-white text-right max-w-md">
            <p className="font-light text-sm lg:text-base leading-tight">
              &quot;A LA MEDIDA DE LA ESTATURA<br />
              DE LA PLENITUD DE CRISTO&quot;<br />
              <span className="text-xs lg:text-sm">EFESIOS 4:13</span>
            </p>
          </div>
        </div>

        {/* Combos Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl">
            <CombosGrid eventId={event.id} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-4 mt-8">
          <div className="text-right">
            <p className="text-[#CCFF00] text-base lg:text-lg font-normal leading-tight">
              CONFERENCIA JUVENIL<br />
              BAHIA BLANCA
            </p>
          </div>
          <div className="bg-[#CCFF00] px-4 py-2 rounded">
            <img
              src="/icons/juveconfe.svg"
              alt="JUVECONFE"
              className="h-8 lg:h-10 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
