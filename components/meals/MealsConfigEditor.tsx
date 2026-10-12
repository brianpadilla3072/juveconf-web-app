'use client';

import React from 'react';
import { Plus, Sparkles, Trash2, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { MealConfig, MealDiscountTiers, MealOption, MealSlot } from '@/entities/Meal';
import { buildJueConfeMealTemplate } from '@/lib/meals';

interface MealsConfigEditorProps {
  config: MealConfig;
  onChange: (config: MealConfig) => void;
}

const TIER_KEYS: Array<keyof MealDiscountTiers> = ['2', '3', '4'];

function toNumber(value: string): number {
  if (value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function MealsConfigEditor({ config, onChange }: MealsConfigEditorProps) {
  const { slots, discountTiers } = config;

  const setSlots = (next: MealSlot[]) => onChange({ ...config, slots: next });

  const updateSlot = (index: number, patch: Partial<MealSlot>) =>
    setSlots(slots.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const removeSlot = (index: number) => setSlots(slots.filter((_, i) => i !== index));

  const addSlot = () =>
    setSlots([
      ...slots,
      {
        code: '',
        name: '',
        order: slots.reduce((max, s) => Math.max(max, s.order), 0) + 1,
        options: [{ n: 1, name: '', price: 0 }],
      },
    ]);

  const updateOption = (slotIndex: number, optIndex: number, patch: Partial<MealOption>) =>
    updateSlot(slotIndex, {
      options: slots[slotIndex].options.map((o, i) => (i === optIndex ? { ...o, ...patch } : o)),
    });

  const addOption = (slotIndex: number) => {
    const options = slots[slotIndex].options;
    updateSlot(slotIndex, {
      options: [
        ...options,
        { n: options.reduce((max, o) => Math.max(max, o.n), 0) + 1, name: '', price: 0 },
      ],
    });
  };

  const removeOption = (slotIndex: number, optIndex: number) =>
    updateSlot(slotIndex, { options: slots[slotIndex].options.filter((_, i) => i !== optIndex) });

  const updateTier = (key: keyof MealDiscountTiers, value: number) =>
    onChange({ ...config, discountTiers: { ...discountTiers, [key]: value } });

  const loadTemplate = () => {
    if (
      slots.length > 0 &&
      !window.confirm('Se reemplazarán los turnos, menús, precios y descuentos actuales por la plantilla JueConfe. ¿Continuar?')
    ) {
      return;
    }
    onChange(buildJueConfeMealTemplate());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Turnos y menús
            <Badge variant="secondary">
              {slots.length} {slots.length === 1 ? 'turno' : 'turnos'}
            </Badge>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Cada turno tiene uno o más menús con su precio. El código identifica el turno y no
            conviene cambiarlo una vez que hay comidas vendidas.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={loadTemplate}>
          <Sparkles className="w-4 h-4 mr-2" />
          Cargar plantilla JueConfe
        </Button>
      </div>

      {/* Turnos */}
      <div className="space-y-3">
        {slots.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay turnos configurados</p>
              <p className="text-xs mt-1">
                Agregá un turno o cargá la plantilla JueConfe para empezar
              </p>
            </CardContent>
          </Card>
        )}

        {slots.map((slot, slotIndex) => (
          <Card key={slotIndex} className="border-l-4 border-l-violet-500">
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-start gap-2">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_90px] gap-3">
                  <div>
                    <Label htmlFor={`slot-code-${slotIndex}`} className="text-xs">
                      Código
                    </Label>
                    <Input
                      id={`slot-code-${slotIndex}`}
                      value={slot.code}
                      onChange={(e) =>
                        updateSlot(slotIndex, {
                          code: e.target.value.toUpperCase().replace(/\s+/g, '_'),
                        })
                      }
                      placeholder="Ej: SAT_NIGHT"
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`slot-name-${slotIndex}`} className="text-xs">
                      Nombre
                    </Label>
                    <Input
                      id={`slot-name-${slotIndex}`}
                      value={slot.name}
                      onChange={(e) => updateSlot(slotIndex, { name: e.target.value })}
                      placeholder="Ej: Sábado noche"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`slot-order-${slotIndex}`} className="text-xs">
                      Orden
                    </Label>
                    <Input
                      id={`slot-order-${slotIndex}`}
                      type="number"
                      min={1}
                      value={slot.order}
                      onChange={(e) => updateSlot(slotIndex, { order: toNumber(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 mt-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeSlot(slotIndex)}
                  title="Quitar turno"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Opciones */}
              <div className="space-y-2">
                <div className="hidden sm:grid grid-cols-[60px_1fr_130px_40px] gap-2 text-xs text-muted-foreground px-1">
                  <span>Menú Nº</span>
                  <span>Descripción</span>
                  <span>Precio ($)</span>
                  <span />
                </div>
                {slot.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="grid grid-cols-[60px_1fr_40px] sm:grid-cols-[60px_1fr_130px_40px] gap-2 items-center"
                  >
                    <Input
                      type="number"
                      min={1}
                      aria-label="Número de menú"
                      value={opt.n}
                      onChange={(e) => updateOption(slotIndex, optIndex, { n: toNumber(e.target.value) })}
                    />
                    <Input
                      aria-label="Descripción del menú"
                      value={opt.name}
                      onChange={(e) => updateOption(slotIndex, optIndex, { name: e.target.value })}
                      placeholder="Ej: 3 empanadas + agua"
                    />
                    <Input
                      type="number"
                      min={0}
                      aria-label="Precio"
                      value={opt.price}
                      onChange={(e) => updateOption(slotIndex, optIndex, { price: toNumber(e.target.value) })}
                      className="col-start-2 sm:col-start-auto"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 row-start-1 col-start-3 sm:row-start-auto sm:col-start-auto"
                      onClick={() => removeOption(slotIndex, optIndex)}
                      title="Quitar menú"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addOption(slotIndex)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar menú
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" className="w-full" onClick={addSlot}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar turno
        </Button>
      </div>

      {/* Descuentos */}
      <Card className="bg-violet-50/50 border-violet-200">
        <CardContent className="pt-4 space-y-3">
          <div>
            <Label className="text-sm font-medium">Descuento por cantidad de comidas</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Porcentaje de descuento según cuántas comidas compra cada persona.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TIER_KEYS.map((key) => (
              <div key={key}>
                <Label htmlFor={`tier-${key}`} className="text-xs">
                  {key} comidas (%)
                </Label>
                <Input
                  id={`tier-${key}`}
                  type="number"
                  min={0}
                  max={100}
                  value={discountTiers[key]}
                  onChange={(e) => updateTier(key, toNumber(e.target.value))}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MealsConfigEditor;
