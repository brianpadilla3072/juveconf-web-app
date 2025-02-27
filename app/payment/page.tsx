"use client";

import { useState } from "react";
import {
  CalendarDays,
  CreditCard,
  User,
  Users,
  Plus,
  Minus,
} from "lucide-react";

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

const PRICE_PLANS = [
  {
    id: "individual",
    name: "Individual",
    minPersons: 1,
    maxPersons: 1,
    price: 50,
  },
  {
    id: "small-group",
    name: "Grupo Pequeño",
    minPersons: 3,
    maxPersons: 5,
    price: 40,
  },
  {
    id: "medium-group",
    name: "Grupo Mediano",
    minPersons: 4,
    maxPersons: 6,
    price: 35,
  },
  {
    id: "large-group",
    name: "Grupo Grande",
    minPersons: 6,
    maxPersons: 10,
    price: 30,
  },
];

export default function PaymentForm() {
  const [selectedPlan, setSelectedPlan] = useState(PRICE_PLANS[0]);
  const [attendees, setAttendees] = useState([{ name: "", dni: "" }]);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const updateAttendee = (
    index: number,
    field: "name" | "dni",
    value: string
  ) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handlePlanChange = (planId: string) => {
    const plan = PRICE_PLANS.find((p) => p.id === planId)!;
    setSelectedPlan(plan);
    if (attendees.length < plan.minPersons) {
      setAttendees(Array(plan.minPersons).fill({ name: "", dni: "" }));
    }
  };

  const addAttendee = () => {
    if (attendees.length < selectedPlan.minPersons) {
      setAttendees([...attendees, { name: "", dni: "" }]);
    }
  };

  const removeAttendee = () => {
    if (attendees.length > selectedPlan.minPersons) {
      setAttendees(attendees.slice(0, -1));
    }
  };

  const updateCardDetails = (
    field: keyof typeof cardDetails,
    value: string
  ) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const totalPrice = selectedPlan.price * attendees.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/50 p-4 md:p-8">
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
            {/* Columna izquierda: Datos de los usuarios */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Invitaos ({attendees.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={removeAttendee}
                    disabled={attendees.length <= selectedPlan.minPersons}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addAttendee}
                    disabled={attendees.length >= selectedPlan.maxPersons} // Deshabilita cuando se alcanza el máximo
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-4 m-1">
                {attendees.map((attendee, index) => (
                  <div
                    id={"inditado" + index + "inid"}
                    key={"inditado" + index + "inid"}
                    className="space-y-4"
                  >
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Invitado {index + 1}</span>
                    </div>
                    <div className="grid gap-4 m-1">
                      <div className="grid gap-2">
                        <Label htmlFor={`name-${index}`}>Nombre Completo</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Ingresa tu nombre"
                          value={attendee.name}
                          onChange={(e) =>
                            updateAttendee(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2 m-1">
                        <Label htmlFor={`dni-${index}`}>DNI</Label>
                        <Input
                          id={`dni-${index}`}
                          type="number"
                          placeholder="Ej: 12345678"
                          value={attendee.dni}
                          onChange={(e) =>
                            updateAttendee(index, "dni", e.target.value)
                          }
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: Planes, pago y resumen */}
            <div className="space-y-6">
              {/* Selección de Plan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Selecciona tu Plan</span>
                </div>
                <Select
                  onValueChange={handlePlanChange}
                  defaultValue={selectedPlan.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_PLANS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price}/persona (min.{" "}
                        {plan.minPersons})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Método de Pago */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-6 w-4" />
                  <span>Método de Pago</span>
                </div>
                <div className="relative h-56 w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                  {/* Gradiente de fondo inspirado en el logo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff4400] via-orange-500 to-yellow-400 opacity-10" />

                  {/* Logo */}
                  <div className="absolute top-4 left-4 w-12 h-12">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250217-WA0034.jpg-cleFGyG6mLixGAYEG7e5XEgFtQnMu3.jpeg"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Campos de entrada */}
                  <div className="flex flex-col gap-2 justify-center items-start absolute bottom-12">
                    <Input
                      className="relative  left-4 right-4 bg-transparent text-[#ff4400] text-2xl tracking-widest border-none placeholder-gray-400/50 font-mono"
                      placeholder="•••• •••• •••• ••••"
                      style={{ fontSize: "medium", width: "120%" }}
                      value={cardDetails.number}
                      onChange={(e) =>
                        updateCardDetails("number", e.target.value)
                      }
                      type="number"
                      maxLength={19}
                    />
                    <Input
                      className="relative  left-4 w-3/4 bg-transparent text-[#ff4400] text-sm tracking-wider border-none placeholder-gray-400/50"
                      placeholder="NOMBRE DEL TITULAR"
                      value={cardDetails.name}
                      style={{ fontSize: "medium", width: "120%" }}
                      onChange={(e) =>
                        updateCardDetails("name", e.target.value)
                      }
                    />
                  </div>
                  <div
                    className="absolute w-[51%] right-4 bottom-4 flex flex-row sm:flex-col gap-2 sm:right-5 items-end sm:w-[30%] "
                    style={{}}
                  >
                    <Input
                      className=" bg-transparent text-[#ff4400] tracking-wider border-none placeholder-gray-400/50 text-right  "
                      style={{ fontSize: "medium" }}
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        updateCardDetails("expiry", e.target.value)
                      }
                      maxLength={5}
                    />
                    <Input
                      className=" bg-transparent text-[#ff4400] text-sm tracking-wider border-none placeholder-gray-400/50 text-right"
                      placeholder="CVV"
                      value={cardDetails.cvc}
                      onChange={(e) => updateCardDetails("cvc", e.target.value)}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Resumen */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Resumen</span>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{selectedPlan.name}</span>
                    <span>
                      {attendees.length}{" "}
                      {attendees.length === 1 ? "persona" : "personas"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precio por persona</span>
                    <span>${selectedPlan.price}.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#ff4400] hover:bg-[#ff4400]/90">
            Completar Registro
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
