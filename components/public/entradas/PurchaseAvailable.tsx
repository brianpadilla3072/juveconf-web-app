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
import { Users, CalendarDays, User, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Attendee } from "@/entities/Attendee";

export default function PurchaseAvailable({
  combos, attendees, selectedPlan, attendeeCount,
  handlePlanChange, handleSubmit, setEmail, email,
  cuil, setCuil, paymentLoading, updateAttendee,
  errorMessage
}: any) {

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-white to-orange-50/50 p-2 md:p-4 max-h-[90vh] overflow-auto">
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
        <CardFooter className="!p-0">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Button
              type="button"
              size="lg"
              onClick={(e) => handleSubmit(e, "mercadoPago")}
              className="!w-full !flex !items-center !justify-center !gap-3 !bg-[#009ee3] !hover:bg-[#007eb8]/90 !text-white !font-bold !text-lg !py-4 !px-6 !shadow-lg !border-2 !border-[#009ee3] !hover:border-[#007eb8] !transition-all"
              disabled={paymentLoading}
            >
              <CreditCard className="w-7 h-7 !text-white" />
              {paymentLoading ? "Cargando..." : "Pagar con Mercado Pago"}
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={(e) => handleSubmit(e, "transferencia")}
              className="!w-full !flex !items-center !justify-center !gap-3 !bg-green-600 !hover:bg-green-700 !text-white !font-bold !text-lg !py-4 !px-6 !shadow-lg !border-2 !border-green-600 !hover:border-green-700 !transition-all"
            >
              <Banknote className="w-7 h-7 !text-white" />
              Pagar por Transferencia
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
