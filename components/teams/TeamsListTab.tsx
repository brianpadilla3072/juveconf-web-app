'use client';

import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Download, Loader2, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { teamsApi, teamsErrorMessage, useTeamTypes, useTeams } from '@/hooks/teams/useTeams';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { generateExcel } from '@/lib/export/generators/excel';
import { generateCSV } from '@/lib/export/generators/csv';
import type { ExportData } from '@/lib/export/types';
import type { Team } from '@/entities/Team';

const ALL = 'all';

/** Una fila por participante: es lo que se necesita para armar planillas y fixtures */
function buildExportData(teams: Team[]): ExportData {
  return {
    schema: {
      columns: [
        { key: 'type', label: 'Tipo', type: 'string', width: 22 },
        { key: 'team', label: 'Equipo', type: 'string', width: 24 },
        { key: 'firstName', label: 'Nombre', type: 'string', width: 20 },
        { key: 'lastName', label: 'Apellido', type: 'string', width: 20 },
        { key: 'leader', label: 'Líder', type: 'string', width: 24 },
        { key: 'phone', label: 'Teléfono', type: 'string', width: 16 },
        { key: 'email', label: 'Email', type: 'string', width: 28 },
      ],
    },
    rows: teams.flatMap((t) =>
      t.players.map((p) => ({
        type: t.teamType.name,
        team: t.name,
        firstName: p.firstName,
        lastName: p.lastName,
        leader: t.leaderName,
        phone: t.leaderPhone,
        email: t.leaderEmail ?? '',
      })),
    ),
  };
}

export function TeamsListTab({ eventId }: { eventId: string }) {
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const q = useDebouncedValue(search, 300);
  const { types } = useTeamTypes(eventId);
  const { teams, loading, error, refetch } = useTeams(eventId, typeFilter === ALL ? '' : typeFilter, q);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const handleExport = (format: 'excel' | 'csv') => {
    if (teams.length === 0) return toast.warning('No hay equipos para exportar');
    const data = buildExportData(teams);
    const date = new Date().toISOString().split('T')[0];
    if (format === 'excel') generateExcel(data, `equipos_${date}.xlsx`, 'Equipos');
    else generateCSV(data, `equipos_${date}.csv`);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teamsApi.deleteTeam(deleteTarget.id);
      toast.success('Equipo eliminado');
      refetch();
    } catch (err: any) {
      toast.error(teamsErrorMessage(err, 'No se pudo eliminar el equipo'));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipo, líder o participante"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los tipos</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()} aria-label="Actualizar">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('excel')}>Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : teams.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay equipos inscriptos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Equipo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-center">Participantes</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((t) => {
                  const open = expanded === t.id;
                  return (
                    <Fragment key={t.id}>
                      <TableRow className="cursor-pointer" onClick={() => setExpanded(open ? null : t.id)}>
                        <TableCell>{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>{t.teamType.name}</TableCell>
                        <TableCell>{t.leaderName}</TableCell>
                        <TableCell>{t.leaderPhone}</TableCell>
                        <TableCell className="text-center">
                          {t.players.length} / {t.teamType.maxPlayers}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            aria-label={`Eliminar ${t.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(t);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {open && (
                        <TableRow>
                          <TableCell />
                          <TableCell colSpan={6} className="bg-muted/40">
                            <ol className="list-decimal pl-5 text-sm space-y-0.5">
                              {t.players.map((p) => (
                                <li key={p.id}>
                                  {p.firstName} {p.lastName}
                                </li>
                              ))}
                            </ol>
                            {t.leaderEmail && <p className="text-xs text-muted-foreground mt-2">Email del líder: {t.leaderEmail}</p>}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <p className="text-xs text-muted-foreground">
            {teams.length} {teams.length === 1 ? 'equipo' : 'equipos'} · {teams.reduce((n, t) => n + t.players.length, 0)} participantes
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar el equipo "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>El equipo deja de aparecer en el listado y libera su cupo.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
