'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Ingreso {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  metodoPago: string;
  notas?: string;
  year: number;
  createdAt: string;
}

interface Egreso {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  metodoPago: string;
  notas?: string;
  year: number;
  createdAt: string;
}

interface Balance {
  year: number;
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  countIngresos: number;
  countEgresos: number;
  porcentajeGanancia: number;
}

export default function FinanzasPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form states
  const [ingresoForm, setIngresoForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    monto: '',
    metodoPago: '',
    notas: '',
    year: new Date().getFullYear()
  });

  const [egresoForm, setEgresoForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    monto: '',
    metodoPago: '',
    notas: '',
    year: new Date().getFullYear()
  });

  const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null);
  const [editingEgreso, setEditingEgreso] = useState<Egreso | null>(null);
  const [isIngresoDialogOpen, setIsIngresoDialogOpen] = useState(false);
  const [isEgresoDialogOpen, setIsEgresoDialogOpen] = useState(false);

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ingresosRes, egresosRes, balanceRes] = await Promise.all([
        fetch(`/api/finanzas/ingresos?year=${selectedYear}`),
        fetch(`/api/finanzas/egresos?year=${selectedYear}`),
        fetch(`/api/finanzas/balance?year=${selectedYear}`)
      ]);

      if (ingresosRes.ok) {
        const ingresosData = await ingresosRes.json();
        setIngresos(ingresosData);
      }

      if (egresosRes.ok) {
        const egresosData = await egresosRes.json();
        setEgresos(egresosData);
      }

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setBalance(balanceData);
      }
    } catch (error) {
      toast.error('Error al cargar datos financieros');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  // Create/Update Ingreso
  const handleIngresoSubmit = async () => {
    try {
      const url = editingIngreso ? `/api/finanzas/ingresos/${editingIngreso.id}` : '/api/finanzas/ingresos';
      const method = editingIngreso ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ingresoForm,
          monto: parseFloat(ingresoForm.monto),
          year: selectedYear
        }),
      });

      if (!response.ok) throw new Error('Error al guardar ingreso');

      toast.success(editingIngreso ? 'Ingreso actualizado' : 'Ingreso creado');
      setIsIngresoDialogOpen(false);
      setEditingIngreso(null);
      setIngresoForm({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        monto: '',
        metodoPago: '',
        notas: '',
        year: new Date().getFullYear()
      });
      loadData();
    } catch (error) {
      toast.error('Error al guardar ingreso');
      console.error(error);
    }
  };

  // Create/Update Egreso
  const handleEgresoSubmit = async () => {
    try {
      const url = editingEgreso ? `/api/finanzas/egresos/${editingEgreso.id}` : '/api/finanzas/egresos';
      const method = editingEgreso ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...egresoForm,
          monto: parseFloat(egresoForm.monto),
          year: selectedYear
        }),
      });

      if (!response.ok) throw new Error('Error al guardar egreso');

      toast.success(editingEgreso ? 'Egreso actualizado' : 'Egreso creado');
      setIsEgresoDialogOpen(false);
      setEditingEgreso(null);
      setEgresoForm({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        monto: '',
        metodoPago: '',
        notas: '',
        year: new Date().getFullYear()
      });
      loadData();
    } catch (error) {
      toast.error('Error al guardar egreso');
      console.error(error);
    }
  };

  // Delete functions
  const deleteIngreso = async (id: string) => {
    try {
      const response = await fetch(`/api/finanzas/ingresos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar ingreso');
      toast.success('Ingreso eliminado');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar ingreso');
      console.error(error);
    }
  };

  const deleteEgreso = async (id: string) => {
    try {
      const response = await fetch(`/api/finanzas/egresos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar egreso');
      toast.success('Egreso eliminado');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar egreso');
      console.error(error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finanzas</h1>
          <p className="text-muted-foreground">Control de ingresos y egresos</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025, 2026].map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="egresos">Egresos</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6">
          {balance && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(balance.totalIngresos)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {balance.countIngresos} transacciones
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(balance.totalEgresos)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {balance.countEgresos} transacciones
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <DollarSign className={`h-4 w-4 ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(balance.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {balance.balance >= 0 ? 'Ganancia' : 'Pérdida'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">% Ganancia</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance.porcentajeGanancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance.porcentajeGanancia.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sobre ingresos totales
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Ingresos Tab */}
        <TabsContent value="ingresos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Ingresos {selectedYear}</h2>
            <Dialog open={isIngresoDialogOpen} onOpenChange={setIsIngresoDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingIngreso(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Ingreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingIngreso ? 'Editar Ingreso' : 'Nuevo Ingreso'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={ingresoForm.fecha}
                      onChange={(e) => setIngresoForm(prev => ({ ...prev, fecha: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="concepto">Concepto</Label>
                    <Input
                      id="concepto"
                      placeholder="Ej: Venta de entradas"
                      value={ingresoForm.concepto}
                      onChange={(e) => setIngresoForm(prev => ({ ...prev, concepto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monto">Monto</Label>
                    <Input
                      id="monto"
                      type="number"
                      placeholder="0.00"
                      value={ingresoForm.monto}
                      onChange={(e) => setIngresoForm(prev => ({ ...prev, monto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select 
                      value={ingresoForm.metodoPago} 
                      onValueChange={(value) => setIngresoForm(prev => ({ ...prev, metodoPago: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="mercadopago">MercadoPago</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas (opcional)</Label>
                    <Textarea
                      id="notas"
                      placeholder="Observaciones adicionales..."
                      value={ingresoForm.notas}
                      onChange={(e) => setIngresoForm(prev => ({ ...prev, notas: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsIngresoDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleIngresoSubmit}>
                    {editingIngreso ? 'Actualizar' : 'Crear'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingresos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay ingresos registrados para {selectedYear}
                      </TableCell>
                    </TableRow>
                  ) : (
                    ingresos.map((ingreso) => (
                      <TableRow key={ingreso.id}>
                        <TableCell>{formatDate(ingreso.fecha)}</TableCell>
                        <TableCell className="font-medium">{ingreso.concepto}</TableCell>
                        <TableCell className="text-green-600 font-bold">
                          {formatCurrency(ingreso.monto)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ingreso.metodoPago}</Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate">{ingreso.notas || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingIngreso(ingreso);
                                setIngresoForm({
                                  fecha: ingreso.fecha.split('T')[0],
                                  concepto: ingreso.concepto,
                                  monto: ingreso.monto.toString(),
                                  metodoPago: ingreso.metodoPago,
                                  notas: ingreso.notas || '',
                                  year: ingreso.year
                                });
                                setIsIngresoDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteIngreso(ingreso.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Egresos Tab */}
        <TabsContent value="egresos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Egresos {selectedYear}</h2>
            <Dialog open={isEgresoDialogOpen} onOpenChange={setIsEgresoDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingEgreso(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Egreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingEgreso ? 'Editar Egreso' : 'Nuevo Egreso'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={egresoForm.fecha}
                      onChange={(e) => setEgresoForm(prev => ({ ...prev, fecha: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="concepto">Concepto</Label>
                    <Input
                      id="concepto"
                      placeholder="Ej: Alquiler de sonido"
                      value={egresoForm.concepto}
                      onChange={(e) => setEgresoForm(prev => ({ ...prev, concepto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monto">Monto</Label>
                    <Input
                      id="monto"
                      type="number"
                      placeholder="0.00"
                      value={egresoForm.monto}
                      onChange={(e) => setEgresoForm(prev => ({ ...prev, monto: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select 
                      value={egresoForm.metodoPago} 
                      onValueChange={(value) => setEgresoForm(prev => ({ ...prev, metodoPago: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="mercadopago">MercadoPago</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas (opcional)</Label>
                    <Textarea
                      id="notas"
                      placeholder="Observaciones adicionales..."
                      value={egresoForm.notas}
                      onChange={(e) => setEgresoForm(prev => ({ ...prev, notas: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEgresoDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEgresoSubmit}>
                    {editingEgreso ? 'Actualizar' : 'Crear'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {egresos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay egresos registrados para {selectedYear}
                      </TableCell>
                    </TableRow>
                  ) : (
                    egresos.map((egreso) => (
                      <TableRow key={egreso.id}>
                        <TableCell>{formatDate(egreso.fecha)}</TableCell>
                        <TableCell className="font-medium">{egreso.concepto}</TableCell>
                        <TableCell className="text-red-600 font-bold">
                          {formatCurrency(egreso.monto)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{egreso.metodoPago}</Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate">{egreso.notas || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEgreso(egreso);
                                setEgresoForm({
                                  fecha: egreso.fecha.split('T')[0],
                                  concepto: egreso.concepto,
                                  monto: egreso.monto.toString(),
                                  metodoPago: egreso.metodoPago,
                                  notas: egreso.notas || '',
                                  year: egreso.year
                                });
                                setIsEgresoDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEgreso(egreso.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}