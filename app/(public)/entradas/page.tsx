"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, CalendarDays, User } from "lucide-react";
import { useQueryCombos } from "@/hooks/combos/useQueryCombos";
import { useMercadoPago } from "@/hooks/mercadoPago/useMercadoPagoCreatePreference";
import { useQueryEvents } from "@/hooks/Events/useQueryEvents";

interface Attendee {
  name: string;
  dni: string;
}

function hasSalesStarted(salesStartDate: string): boolean {
return new Date(salesStartDate).getTime() <= Date.now();
}

// Componente cuando la venta está habilitada
function PurchaseAvailable({ combos, attendees, selectedPlan, attendeeCount, handlePlanChange, handleSubmit, setEmail, email, cuil, setCuil, paymentLoading, updateAttendee }: any) {

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-b from-white to-orange-50/50 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Registro de Entrada</CardTitle>
          <CardDescription className="text-center">
            Completa tus datos y selecciona tu plan para asegurar tu lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email" type="email" placeholder="ejemplo@dominio.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Cuil</Label>
                <Input
                  id="cuil" type="number" placeholder="42469571"
                  value={cuil} onChange={(e) => setCuil(e.target.value)} required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Invitados ({attendeeCount})</span>
                </div>
              </div>
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 m-1">
                {attendees.map((att: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    {idx > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Invitado {idx + 1}</span>
                    </div>
                    <div className="grid gap-4 m-1">
                      <div className="grid gap-2">
                        <Label htmlFor={`name-${idx}`}>Nombre Completo</Label>
                        <Input
                          id={`name-${idx}`} placeholder="Ingresa tu nombre"
                          value={att.name}
                          onChange={(e) => updateAttendee(idx, "name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`dni-${idx}`}>DNI</Label>
                        <Input
                          id={`dni-${idx}`} type="number" min={1} max={9999999999}
                          placeholder="Ej: 12345678"
                          value={att.dni}
                          onChange={(e) => updateAttendee(idx, "dni", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Selecciona tu Plan</span>
                </div>
                <Select defaultValue={selectedPlan?.id} onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {combos.map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price}/persona (min. {plan.minPersons})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Resumen</span>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{selectedPlan?.name}</span>
                    <span>{attendeeCount} {attendeeCount === 1 ? "persona" : "personas"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precio por persona</span>
                    <span>${selectedPlan?.price}.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedPlan?.price * attendeeCount}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-[#ff4400] hover:bg-[#ff4400]/90" disabled={paymentLoading}>
            {paymentLoading ? "Cargando..." : "Completar Registro"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// Componente cuando la venta no está habilitada
function PurchaseUnavailable() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center text-xl font-semibold text-gray-800">
        La venta de entradas aún no ha comenzado. Por favor, regresa más tarde.
      </div>
    </div>
  );
}

export default function PaymentForm() {
  const { combos, isLoading, error } = useQueryCombos();
  const { createPreference, loading: paymentLoading, error: paymentError } = useMercadoPago();
  const { events, isLoading: isLoadingEvents, error: errorEvents } = useQueryEvents();
  const [enableSaleDate, setEnableSaleDate] = useState<boolean>(hasSalesStarted(events[0]?.salesStartDate));
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
 
const [email, setEmail] = useState("");
 const [cuil, setCuil] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(0);

  // Cuando los combos cambian, inicializamos el primer plan
  useEffect(() => {
    if (combos.length > 0) {
      const initialPlan = combos[0];
      setSelectedPlan(initialPlan);
      setAttendeeCount(initialPlan.minPersons);
      setAttendees(Array.from({ length: initialPlan.minPersons }, () => ({ name: "", dni: "" })));
    }
  }, [combos]);



  // Cambio de plan
  const handlePlanChange = (planId: string) => {
    const plan = combos.find((p) => p.id === planId)!;
    setSelectedPlan(plan);
    setAttendeeCount(plan.minPersons);
    setAttendees(Array.from({ length: plan.minPersons }, () => ({ name: "", dni: "" })));
  };

  // Actualiza los datos del asistente
  const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
    setAttendees((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalAmount = (selectedPlan?.price || 0) * (attendeeCount || 0);

      const payload = {
        id: selectedPlan?.id,
        email: email,
        cuil: cuil,
        title: selectedPlan?.name,
        unit_price: totalAmount,
        quantity: 1,
        minPersons: selectedPlan?.minPersons,
        maxPersons: selectedPlan?.maxPersons,
        attendees,
        eventId: selectedPlan.eventId,
      };

      const initPoint = await createPreference(payload);
      if (initPoint) {
        window.location.assign(initPoint);
      }
    } catch (error) {
      console.error("Error al generar preference:", error);
    }
  };

  if (isLoading || isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2 text-gray-800">
          <span className="text-xl font-semibold">Cargando...</span>
        </div>
      </div>
    );
  }

  return enableSaleDate ? (
    <PurchaseAvailable
      combos={combos}
      attendees={attendees}
      selectedPlan={selectedPlan}
      attendeeCount={attendeeCount}
      handlePlanChange={handlePlanChange}
      handleSubmit={handleSubmit}
      email={email}
      cuil={cuil}
      paymentLoading={paymentLoading}
      setEmail={setEmail}
      setCuil={setCuil}
    />
  ) : (
    <PurchaseUnavailable />
  );
}

