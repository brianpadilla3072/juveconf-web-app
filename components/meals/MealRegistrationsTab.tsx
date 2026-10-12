'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Check, Download, Eye, Loader2, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RegistrationBadges } from '@/components/meals/RegistrationBadges';
import { MealRegistrationDetailsContent } from '@/components/GlobalDrawer/templates/MealRegistrationDetailsContent';
import { useMealRegistrations } from '@/hooks/meals/useMealRegistrations';
import useApproveOrder from '@/hooks/Orders/useApproveOrder';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDrawer } from '@/hooks/useDrawer';
import type { MealRegistration, MealSlot } from '@/entities/Meal';
import type { ExportData } from '@/lib/export/types';
import { generateExcel } from '@/lib/export/generators/excel';
import { generateCSV } from '@/lib/export/generators/csv';
import { formatMoney, formatNights, mealLines, slotNameByCode } from '@/lib/meals';

type StatusFilter = 'all' | 'pending' | 'proof' | 'confirmed' | 'accredited';

interface MealRegistrationsTabProps {
  eventId: string;
  slots: MealSlot[];
}

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pago pendiente' },
  { value: 'proof', label: 'Con comprobante enviado' },
  { value: 'confirmed', label: 'Pago confirmado' },
  { value: 'accredited', label: 'Acreditados' },
];

function matchesFilter(r: MealRegistration, filter: StatusFilter): boolean {
  switch (filter) {
    case 'pending':
      return r.paymentState === 'PENDING';
    case 'proof':
      return r.proofSent;
    case 'confirmed':
      return r.paymentState === 'CONFIRMED';
    case 'accredited':
      return r.accredited;
    default:
      return true;
  }
}

function MealsCell({
  registration,
  slots,
}: {
  registration: MealRegistration;
  slots: MealSlot[];
}) {
  if (registration.meals.length === 0) {
    return <span className="text-xs text-muted-foreground">Sin comidas</span>;
  }
  return (
    <ul className="space-y-0.5">
      {registration.meals.map((meal, i) => (
        <li key={`${meal.slotCode}-${i}`} className="text-xs leading-snug">
          <span className="font-medium">{slotNameByCode(slots, meal.slotCode)}:</span>{' '}
          {meal.optionName}
          {meal.delivered && <Check className="inline h-3 w-3 ml-1 text-green-600" />}
        </li>
      ))}
    </ul>
  );
}

function buildExportData(rows: MealRegistration[], slots: MealSlot[]): ExportData {
  return {
    schema: {
      columns: [
        { key: 'code', label: 'Código', type: 'string', width: 12 },
        { key: 'name', label: 'Nombre', type: 'string', width: 28 },
        { key: 'cuil', label: 'CUIL', type: 'string', width: 16 },
        { key: 'email', label: 'Email', type: 'string', width: 28 },
        { key: 'phone', label: 'Teléfono', type: 'string', width: 16 },
        { key: 'state', label: 'Estado', type: 'string', width: 18 },
        { key: 'proofSent', label: 'Comprobante enviado', type: 'string', width: 12 },
        { key: 'orderTotal', label: 'Total', type: 'string', width: 12 },
        { key: 'city', label: 'Ciudad', type: 'string', width: 18 },
        { key: 'church', label: 'Iglesia', type: 'string', width: 22 },
        { key: 'group', label: 'Grupo', type: 'string', width: 18 },
        { key: 'lodging', label: 'Hospedaje', type: 'string', width: 18 },
        { key: 'meals', label: 'Comidas', type: 'string', width: 50 },
        { key: 'delivered', label: 'Entregadas', type: 'string', width: 30 },
        { key: 'emergencyName', label: 'Contacto de emergencia', type: 'string', width: 24 },
        { key: 'emergencyPhone', label: 'Teléfono de emergencia', type: 'string', width: 18 },
        { key: 'dietary', label: 'Alimentación', type: 'string', width: 30 },
      ],
    },
    rows: rows.map((r) => ({
      code: r.code ?? '',
      name: r.name,
      cuil: r.cuil ?? '',
      email: r.email ?? '',
      phone: r.phone ?? '',
      state: r.accredited
        ? 'Acreditado'
        : r.paymentState === 'CONFIRMED'
          ? 'Pago confirmado'
          : 'Pago pendiente',
      proofSent: r.proofSent ? 'Sí' : 'No',
      orderTotal: formatMoney(r.orderTotal),
      city: r.city ?? '',
      church: r.church ?? '',
      group: r.group ?? '',
      lodging: r.lodging?.needed ? formatNights(r.lodging.nights) || 'Sí' : 'No',
      meals: mealLines(r, slots).join(' | '),
      delivered: r.meals
        .filter((m) => m.delivered)
        .map((m) => slotNameByCode(slots, m.slotCode))
        .join(', '),
      emergencyName: r.emergency?.name ?? '',
      emergencyPhone: r.emergency?.phone ?? '',
      dietary: r.dietary ?? '',
    })),
  };
}

