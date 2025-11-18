'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Loader2 } from 'lucide-react';
import { useExportSchema } from '@/hooks/invitees/useExportSchema';
import { useMultiFormatExport } from '@/hooks/invitees/useMultiFormatExport';
import { ExportConfig, ExportFormat, FORMAT_LABELS } from '@/lib/export/types';
import { Event } from '@/entities/Event';
import { Combo } from '@/entities/Combo';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEventId?: string;
  events?: Event[];
  combos?: Combo[];
  inviteesCount?: number;
}

export function ExportDialog({
  open,
  onOpenChange,
  defaultEventId,
  events = [],
  combos = [],
  inviteesCount = 0,
}: ExportDialogProps) {
  // Estado de configuración
  const [config, setConfig] = useState<ExportConfig>({
    eventId: defaultEventId || '',
    comboIds: [],
    includeAttendance: true,
    includeMerchandising: true,
    includeMetadata: true,
    selectedMetadataFields: [],
    selectedMerchTypes: [],
    selectedDays: [],
    selectedAdditionalFields: [],
  });

  const [allCombos, setAllCombos] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel');
  const [pdfLandscape, setPdfLandscape] = useState(false);

  // Hooks
  const { metadataFields, merchTypes, isLoading: isLoadingSchema } =
    useExportSchema(config.eventId);
  const { exportData, isGenerating } = useMultiFormatExport();

  // Obtener evento seleccionado
  const selectedEvent = events.find((e) => e.id === config.eventId);
  const eventDays = selectedEvent?.eventDays?.days || [];

  // Filtrar combos por evento
  const filteredCombos = combos.filter((c) => c.eventId === config.eventId);

  // Calcular número de columnas
  const getColumnCount = () => {
    let count = 4; // Nombre, CUIL, Email, Teléfono

    // Campos adicionales
    const additionalFieldsCount = 5; // combo, age, createdAt, paymentType, amount
    if (config.selectedAdditionalFields && config.selectedAdditionalFields.length > 0) {
      count += config.selectedAdditionalFields.length;
    } else {
      count += additionalFieldsCount; // Todos por defecto
    }

    // Metadata
    if (config.includeMetadata) {
      if (config.selectedMetadataFields && config.selectedMetadataFields.length > 0) {
        count += config.selectedMetadataFields.length;
      } else {
        count += metadataFields.length;
      }
    }

    // Merchandising
    if (config.includeMerchandising) {
      if (config.selectedMerchTypes && config.selectedMerchTypes.length > 0) {
        count += config.selectedMerchTypes.length;
      } else {
        count += merchTypes.length;
      }
    }

    // Días de asistencia
    if (config.includeAttendance) {
      if (config.selectedDays && config.selectedDays.length > 0) {
        count += config.selectedDays.length;
      } else {
        count += eventDays.length;
      }
    }

    count += 1; // Observaciones

    return count;
  };

  // Actualizar eventId cuando cambia el defaultEventId
  useEffect(() => {
    if (defaultEventId && !config.eventId) {
      setConfig((c) => ({ ...c, eventId: defaultEventId }));
    }
  }, [defaultEventId]);

  // Manejar exportación
  const handleExport = async () => {
    if (!config.eventId) {
      return;
    }

    const exportConfig: ExportConfig = {
      ...config,
      comboIds: allCombos ? undefined : config.comboIds,
    };

    await exportData(exportConfig, selectedFormat, {
      pdfLandscape,
      eventName: selectedEvent?.topic,
    });
  };

  // Toggle metadata field
  const toggleMetadataField = (fieldKey: string) => {
    setConfig((c) => {
      const current = c.selectedMetadataFields || [];
      const isSelected = current.includes(fieldKey);

      return {
        ...c,
        selectedMetadataFields: isSelected
          ? current.filter((k) => k !== fieldKey)
          : [...current, fieldKey],
      };
    });
  };

  // Toggle merch type
  const toggleMerchType = (merchType: string) => {
    setConfig((c) => {
      const current = c.selectedMerchTypes || [];
      const isSelected = current.includes(merchType);

      return {
        ...c,
        selectedMerchTypes: isSelected
          ? current.filter((t) => t !== merchType)
          : [...current, merchType],
      };
    });
  };

  // Toggle día
  const toggleDay = (dayNumber: number) => {
    setConfig((c) => {
      const current = c.selectedDays || [];
      const isSelected = current.includes(dayNumber);

      return {
        ...c,
        selectedDays: isSelected
          ? current.filter((d) => d !== dayNumber)
          : [...current, dayNumber],
      };
    });
  };

  // Seleccionar todos metadata
  const selectAllMetadata = () => {
    setConfig((c) => ({
      ...c,
      selectedMetadataFields: metadataFields.map((f) => f.key),
    }));
  };

  // Limpiar metadata
  const clearMetadata = () => {
    setConfig((c) => ({ ...c, selectedMetadataFields: [] }));
  };

  // Toggle campo adicional
  const toggleAdditionalField = (fieldKey: string) => {
    setConfig((c) => {
      const current = c.selectedAdditionalFields || [];
      const isSelected = current.includes(fieldKey);

      return {
        ...c,
        selectedAdditionalFields: isSelected
          ? current.filter((k) => k !== fieldKey)
          : [...current, fieldKey],
      };
    });
  };

  // Seleccionar todos los campos adicionales
  const selectAllAdditional = () => {
    setConfig((c) => ({
      ...c,
      selectedAdditionalFields: ['combo', 'age', 'createdAt', 'paymentType', 'amount'],
    }));
  };

  // Limpiar campos adicionales
  const clearAdditional = () => {
    setConfig((c) => ({ ...c, selectedAdditionalFields: [] }));
  };

  // Seleccionar todos merch
  const selectAllMerch = () => {
    setConfig((c) => ({
      ...c,
      selectedMerchTypes: merchTypes.map((m) => m.type),
    }));
  };

  // Limpiar merch
  const clearMerch = () => {
    setConfig((c) => ({ ...c, selectedMerchTypes: [] }));
  };

  const columnCount = getColumnCount();
  const canExport = config.eventId && !isGenerating && !isLoadingSchema;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Exportación de Invitados</DialogTitle>
          <DialogDescription>
            Selecciona el evento, combos y campos a exportar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sección 1: Alcance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Alcance de la Exportación</CardTitle>
              <CardDescription>
                Selecciona el evento y combos a exportar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Evento</Label>
                <Select
                  value={config.eventId}
                  onValueChange={(value) =>
                    setConfig((c) => ({ ...c, eventId: value, comboIds: [] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.topic} ({event.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Combos</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allCombos}
                      onCheckedChange={(checked) => {
                        setAllCombos(checked as boolean);
                        if (checked) {
                          setConfig((c) => ({ ...c, comboIds: [] }));
                        }
                      }}
                    />
                    <Label className="text-sm font-normal">Todos los combos</Label>
                  </div>
                </div>

                {!allCombos && (
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                    {filteredCombos.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-2">
                        No hay combos disponibles para este evento
                      </p>
                    ) : (
                      filteredCombos.map((combo) => (
                        <div key={combo.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={config.comboIds?.includes(combo.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setConfig((c) => ({
                                  ...c,
                                  comboIds: [...(c.comboIds || []), combo.id],
                                }));
                              } else {
                                setConfig((c) => ({
                                  ...c,
                                  comboIds: (c.comboIds || []).filter(
                                    (id) => id !== combo.id,
                                  ),
                                }));
                              }
                            }}
                          />
                          <Label className="text-sm font-normal">{combo.name}</Label>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Badge variant="secondary" className="text-sm">
                📊 {inviteesCount} invitados en este filtro
              </Badge>
            </CardContent>
          </Card>

          {/* Sección 1.5: Campos Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campos Adicionales del Invitado</CardTitle>
              <CardDescription>
                Información complementaria sobre combo, edad y pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      config.selectedAdditionalFields?.length === 0 ||
                      config.selectedAdditionalFields?.includes('combo')
                    }
                    onCheckedChange={() => toggleAdditionalField('combo')}
                  />
                  <Label className="text-sm font-normal">Combo</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      config.selectedAdditionalFields?.length === 0 ||
                      config.selectedAdditionalFields?.includes('age')
                    }
                    onCheckedChange={() => toggleAdditionalField('age')}
                  />
                  <Label className="text-sm font-normal">Edad</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      config.selectedAdditionalFields?.length === 0 ||
                      config.selectedAdditionalFields?.includes('createdAt')
                    }
                    onCheckedChange={() => toggleAdditionalField('createdAt')}
                  />
                  <Label className="text-sm font-normal">Fecha de Registro</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      config.selectedAdditionalFields?.length === 0 ||
                      config.selectedAdditionalFields?.includes('paymentType')
                    }
                    onCheckedChange={() => toggleAdditionalField('paymentType')}
                  />
                  <Label className="text-sm font-normal">Tipo de Pago</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      config.selectedAdditionalFields?.length === 0 ||
                      config.selectedAdditionalFields?.includes('amount')
                    }
                    onCheckedChange={() => toggleAdditionalField('amount')}
                  />
                  <Label className="text-sm font-normal">Monto Pagado</Label>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllAdditional}
                >
                  Seleccionar Todos
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAdditional}
                >
                  Limpiar
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {config.selectedAdditionalFields?.length === 0
                  ? 'Se exportarán todos los 5 campos adicionales'
                  : `Se exportarán ${config.selectedAdditionalFields?.length} campos seleccionados`}
              </p>
            </CardContent>
          </Card>

          {/* Sección 2: Asistencia */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={config.includeAttendance && eventDays.length > 0}
                  disabled={eventDays.length === 0}
                  onCheckedChange={(checked) =>
                    setConfig((c) => ({ ...c, includeAttendance: checked as boolean }))
                  }
                />
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg">Columnas de Asistencia</CardTitle>
                  {eventDays.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No disponible: Este evento no tiene días configurados
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            {config.includeAttendance && eventDays.length > 0 && (
              <CardContent className="space-y-2">
                {eventDays.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay días configurados para este evento
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      {eventDays.map((day) => (
                        <div key={day.dayNumber} className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              config.selectedDays?.length === 0 ||
                              config.selectedDays?.includes(day.dayNumber)
                            }
                            onCheckedChange={() => toggleDay(day.dayNumber)}
                          />
                          <Label className="text-sm font-normal">
                            {day.label || `Día ${day.dayNumber}`}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {config.selectedDays?.length === 0
                        ? `Se exportarán todos los ${eventDays.length} días`
                        : `Se exportarán ${config.selectedDays?.length} días seleccionados`}
                    </p>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Sección 3: Merchandising */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={config.includeMerchandising}
                  onCheckedChange={(checked) =>
                    setConfig((c) => ({
                      ...c,
                      includeMerchandising: checked as boolean,
                    }))
                  }
                />
                <CardTitle className="text-lg">Columnas de Merchandising</CardTitle>
              </div>
            </CardHeader>
            {config.includeMerchandising && (
              <CardContent className="space-y-2">
                {isLoadingSchema ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Detectando tipos de merchandising...
                    </span>
                  </div>
                ) : merchTypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay merchandising configurado para este evento
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {merchTypes.map((merch) => (
                        <div key={merch.type} className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              config.selectedMerchTypes?.length === 0 ||
                              config.selectedMerchTypes?.includes(merch.type)
                            }
                            onCheckedChange={() => toggleMerchType(merch.type)}
                          />
                          <Label className="text-sm font-normal">
                            {merch.label}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({merch.sizes.join(', ')})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={selectAllMerch}
                      >
                        Seleccionar Todos
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearMerch}
                      >
                        Limpiar
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Sección 4: Metadata */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={config.includeMetadata}
                  onCheckedChange={(checked) =>
                    setConfig((c) => ({ ...c, includeMetadata: checked as boolean }))
                  }
                />
                <CardTitle className="text-lg">Campos Adicionales (Metadata)</CardTitle>
              </div>
              <CardDescription>
                Campos detectados automáticamente desde los invitados
              </CardDescription>
            </CardHeader>
            {config.includeMetadata && (
              <CardContent className="space-y-2">
                {isLoadingSchema ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Detectando campos de metadata...
                    </span>
                  </div>
                ) : metadataFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay campos adicionales en los invitados de este evento
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                      {metadataFields.map((field) => (
                        <div key={field.key} className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              config.selectedMetadataFields?.length === 0 ||
                              config.selectedMetadataFields?.includes(field.key)
                            }
                            onCheckedChange={() => toggleMetadataField(field.key)}
                          />
                          <Label className="text-sm font-normal">
                            {field.label}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({field.type})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={selectAllMetadata}
                      >
                        Seleccionar Todos
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearMetadata}
                      >
                        Limpiar
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Sección 5: Formato de Exportación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📄 Formato de Exportación</CardTitle>
              <CardDescription>
                Selecciona el formato de archivo para la exportación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedFormat}
                onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="format-excel" />
                  <Label htmlFor="format-excel" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold">Excel (.xlsx)</span>
                      <span className="text-xs text-muted-foreground">
                        Recomendado para análisis y edición de datos
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold">PDF (.pdf)</span>
                      <span className="text-xs text-muted-foreground">
                        Ideal para impresión y listas de asistencia
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="format-csv" />
                  <Label htmlFor="format-csv" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold">CSV (.csv)</span>
                      <span className="text-xs text-muted-foreground">
                        Compatible con cualquier software de hojas de cálculo
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="format-json" />
                  <Label htmlFor="format-json" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold">JSON (.json)</span>
                      <span className="text-xs text-muted-foreground">
                        Formato legible para humanos con nombres de columnas
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json-nested" id="format-json-nested" />
                  <Label htmlFor="format-json-nested" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold">JSON Anidado (.json)</span>
                      <span className="text-xs text-muted-foreground">
                        Estructura técnica para desarrolladores e integraciones
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Opción de orientación para PDF */}
              {selectedFormat === 'pdf' && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-md">
                  <Checkbox
                    checked={pdfLandscape}
                    onCheckedChange={(checked) => setPdfLandscape(checked as boolean)}
                    id="pdf-landscape"
                  />
                  <Label htmlFor="pdf-landscape" className="text-sm font-normal cursor-pointer">
                    Orientación horizontal (recomendado para muchas columnas)
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1">
            <Badge variant="outline" className="text-sm">
              ✓ {columnCount} columnas • {inviteesCount} invitados
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={!canExport}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a {FORMAT_LABELS[selectedFormat]}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
