'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QrCode, Search } from 'lucide-react';

interface AttendanceMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQR: () => void;
  onSelectManual: () => void;
}

export default function AttendanceMethodModal({
  isOpen,
  onClose,
  onSelectQR,
  onSelectManual,
}: AttendanceMethodModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tomar Asistencia</DialogTitle>
          <DialogDescription>
            Selecciona el método para registrar la asistencia
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Opción QR */}
          <Button
            onClick={onSelectQR}
            className="h-auto py-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <QrCode className="h-12 w-12" />
            <div className="text-center">
              <div className="font-semibold text-lg">Escanear Código QR</div>
              <div className="text-sm opacity-90 font-normal">
                Usar la cámara para escanear el código QR del ticket
              </div>
            </div>
          </Button>

          {/* Opción Manual */}
          <Button
            onClick={onSelectManual}
            className="h-auto py-6 flex flex-col items-center gap-3 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Search className="h-12 w-12" />
            <div className="text-center">
              <div className="font-semibold text-lg">Búsqueda Manual</div>
              <div className="text-sm opacity-90 font-normal">
                Buscar al invitado por nombre o CUIL
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
