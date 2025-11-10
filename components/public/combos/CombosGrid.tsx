'use client';

import React from 'react';
import { usePublishedCombos } from '@/hooks/combos/usePublishedCombos';
import { Loader2 } from 'lucide-react';

interface CombosGridProps {
  eventId: string;
  onComboClick?: (comboId: string) => void;
}

export function CombosGrid({ eventId, onComboClick }: CombosGridProps) {
  const { data: combos, isLoading, error } = usePublishedCombos(eventId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error al cargar los combos. Por favor, intenta nuevamente.</p>
      </div>
    );
  }

  if (!combos || combos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No hay combos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {combos
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((combo) => (
          <div
            key={combo.id}
            className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 transform active:scale-95"
            onClick={() => onComboClick?.(combo.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onComboClick?.(combo.id);
              }
            }}
          >
            {/* Título */}
            <h2 className="text-[#8B3FFF] font-black text-3xl lg:text-4xl mb-4 uppercase">
              {combo.name}
            </h2>

            {/* Descripción */}
            <p className="text-black text-sm lg:text-base leading-relaxed mb-6 uppercase">
              {combo.description}
            </p>

            {/* Precio */}
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              {combo.isFree ? (
                <>
                  <span className="text-black font-black text-5xl lg:text-6xl">$0</span>
                  <span className="text-black font-bold text-base lg:text-lg align-super ml-2">
                    /GRATUITO
                  </span>
                </>
              ) : (
                <span className="text-black font-black text-5xl lg:text-6xl">
                  ${combo.price.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            {/* Lista de beneficios */}
            <ul className="space-y-3 mb-16">
              {combo.metadata.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {/* Check icon */}
                  <svg
                    className="w-5 h-5 text-[#8B3FFF] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-black text-xs lg:text-sm leading-tight uppercase">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Botón de acción (flecha) */}
            <div
              className="absolute bottom-8 right-8 w-14 h-14 bg-[#8B3FFF] rounded-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-200 shadow-lg pointer-events-none"
              aria-hidden="true"
            >
              →
            </div>
          </div>
        ))}
    </div>
  );
}
