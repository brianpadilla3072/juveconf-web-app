'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useBuffetLookup } from '@/hooks/meals/useBuffetLookup';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { BuffetStatus, BuffetView } from '@/entities/Meal';
import { parseRegistrationCode } from '@/lib/qr';

interface BuffetManualSearchProps {
  slotCode: string;
  /** Selecciona un resultado de la lista */
  onSelect: (view: BuffetView) => void;
  /** Se ingresó un código de inscripción completo (ej: JC-0247) y se confirmó con Enter */
  onSubmitCode: (code: string) => void;
}

const STATUS_LABELS: Record<BuffetStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-green-500/20 text-green-300' },
  DELIVERED: { label: 'Entregada', className: 'bg-amber-500/20 text-amber-300' },
  NOT_PURCHASED: { label: 'Sin comida', className: 'bg-red-500/20 text-red-300' },
  UNPAID: { label: 'Pago no confirmado', className: 'bg-red-500/20 text-red-300' },
};

/** Búsqueda manual por nombre o código: lista mínima (nombre, código y estado) */
export function BuffetManualSearch({ slotCode, onSelect, onSubmitCode }: BuffetManualSearchProps) {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 350);
  const { results, isLoading, error } = useBuffetLookup(debounced, slotCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = parseRegistrationCode(query);
    if (code) {
      onSubmitCode(code);
      setQuery('');
    }
  };

  const showEmpty =
    !isLoading && !error && debounced.trim().length >= 2 && results.length === 0;

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre o código (JC-0247)"
          aria-label="Buscar por nombre o código"
          autoComplete="off"
          autoCapitalize="off"
          enterKeyHint="search"
          className="h-14 border-white/20 bg-neutral-900 pl-12 text-lg text-white placeholder:text-white/40"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-white/60" />
        )}
      </form>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {showEmpty && <p className="text-sm text-white/60">No se encontraron resultados.</p>}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((view) => {
            const status = STATUS_LABELS[view.status];
            return (
              <li key={view.inviteeId}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(view);
                    setQuery('');
                  }}
                  className="flex min-h-[64px] w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-left transition-colors active:bg-neutral-800"
                >
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-white">{view.name}</p>
                    {view.code && (
                      <p className="font-mono text-sm text-white/60">{view.code}</p>
                    )}
                  </div>
                  {status && (
                    <span
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BuffetManualSearch;