export function MealRegistrationsTab({ eventId, slots }: MealRegistrationsTabProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [confirmTarget, setConfirmTarget] = useState<MealRegistration | null>(null);
  const [approvingKey, setApprovingKey] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);
  const { registrations, loading, error, refetch } = useMealRegistrations(
    eventId,
    debouncedSearch,
  );
  const { approveOrder } = useApproveOrder();
  const { openDrawer } = useDrawer();

  const visible = useMemo(
    () => registrations.filter((r) => matchesFilter(r, filter)),
    [registrations, filter],
  );

  const sameOrderCount = confirmTarget
    ? registrations.filter((r) => r.orderId === confirmTarget.orderId).length
    : 0;

  const handleOpenDetails = (registration: MealRegistration) => {
    openDrawer(registration, (data) => (
      <MealRegistrationDetailsContent registration={data} slots={slots} />
    ));
  };

  const handleConfirmPayment = async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    setApprovingKey(target.key);
    setConfirmTarget(null);

    const result = await approveOrder(target.orderId);
    setApprovingKey(null);

    if (result.success) {
      toast.success(`Pago confirmado: ${target.name}`);
      refetch();
    } else {
      toast.error(result.error || 'No se pudo confirmar el pago');
    }
  };

  const handleExport = (format: 'excel' | 'csv') => {
    if (visible.length === 0) {
      toast.warning('No hay registros para exportar');
      return;
    }
    const data = buildExportData(visible, slots);
    const date = new Date().toISOString().split('T')[0];
    if (format === 'excel') {
      generateExcel(data, `comidas_registros_${date}.xlsx`, 'Registros');
    } else {
      generateCSV(data, `comidas_registros_${date}.csv`);
    }
  };

  const renderActions = (r: MealRegistration) => (
    <div className="flex justify-end gap-2">
      {r.paymentState === 'PENDING' && (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={approvingKey === r.key}
          onClick={() => setConfirmTarget(r)}
        >
          {approvingKey === r.key ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Confirmar pago
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="bg-violet-50 hover:bg-violet-100 border-violet-200"
        onClick={() => handleOpenDetails(r)}
        title="Ver detalle"
      >
        <Eye className="h-4 w-4 text-violet-600" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, apellido o código (JC-0247)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
              <SelectTrigger className="md:w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={visible.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Mostrando {visible.length} de {registrations.length} registros
          </p>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6 flex items-center justify-between gap-3 text-red-600">
            <span className="text-sm">{error}</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabla (escritorio) */}
      <Card className="hidden md:block">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Comidas</TableHead>
                  <TableHead>Hospedaje</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Cargando registros...
                    </TableCell>
                  </TableRow>
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((r) => (
                    <TableRow key={r.key}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="font-mono text-sm">{r.code ?? '-'}</TableCell>
                      <TableCell>
                        <MealsCell registration={r} slots={slots} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.lodging?.needed ? formatNights(r.lodging.nights) || 'Sí' : 'No'}
                      </TableCell>
                      <TableCell>
                        <RegistrationBadges registration={r} />
                      </TableCell>
                      <TableCell>{renderActions(r)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas (mobile) */}
      <div className="md:hidden space-y-3">
        {loading && registrations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">Cargando registros...</CardContent>
          </Card>
        ) : visible.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">No se encontraron registros</CardContent>
          </Card>
        ) : (
          visible.map((r) => (
            <Card key={r.key}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-lg leading-tight">{r.name}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{r.code ?? '-'}</p>
                  </div>
                </div>
                <RegistrationBadges registration={r} />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Comidas</p>
                    <MealsCell registration={r} slots={slots} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Hospedaje</p>
                    <p className="text-xs">
                      {r.lodging?.needed ? formatNights(r.lodging.nights) || 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                {renderActions(r)}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmación de pago */}
      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pago</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget && (
                <>
                  Vas a confirmar el pago de <strong>{confirmTarget.name}</strong> por{' '}
                  <strong>{formatMoney(confirmTarget.orderTotal)}</strong>.
                  {sameOrderCount > 1 && (
                    <>
                      {' '}
                      La orden incluye {sameOrderCount} inscripciones y se confirmarán todas.
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmPayment}
            >
              Confirmar pago
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MealRegistrationsTab;
