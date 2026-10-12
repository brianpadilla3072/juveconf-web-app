'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CheckCircle2, Keyboard, Loader2, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BuffetScanner from '@/components/meals/BuffetScanner';
import BuffetResultCard from '@/components/meals/BuffetResultCard';
import BuffetManualSearch from '@/components/meals/BuffetManualSearch';
import { useCurrentEvent } from '@/hooks/Events/useCurrentEvent';
import { useRole } from '@/hooks/useRole';
import { useBuffetScan } from '@/hooks/meals/useBuffetScan';
import { useBuffetDeliver } from '@/hooks/meals/useBuffetDeliver';
import { parseRegistrationCode, parseTicketQR } from '@/lib/qr';
import { BUFFET_STATUS_MESSAGES, slotNameByCode, sortSlots } from '@/lib/meals';
import type { BuffetView, MealScanPayload } from '@/entities/Meal';

const SLOT_STORAGE_KEY = 'juveconf:buffet:slotCode';
const FLASH_MS = 2000;

type Mode = 'scan' | 'search';

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // no soportado
  }
}

export default function BuffetPage() {
  const { event, hasMealConfig, loading, error, refetch } = useCurrentEvent();
  const { canUseBuffet, isLoading: roleLoading, isBuffetOnly } = useRole();
  const { scan, isScanning } = useBuffetScan();
  const { deliver, isDelivering } = useBuffetDeliver();

  const [slotCode, setSlotCode] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('scan');
  const [result, setResult] = useState<BuffetView | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slots = useMemo(() => sortSlots(event?.mealConfig?.slots), [event?.mealConfig?.slots]);

  // Recupera el turno elegido la última vez (si sigue existiendo)
  useEffect(() => {
    if (slots.length === 0) return;
    setSlotCode((current) => {
      if (current && slots.some((s) => s.code === current)) return current;
      try {
        const saved = localStorage.getItem(SLOT_STORAGE_KEY);
        if (saved && slots.some((s) => s.code === saved)) return saved;
      } catch {
        // localStorage no disponible
      }
      return null;
    });
  }, [slots]);

  useEffect(
    () => () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    },
    [],
  );

  const selectSlot = (code: string) => {
    setSlotCode(code);
    setResult(null);
    setScanError(null);
    try {
      localStorage.setItem(SLOT_STORAGE_KEY, code);
    } catch {
      // localStorage no disponible
    }
  };

  const runScan = async (payload: MealScanPayload) => {
    const { view, error: message } = await scan(payload);
    if (view) {
      setScanError(null);
      setResult(view);
      vibrate(view.status === 'PENDING' ? 120 : [80, 60, 80]);
    } else {
      setResult(null);
      setScanError(message ?? 'Entrada no válida');
      vibrate([200, 80, 200]);
    }
  };

  const handleDecode = (text: string) => {
    if (!slotCode) return;

    try {
      // QR de la entrada: inviteId + paymentId
      const { inviteId, paymentId } = parseTicketQR(text);
      runScan({ inviteeId: inviteId, paymentId, slotCode });
      return;
    } catch {
      // No es el QR de la entrada: puede ser un código de inscripción en texto
    }

    const code = parseRegistrationCode(text);
    if (code) {
      runScan({ code, slotCode });
    } else {
      setResult(null);
      setScanError('QR no válido: no corresponde a una entrada');
      vibrate([200, 80, 200]);
    }
  };

  const handleSubmitCode = (code: string) => {
    if (!slotCode) return;
    runScan({ code, slotCode });
  };

  const handleSelectFromSearch = (view: BuffetView) => {
    setScanError(null);
    setResult(view);
  };

  const handleDeliver = async () => {
    if (!result || !slotCode) return;

    const response = await deliver(result.inviteeId, slotCode);
    if (!response) return; // el hook ya mostró el error; se puede reintentar

    if (response.delivered) {
      vibrate(200);
      toast.success(`Entregado: ${result.name}`);
      setFlash(result.name);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), FLASH_MS);
      setResult(null); // vuelve a escanear
      return;
    }

    // No se entregó ahora: ya estaba entregada u otro estado
    setResult({
      ...result,
      status: response.status,
      deliveredAt: response.deliveredAt ?? result.deliveredAt,
    });
    toast.warning(BUFFET_STATUS_MESSAGES[response.status] ?? 'No se pudo entregar');
  };

  const closeResult = () => setResult(null);

  if (loading || roleLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-neutral-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!canUseBuffet) {
    return (
      <div className="rounded-2xl bg-neutral-950 p-6 text-center text-white">
        No tenés permiso para usar el modo buffet.
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="space-y-4 rounded-2xl bg-neutral-950 p-6 text-center text-white">
        <p>No se pudieron cargar los turnos del evento.</p>
        <Button variant="secondary" className="h-12" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!event || !hasMealConfig || slots.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-950 p-6 text-center text-white">
        El evento actual no tiene comidas configuradas.
      </div>
    );
  }

  const paused = !!result || isScanning || isDelivering;
  const slotName = slotCode ? slotNameByCode(slots, slotCode) : '';

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 rounded-2xl bg-neutral-950 p-3 text-white sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">Buffet</h1>
          <p className="truncate text-sm text-white/60">
            {event.topic} {event.year}
          </p>
        </div>
        {!isBuffetOnly && (
          <Link
            href="/app/comidas"
            className="hidden text-sm text-white/50 underline-offset-2 hover:underline md:block"
          >
            Volver a Comidas
          </Link>
        )}
      </div>

      {/* Turno */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70">Turno</p>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => {
            const selected = slot.code === slotCode;
            return (
              <button
                key={slot.code}
                type="button"
                onClick={() => selectSlot(slot.code)}
                aria-pressed={selected}
                className={`min-h-[56px] rounded-xl border-2 px-3 py-2 text-base font-bold transition-colors ${
                  selected
                    ? 'border-violet-400 bg-violet-600 text-white'
                    : 'border-white/15 bg-neutral-900 text-white/80 active:bg-neutral-800'
                }`}
              >
                {slot.name}
              </button>
            );
          })}
        </div>
      </div>

      {!slotCode ? (
        <p className="rounded-xl bg-neutral-900 p-4 text-center text-white/70">
          Elegí el turno para empezar a escanear.
        </p>
      ) : (
        <>
          {flash && (
            <div
              className="flex items-center gap-3 rounded-xl bg-green-600 px-4 py-4 text-white"
              role="status"
            >
              <CheckCircle2 className="h-7 w-7 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-lg font-extrabold">ENTREGADO</p>
                <p className="truncate text-sm">{flash}</p>
              </div>
            </div>
          )}

          {scanError && (
            <div
              className="flex items-start justify-between gap-3 rounded-xl border-2 border-red-500 bg-red-500/15 px-4 py-4 text-red-200"
              role="alert"
            >
              <p className="text-lg font-bold">{scanError}</p>
              <button
                type="button"
                onClick={() => setScanError(null)}
                className="rounded-full p-1 hover:bg-white/10"
                aria-label="Cerrar aviso"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {result && (
            <BuffetResultCard
              view={result}
              slotName={slotName}
              isDelivering={isDelivering}
              onDeliver={handleDeliver}
              onClose={closeResult}
            />
          )}

          {/* Modo de lectura */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('scan')}
              aria-pressed={mode === 'scan'}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-semibold ${
                mode === 'scan' ? 'bg-white text-neutral-950' : 'bg-neutral-900 text-white/80'
              }`}
            >
              <QrCode className="h-5 w-5" />
              Escanear QR
            </button>
            <button
              type="button"
              onClick={() => setMode('search')}
              aria-pressed={mode === 'search'}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-base font-semibold ${
                mode === 'search' ? 'bg-white text-neutral-950' : 'bg-neutral-900 text-white/80'
              }`}
            >
              <Keyboard className="h-5 w-5" />
              Buscar
            </button>
          </div>

          {mode === 'scan' ? (
            <BuffetScanner onDecode={handleDecode} paused={paused} />
          ) : (
            <BuffetManualSearch
              slotCode={slotCode}
              onSelect={handleSelectFromSearch}
              onSubmitCode={handleSubmitCode}
            />
          )}
        </>
      )}
    </div>
  );
}
