'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealRegistrationsTab } from '@/components/meals/MealRegistrationsTab';
import { MealStatsTab } from '@/components/meals/MealStatsTab';
import { MealConfigTab } from '@/components/meals/MealConfigTab';
import { useCurrentEvent } from '@/hooks/Events/useCurrentEvent';
import { useRole } from '@/hooks/useRole';
import { sortSlots } from '@/lib/meals';

type TabValue = 'registros' | 'conteos' | 'configuracion';

export default function ComidasPage() {
  const { event, hasMealConfig, loading, error, refetch } = useCurrentEvent();
  const { isMealsAdmin, canUseBuffet, isLoading: roleLoading } = useRole();
  const [tab, setTab] = useState<TabValue>('registros');

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isMealsAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 space-y-4 text-center">
            <p className="text-muted-foreground">
              No tenés permiso para administrar las comidas.
            </p>
            {canUseBuffet && (
              <Button asChild className="bg-violet-600 hover:bg-violet-700">
                <Link href="/app/comidas/buffet">
                  <ScanLine className="h-4 w-4 mr-2" />
                  Ir al modo buffet
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 space-y-4 text-center">
            <p className="text-muted-foreground">
              {error
                ? 'No se pudo cargar el evento actual.'
                : 'No hay un evento del año actual.'}
            </p>
            {!!error && (
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sin configuración de comidas solo se puede usar la pestaña Configuración (para cargar los menús)
  const activeTab: TabValue = hasMealConfig ? tab : 'configuracion';
  const slots = sortSlots(event.mealConfig?.slots);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Comidas</h1>
          <p className="text-muted-foreground">
            {event.topic} {event.year}
          </p>
        </div>
        {hasMealConfig && (
          <Button asChild variant="outline" className="border-violet-200 bg-violet-50 hover:bg-violet-100">
            <Link href="/app/comidas/buffet">
              <ScanLine className="h-4 w-4 mr-2 text-violet-600" />
              Abrir modo buffet
            </Link>
          </Button>
        )}
      </div>

      {!hasMealConfig && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-6 text-sm text-amber-900">
            Cargá los menús y precios; después activá las comidas en cada combo desde{' '}
            <Link href="/app/combos" className="font-medium underline">
              Combos
            </Link>
            .
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="registros" disabled={!hasMealConfig}>
            Registros
          </TabsTrigger>
          <TabsTrigger value="conteos" disabled={!hasMealConfig}>
            Conteos
          </TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        {hasMealConfig && (
          <>
            <TabsContent value="registros" className="mt-4">
              <MealRegistrationsTab eventId={event.id} slots={slots} />
            </TabsContent>
            <TabsContent value="conteos" className="mt-4">
              <MealStatsTab eventId={event.id} />
            </TabsContent>
          </>
        )}
        <TabsContent value="configuracion" className="mt-4">
          <MealConfigTab event={event} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
