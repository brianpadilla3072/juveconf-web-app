'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraOff, Loader2, PauseCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const READER_ID = 'buffet-qr-reader';

interface BuffetScannerProps {
  /** Texto decodificado del QR (ya filtrado por el tiempo de espera entre lecturas) */
  onDecode: (text: string) => void;
  /** Mientras está en pausa la cámara sigue encendida pero se ignoran las lecturas */
  paused?: boolean;
  /** Tiempo mínimo entre dos lecturas aceptadas */
  cooldownMs?: number;
}

type ScannerStatus = 'starting' | 'running' | 'error';

function describeCameraError(err: unknown): string {
  const text = String((err as any)?.message ?? err ?? '');
  if (/NotAllowed|Permission|denied/i.test(text)) {
    return 'No hay permiso para usar la cámara. Habilitalo en el navegador y volvé a intentar.';
  }
  if (/NotFound|no camera|Requested device not found/i.test(text)) {
    return 'No se encontró ninguna cámara en este dispositivo.';
  }
  return 'No se pudo iniciar la cámara. Verificá los permisos y que la página se abra con HTTPS.';
}

/**
 * Escáner de QR continuo para el buffet, basado en Html5Qrcode (cámara trasera).
 * Mantiene la cámara encendida entre lecturas y la libera al desmontarse.
 */
export default function BuffetScanner({
  onDecode,
  paused = false,
  cooldownMs = 1500,
}: BuffetScannerProps) {
  const [status, setStatus] = useState<ScannerStatus>('starting');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);

  const onDecodeRef = useRef(onDecode);
  const pausedRef = useRef(paused);
  const cooldownRef = useRef(cooldownMs);
  const lastReadRef = useRef(0);
  const wasPausedRef = useRef(paused);
  // Cierre en curso de la instancia anterior: evita que el doble montaje de React
  // (modo estricto) deje dos escáneres compitiendo por el mismo elemento.
  const teardownRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    onDecodeRef.current = onDecode;
    cooldownRef.current = cooldownMs;
  });

  useEffect(() => {
    pausedRef.current = paused;
    // Al reanudar arranca un nuevo tiempo de espera, así no se relee el mismo QR al instante
    if (wasPausedRef.current && !paused) {
      lastReadRef.current = Date.now();
    }
    wasPausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5Qrcode | null = null;
    let started = false;

    const run = async () => {
      await teardownRef.current;
      if (cancelled) return;

      setStatus('starting');
      setErrorMessage('');

      try {
        scanner = new Html5Qrcode(READER_ID, { verbose: false });
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            aspectRatio: 1.0,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.7);
              return { width: size, height: size };
            },
          },
          (decodedText: string) => {
            if (pausedRef.current) return;
            const now = Date.now();
            if (now - lastReadRef.current < cooldownRef.current) return;
            lastReadRef.current = now;
            onDecodeRef.current(decodedText);
          },
          () => {
            // Errores de frame sin QR: se ignoran
          },
        );
        started = true;
        if (!cancelled) setStatus('running');
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(describeCameraError(err));
        }
      }
    };

    const running = run();

    return () => {
      cancelled = true;
      teardownRef.current = running.then(async () => {
        if (!scanner) return;
        try {
          if (started) await scanner.stop();
        } catch {
          // ya estaba detenido
        }
        try {
          scanner.clear();
        } catch {
          // elemento ya liberado
        }
      });
    };
  }, [attempt]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div
        id={READER_ID}
        className="w-full min-h-[280px] [&_video]:w-full [&_video]:object-cover"
      />

      {status === 'starting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Iniciando cámara...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 p-6 text-center text-white">
          <CameraOff className="h-10 w-10 text-red-400" />
          <p className="text-sm">{errorMessage}</p>
          <Button
            variant="secondary"
            className="h-12 px-6 text-base"
            onClick={() => setAttempt((n) => n + 1)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      )}

      {status === 'running' && paused && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/70 py-2 text-sm text-white">
          <PauseCircle className="h-4 w-4" />
          Escaneo en pausa
        </div>
      )}
    </div>
  );
}
