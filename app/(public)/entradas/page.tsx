"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader,
  CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, CalendarDays, User } from "lucide-react";
import { useQueryCombos } from "@/hooks/combos/useQueryCombos";
import { useMercadoPago } from "@/hooks/mercadoPago/useMercadoPagoCreatePreference";
import { useQueryEvents } from "@/hooks/Events/useQueryEvents";
import { useTransferOrder } from "@/hooks/Transfers/useTransferOrder";

interface Attendee {
  name: string;
  cuil: string;
}

function hasSalesStarted(salesStartDate: string): boolean {
  return new Date(salesStartDate).getTime() <= Date.now();
}

function PurchaseAvailable({
  combos, attendees, selectedPlan, attendeeCount,
  handlePlanChange, handleSubmit, setEmail, email,
  cuil, setCuil, paymentLoading, updateAttendee,
  errorMessage
}: any) {

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
          {/* Mostrar mensaje de error aquí */}
          {errorMessage && (
            <div className="text-red-600 font-semibold text-center mb-4">
              {errorMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email" type="email" placeholder="ejemplo@dominio.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cuil">Cuil</Label>
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
                {attendees.map((att: Attendee, idx: number) => (
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
                        <Label htmlFor={`cuil-${idx}`}>Cuil</Label>
                        <Input
                          id={`cuil-${idx}`} type="number"
                          placeholder="Ej: 12345678"
                          value={att.cuil}
                          onChange={(e) => updateAttendee(idx, "cuil", e.target.value)}
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
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "mercadoPago")}
            className="w-full bg-[#009ee3] hover:bg-[#007eb8]/90"
            disabled={paymentLoading}
          >
            {paymentLoading ? "Cargando..." : "Pagar con MercadoPago"}
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "transferencia")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Pagar por Transferencia
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

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
  const { createTransferOrder, loading:LoadingCreateTransferOrder, error:ErrorCreateTransferOrder, success:SuccessCreateTransferOrder } = useTransferOrder();
  const { events, isLoading: isLoadingEvents, error: errorEvents } = useQueryEvents();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [email, setEmail] = useState("");
  const [cuil, setCuil] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(0);

  // Estado para errores en el frontend
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const enableSaleDate = events[0]?.salesStartDate
    ? hasSalesStarted(events[0].salesStartDate)
    : false;

  useEffect(() => {
    if (combos.length > 0) {
      const initialPlan = combos[0];
      setSelectedPlan(initialPlan);
      setAttendeeCount(initialPlan.minPersons);
      setAttendees(Array.from({ length: initialPlan.minPersons }, () => ({ name: "", cuil: "" })));
    }
  }, [combos]);

  const handlePlanChange = (planId: string) => {
    const plan = combos.find((p) => p.id === planId)!;
    setSelectedPlan(plan);
    setAttendeeCount(plan.minPersons);
    setAttendees(Array.from({ length: plan.minPersons }, () => ({ name: "", cuil: "" })));
  };

  const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
    setAttendees((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const handleSubmit = async (e: React.FormEvent, method: "mercadoPago" | "transferencia") => {
    e.preventDefault();
    setErrorMessage(null); // resetear error al enviar
    try {
      const totalAmount = (selectedPlan?.price || 0) * (attendeeCount || 0);

      const payload = {
        id: selectedPlan?.id,
        email,
        cuil,
        title: selectedPlan?.name,
        unit_price: totalAmount,
        quantity: 1,
        minPersons: selectedPlan?.minPersons,
        maxPersons: selectedPlan?.maxPersons,
        attendees,
        eventId: selectedPlan.eventId,
        paymentMethod: method,
      };

      if (method === "mercadoPago") {
        const initPoint = await createPreference(payload);
        if (initPoint) {
          window.location.assign(initPoint);
        }
      } else if (method === "transferencia") {
        const status =await createTransferOrder(payload)
        if ( status) {
          alert("Gracias por registrarte. Te enviaremos los datos para la transferencia al correo.");
        }
      }
    } catch (error: any) {
      setErrorMessage("Ocurrió un error al procesar el pago. Intenta nuevamente.");
      setErrorMessage(paymentError)
      
    }
  };

  if (isLoading || isLoadingEvents) {
    return <div>Cargando...</div>;
  }

  if (enableSaleDate) {
    return <PurchaseUnavailable />;
  }

  return (
    <PurchaseAvailable
      combos={combos}
      attendees={attendees}
      selectedPlan={selectedPlan}
      attendeeCount={attendeeCount}
      handlePlanChange={handlePlanChange}
      handleSubmit={handleSubmit}
      setEmail={setEmail}
      email={email}
      cuil={cuil}
      setCuil={setCuil}
      paymentLoading={paymentLoading}
      updateAttendee={updateAttendee}
      errorMessage={errorMessage}
    />
  );
}
