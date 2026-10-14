'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamTypesTab } from '@/components/teams/TeamTypesTab';
import { TeamsListTab } from '@/components/teams/TeamsListTab';
import { useCurrentEvent } from '@/hooks/Events/useCurrentEvent';
import { useRole } from '@/hooks/useRole';

type TabValue = 'equipos' | 'tipos';

export default function EquiposPage() {
  const { event, loading, error, refetch } = useCurrentEvent();
  const { isMealsAdmin: isTeamsAdmin, isLoading: roleLoading } = useRole();
  const [tab, setTab] = useState<TabValue>('equipos');

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isTeamsAdmin || !event) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6 space-y-4 text-center">
            <p className="text-muted-foreground">
              {!isTeamsAdmin
                ? 'No tenés permiso para administrar los equipos.'
                : error
                  ? 'No se pudo cargar el evento actual.'
                  : 'No hay un evento del año actual.'}
            </p>
            {isTeamsAdmin && !!error && (
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipos</h1>
        <p className="text-muted-foreground">
          {event.topic} {event.year}
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="equipos">Equipos inscriptos</TabsTrigger>
          <TabsTrigger value="tipos">Tipos de equipo</TabsTrigger>
        </TabsList>
        <TabsContent value="equipos" className="mt-4">
          <TeamsListTab eventId={event.id} />
        </TabsContent>
        <TabsContent value="tipos" className="mt-4">
          <TeamTypesTab eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
