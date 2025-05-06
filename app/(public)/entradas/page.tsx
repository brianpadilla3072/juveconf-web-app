"use client";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from 'axios';
import { CalendarDays, User, Users, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Configuración simplificada de axios (siempre autorizado)
const api = axios.create({
  baseURL: process.env.SERVER_API || 'http://localhost:3072',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const PRICE_PLANS = [
  { id: "individual", name: "Individual", minPersons: 1, maxPersons: 1, price: 50 },
  { id: "small-group", name: "Grupo Pequeño", minPersons: 3, maxPersons: 5, price: 40 },
  { id: "medium-group", name: "Grupo Mediano", minPersons: 4, maxPersons: 6, price: 35 },
  { id: "large-group", name: "Grupo Grande", minPersons: 6, maxPersons: 10, price: 30 },
];

interface Attendee {
  name: string;
  dni: string;
}

export default function PaymentForm() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(PRICE_PLANS[0]);
  const [attendees, setAttendees] = useState<Attendee[]>(
    
    Array.from({ length: PRICE_PLANS[0].minPersons }, () => ({ name: "", dni: "" }))
  );
  const [email, setEmail] = useState("");

  const handlePlanChange = (planId: string) => {
    const plan = PRICE_PLANS.find((p) => p.id === planId)!;
    setSelectedPlan(plan);
    if (attendees.length < plan.minPersons) {
      setAttendees(
        Array.from({ length: plan.minPersons }, () => ({ name: "", dni: "" }))
      );
    }
    if (attendees.length > plan.maxPersons) {
      setAttendees((prev) => prev.slice(0, plan.maxPersons));
    }
  };

  const updateAttendee = (index: number, field: keyof Attendee, value: string) => {
    setAttendees((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const addAttendee = () => {
    if (attendees.length < selectedPlan.maxPersons) {
      setAttendees((prev) => [...prev, { name: "", dni: "" }]);
    }
  };

  const removeAttendee = () => {
    if (attendees.length > selectedPlan.minPersons) {
      setAttendees((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: selectedPlan.id,
        email:email,
        title: selectedPlan.name,
        unit_price: selectedPlan.price * attendees.length,
        quantity: 1,
        minPersons: selectedPlan.minPersons,
        maxPersons: selectedPlan.maxPersons,
        attendees,
      };
      console.log(payload);
      
      const response = await api.post<any>('/mercadopago/preference', payload);
      console.log(response.data.initPoint);
      
      window.location.assign(response.data.initPoint);

    } catch (error) {
      console.error("Error al generar preference:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-b from-white to-orange-50/50 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
      
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">
            Registro de Entrada
          </CardTitle>
          <CardDescription className="text-center">
            Completa tus datos y selecciona tu plan para asegurar tu lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Izquierda */}
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email" type="email" placeholder="ejemplo@dominio.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                  />
                </div>
            
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Invitados ({attendees.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={removeAttendee} disabled={attendees.length <= selectedPlan.minPersons}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={addAttendee} disabled={attendees.length >= selectedPlan.maxPersons}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 m-1">
                {attendees.map((att, idx) => (
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

            {/* Derecha */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Selecciona tu Plan</span>
                </div>
                <Select defaultValue={selectedPlan.id} onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_PLANS.map((plan) => (
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
                    <span>{selectedPlan.name}</span>
                    <span>{attendees.length} {attendees.length === 1 ? "persona" : "personas"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precio por persona</span>
                    <span>${selectedPlan.price}.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedPlan.price * attendees.length}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-[#ff4400] hover:bg-[#ff4400]/90">
            Completar Registro
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
