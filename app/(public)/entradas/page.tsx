"use client";
   import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQueryCombos } from "@/hooks/combos/useQueryCombos";
import { useMercadoPago } from "@/hooks/mercadoPago/useMercadoPagoCreatePreference";
import { useQueryEvents } from "@/hooks/Events/useQueryEvents";
import { useTransferOrder } from "@/hooks/Transfers/useTransferOrder";
import { Attendee } from "@/entities/Attendee";
import PurchaseAvailable from "@/components/public/entradas/PurchaseAvailable";
import PurchaseInstructions from "@/components/public/entradas/PurchaseInstructions";
import { PreguntasFrecuentes } from "@/components/ConsagradosAJ2025Sections";



function hasSalesStarted(salesStartDate: string): boolean {
  return new Date(salesStartDate).getTime() <= Date.now();
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
          setAttendees([])
          setCuil('')
          setEmail('')
          setSelectedPlan(null)
        }
      } else if (method === "transferencia") {
        const status =await createTransferOrder(payload)
        if ( status) {
          setShowSuccessModal(true);
          setAttendees([])
          setCuil('')
          setEmail('')
          setSelectedPlan(null)
        }
      }
    } catch (error: any) {
      setErrorMessage("Ocurrió un error al procesar el pago. Intenta nuevamente.");
      setErrorMessage(paymentError)
      
    }
  };

  // Indicador de carga oculto temporalmente
  if (false) {
    return null;
  }

  if (enableSaleDate) {
    return <PurchaseUnavailable />;
  }

  return (
    <>
    {/* /* <PurchaseAvailable
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
    /> */}
    <PurchaseInstructions />
      <PreguntasFrecuentes />
 
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registro Exitoso</DialogTitle>
          <DialogDescription>
            Gracias por registrarte. Te enviaremos los datos para la transferencia al correo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
