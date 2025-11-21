'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';
import { toast } from 'sonner';

interface QRAttendanceScannerProps {
  onQRScanned: (data: { inviteId: string; paymentId?: string }) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRAttendanceScanner({ onQRScanned, isOpen, onClose }: QRAttendanceScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        handleQRSuccess(decodedText);
      },
      (errorMessage: string) => {
        // Silenciar errores comunes de escaneo que no son importantes
        const ignoredErrors = [
          'No QR code found',
          'QR code parse error',
          'IndexSizeError',
          'The source width is 0',
          'The source height is 0',
          'NotFoundException'
        ];

        const shouldIgnore = ignoredErrors.some(ignored =>
          errorMessage.includes(ignored)
        );

        if (!shouldIgnore) {
          console.error('QR scan error:', errorMessage);
        }
      }
    );

    scannerRef.current = scanner;
    setIsScanning(true);
    setError(null);
  };

  const handleQRSuccess = (decodedText: string) => {
    try {
      // Limpiar el texto del QR
      const cleanText = decodedText.trim();
      
      // Usar regex para extraer inviteId y paymentId del formato de objeto JavaScript
      const inviteIdMatch = cleanText.match(/inviteId:\s*([a-f0-9-]{36})/i);
      const paymentIdMatch = cleanText.match(/paymentId:\s*([a-f0-9-]{36})/i);

      // El inviteId es obligatorio, paymentId es opcional
      if (!inviteIdMatch) {
        throw new Error('No se encontró inviteId válido en el QR');
      }

      const inviteId = inviteIdMatch[1];
      const paymentId = paymentIdMatch ? paymentIdMatch[1] : undefined;

      // Validar que inviteId sea UUID válido (formato básico)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(inviteId)) {
        throw new Error('inviteId inválido en el QR');
      }

      // Validar paymentId solo si existe
      if (paymentId && !uuidRegex.test(paymentId)) {
        throw new Error('paymentId inválido en el QR');
      }

      // Detener el escáner y procesar los datos
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      
      setIsScanning(false);
      onQRScanned({
        inviteId: inviteId,
        paymentId: paymentId
      });
      
      toast.success('QR escaneado correctamente');

    } catch (err) {
      setError('QR inválido. Debe contener inviteId y paymentId válidos.');
      toast.error('QR inválido. Verifique el código escaneado.');
    }
  };

  const handleStopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Escanear QR para Asistencia
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStopScanning}
              className="flex items-center gap-2"
            >
              <CameraOff className="h-4 w-4" />
              Cerrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Apunte la cámara hacia el código QR del invitado
            </p>
            <div 
              id="qr-reader" 
              className="w-full"
              style={{ 
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              El QR debe contener inviteId y paymentId válidos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}