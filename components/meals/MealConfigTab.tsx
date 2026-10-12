'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MealsConfigEditor } from '@/components/meals/MealsConfigEditor';
import { useMealsConfig } from '@/hooks/meals/useMealsConfig';
import type { Event } from '@/entities/Event';
import type { MealConfig } from '@/entities/Meal';
import { emptyMealConfig } from '@/lib/meals';

interface MealConfigTabProps {
  event: Event;
}

function cloneConfig(config: MealConfig | null | undefined): MealConfig {
  return config ? JSON.parse(JSON.stringify(config)) : emptyMealConfig();
}

export function MealConfigTab({ event }: MealConfigTabProps) {
  const [config, setConfig] = useState<MealConfig>(() => cloneConfig(event.mealConfig));
  const { saveConfig, isSaving, error, errors, clearErrors } = useMealsConfig();

  // Re-sincroniza con el servidor (al cargar el evento y después de guardar)
  useEffect(() => {
    setConfig(cloneConfig(event.mealConfig));
  }, [event.id, event.mealConfig]);

  const isDirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(cloneConfig(event.mealConfig)),
    [config, event.mealConfig],
  );

  const hasZeroPrice = config.slots.some((s) => s.options.some((o) => !o.price));

  const handleReset = () => {
    setConfig(cloneConfig(event.mealConfig));
    clearErrors();
  };

  const handleSave = async () => {
    if (config.slots.length === 0) {
      toast.error('Agregá al menos un turno con menús o cargá la plantilla antes de guardar');
      return;
    }

    // useMealsConfig actualiza el evento compartido (refreshCurrentEvent) al guardar
    await saveConfig(event.id, { mealConfig: config });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 text-sm text-muted-foreground">
            Para que un combo permita elegir comidas, activalo en{' '}
            <Link href="/app/combos" className="text-violet-600 underline">
              Combos
            </Link>
            .
          </div>

          <MealsConfigEditor config={config} onChange={setConfig} />

          {hasZeroPrice && (
            <Alert className="border-amber-300 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="text-sm">Hay menús con precio $0. Completá los precios antes de activar las comidas en los combos.</div>
            </Alert>
          )}

          {(error || errors.length > 0) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{error ?? 'La configuración no es válida'}</p>
                {errors.length > 0 && (
                  <ul className="list-disc pl-5 text-sm space-y-0.5">
                    {errors.map((message, i) => (
                      <li key={i}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Alert>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={!isDirty || isSaving}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Descartar cambios
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar configuración'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MealConfigTab;
