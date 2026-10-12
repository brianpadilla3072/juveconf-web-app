'use client';

import { BedDouble, CheckCircle2, Clock, FileCheck2, RefreshCw, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KPICard } from '@/app/components/Dashboard/KPICard';
import { useMealStats } from '@/hooks/meals/useMealStats';
import { nightLabel } from '@/lib/meals';

interface MealStatsTabProps {
  eventId: string;
}

const POLL_MS = 30_000;

function Counter({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${className ?? ''}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function MealStatsTab({ eventId }: MealStatsTabProps) {
  const { stats, loading, error, refetch } = useMealStats(eventId, { pollMs: POLL_MS });

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-between gap-3 text-red-600">
          <span className="text-sm">{error ?? 'No hay conteos disponibles'}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { registrations, meals, lodgingByNight } = stats;
  const lodgingEntries = Object.entries(lodgingByNight ?? {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Se actualiza automáticamente cada {POLL_MS / 1000} segundos.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">No se pudo actualizar: {error}</p>}

      {/* Inscripciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Inscripciones"
          value={String(registrations.total)}
          icon={Users}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
        />
        <KPICard
          title="Pago pendiente"
          value={String(registrations.pendingPayment)}
          icon={Clock}
          iconColor="text-amber-500"
          iconBg="bg-amber-100"
        />
        <KPICard
          title="Comprobante enviado"
          value={String(registrations.proofSentPending)}
          icon={FileCheck2}
          iconColor="text-sky-500"
          iconBg="bg-sky-100"
        />
        <KPICard
          title="Pago confirmado"
          value={String(registrations.confirmed)}
          icon={CheckCircle2}
          iconColor="text-green-500"
          iconBg="bg-green-100"
        />
        <KPICard
          title="Acreditados"
          value={String(registrations.accredited)}
          icon={UserCheck}
          iconColor="text-violet-500"
          iconBg="bg-violet-100"
        />
      </div>

      {/* Comidas por turno */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Comidas por turno</h3>
        {meals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay comidas vendidas.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {meals.map((slot) => {
              const pct = slot.sold > 0 ? Math.round((slot.delivered / slot.sold) * 100) : 0;
              return (
                <Card key={slot.slotCode}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{slot.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Counter label="Vendidas" value={slot.sold} />
                      <Counter label="Entregadas" value={slot.delivered} className="text-green-600" />
                      <Counter label="Pendientes" value={slot.pending} className="text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <Progress value={pct} />
                      <p className="text-xs text-muted-foreground text-right">{pct}% entregado</p>
                    </div>
                    {slot.options.length > 0 && (
                      <div className="rounded-md border divide-y">
                        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-3 py-2 text-xs font-medium text-muted-foreground">
                          <span>Menú</span>
                          <span className="text-right w-16">Vendidas</span>
                          <span className="text-right w-16">Entreg.</span>
                          <span className="text-right w-16">Pend.</span>
                        </div>
                        {slot.options.map((opt) => (
                          <div
                            key={opt.optionName}
                            className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-3 py-2 text-sm"
                          >
                            <span className="break-words">{opt.optionName}</span>
                            <span className="text-right w-16 font-medium">{opt.sold}</span>
                            <span className="text-right w-16 text-green-600">{opt.delivered}</span>
                            <span className="text-right w-16 text-amber-600">{opt.pending}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Hospedaje */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Hospedaje por noche</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lodgingEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos de hospedaje.</p>
          ) : (
            lodgingEntries.map(([night, count]) => (
              <KPICard
                key={night}
                title={nightLabel(night)}
                value={String(count)}
                icon={BedDouble}
                iconColor="text-indigo-500"
                iconBg="bg-indigo-100"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MealStatsTab;
