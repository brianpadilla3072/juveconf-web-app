'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { teamsApi, teamsErrorMessage, useTeamTypes } from '@/hooks/teams/useTeams';
import { formatMoney } from '@/lib/meals';
import type { TeamType, TeamTypeForm } from '@/entities/Team';

const EMPTY_FORM: TeamTypeForm = {
  name: '',
  description: '',
  minPlayers: 1,
  maxPlayers: 10,
  maxTeams: '',
  price: 0,
  isActive: true,
  isPublished: false,
};

const toForm = (t: TeamType): TeamTypeForm => ({
  name: t.name,
  description: t.description ?? '',
  minPlayers: t.minPlayers,
  maxPlayers: t.maxPlayers,
  maxTeams: t.maxTeams === null ? '' : String(t.maxTeams),
  price: t.price,
  isActive: t.isActive,
  isPublished: t.isPublished,
});

export function TeamTypesTab({ eventId }: { eventId: string }) {
  const { types, loading, error, refetch } = useTeamTypes(eventId);
  const [editing, setEditing] = useState<TeamType | 'new' | null>(null);
  const [form, setForm] = useState<TeamTypeForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamType | null>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditing('new');
  };
  const openEdit = (t: TeamType) => {
    setForm(toForm(t));
    setEditing(t);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const maxTeams = form.maxTeams.trim() === '' ? null : Number(form.maxTeams);
    if (form.name.trim().length < 2) return toast.error('Poné un nombre al tipo de equipo');
    if (form.minPlayers > form.maxPlayers) return toast.error('El mínimo no puede superar al máximo');
    if (maxTeams !== null && (!Number.isInteger(maxTeams) || maxTeams < 1)) {
      return toast.error('La cantidad máxima de equipos debe ser un entero mayor a 0 (o vacío)');
    }

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      minPlayers: form.minPlayers,
      maxPlayers: form.maxPlayers,
      maxTeams,
      price: form.price,
      isActive: form.isActive,
      isPublished: form.isPublished,
    };

    setSaving(true);
    try {
      if (editing === 'new') await teamsApi.createType({ ...body, eventId });
      else if (editing) await teamsApi.updateType(editing.id, body);
      toast.success('Tipo de equipo guardado');
      setEditing(null);
      refetch();
    } catch (err: any) {
      toast.error(teamsErrorMessage(err, 'No se pudo guardar el tipo de equipo'));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teamsApi.deleteType(deleteTarget.id);
      toast.success('Tipo de equipo eliminado');
      refetch();
    } catch (err: any) {
      toast.error(teamsErrorMessage(err, 'No se pudo eliminar el tipo de equipo'));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Cada tipo define cuántos participantes admite, cuántos equipos pueden inscribirse y si se ve en el sitio.
        </p>
        <Button onClick={openNew} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo tipo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : types.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Todavía no hay tipos de equipo. Creá el primero (por ejemplo "Fútbol femenino").
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center">Participantes</TableHead>
                  <TableHead className="text-center">Equipos</TableHead>
                  <TableHead>Inscripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-center">
                      {t.minPlayers}–{t.maxPlayers}
                    </TableCell>
                    <TableCell className="text-center">
                      {t.teamsCount}
                      {t.maxTeams !== null ? ` / ${t.maxTeams}` : ''}
                    </TableCell>
                    <TableCell>{t.price > 0 ? formatMoney(t.price) : 'Gratis'}</TableCell>
                    <TableCell className="space-x-1">
                      <Badge variant={t.isActive ? 'default' : 'secondary'}>{t.isActive ? 'Activo' : 'Inactivo'}</Badge>
                      <Badge variant={t.isPublished ? 'default' : 'outline'}>
                        {t.isPublished ? 'Publicado' : 'No publicado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(t)} aria-label={`Editar ${t.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => setDeleteTarget(t)}
                        aria-label={`Eliminar ${t.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing === 'new' ? 'Nuevo tipo de equipo' : 'Editar tipo de equipo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="tt-name">Nombre</Label>
              <Input id="tt-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60} />
            </div>
            <div>
              <Label htmlFor="tt-desc">Descripción (opcional)</Label>
              <Input id="tt-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={300} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tt-min">Mínimo de participantes</Label>
                <Input id="tt-min" type="number" min={1} max={100} value={form.minPlayers} onChange={(e) => setForm({ ...form, minPlayers: Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="tt-max">Máximo de participantes</Label>
                <Input id="tt-max" type="number" min={1} max={100} value={form.maxPlayers} onChange={(e) => setForm({ ...form, maxPlayers: Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="tt-teams">Máximo de equipos</Label>
                <Input id="tt-teams" type="number" min={1} placeholder="Sin límite" value={form.maxTeams} onChange={(e) => setForm({ ...form, maxTeams: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="tt-price">Precio de inscripción (0 = gratis)</Label>
                <Input id="tt-price" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tt-active">Activo</Label>
              <Switch id="tt-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tt-published">Publicado en el sitio</Label>
              <Switch id="tt-published" checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Si ya tiene equipos inscriptos no se puede eliminar: desactivalo para que deje de aparecer en el sitio.
            </AlertDialogDescription>
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
