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
  phone, setPhone, cuil, setCuil, paymentLoading, updateAttendee,
  errorMessage
}: any) {

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-white to-blue-50 p-2 md:p-6 max-h-[90vh] overflow-auto">
      <Card className="mx-auto max-w-6xl border border-blue-100 shadow-lg overflow-hidden">
        <div className="bg-blue-900 text-white p-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">Registro de Entrada</CardTitle>
            <CardDescription className="text-center text-blue-100">
              Completa tus datos y selecciona tu plan para asegurar tu lugar
            </CardDescription>
          </CardHeader>
        </div>
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
                <Label htmlFor="phone">Número de Teléfono</Label>
                <Input
                  id="phone" type="number" placeholder="291 5035 6245"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cuil">Cuil</Label>
                <Input
                  id="cuil" type="number" placeholder="42469571"
                  value={cuil} onChange={(e) => setCuil(e.target.value)} required
                />
              </div>

              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                  <Users className="h-5 w-5 text-blue-600" />
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
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15h6"/>
                  </svg>
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
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                  <span>Método de Pago</span>
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
