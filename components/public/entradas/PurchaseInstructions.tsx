import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function PurchaseInstructions() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 p-6 max-h-[90vh] overflow-auto">
      <div className="rounded-lg bg-card text-card-foreground mx-auto max-w-6xl border border-blue-100 shadow-lg overflow-hidden">
        <div className="bg-blue-900 text-white p-1">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <div className="tracking-tight text-2xl md:text-3xl font-bold text-center text-white">Compra de Entradas</div>
            <div className="text-sm text-center text-blue-100">
              Para adquirir tus entradas, sigue estos pasos:
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Contacto</h3>
              <p className="text-gray-600 mb-4">
                Envía un mensaje al WhatsApp: <a href="https://wa.me/542915335545" className="text-orange-500 hover:text-orange-600">2915-335545</a>
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">Expresa tu interés en adquirir entradas y proporciona tus datos básicos</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">2. Pago</h3>
              <p className="text-gray-600 mb-4">
                Realiza la transferencia a la cuenta:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Consagrados.a.jesus</p>
              </div>
            </div>
            <div className="text-center">
              <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                <a href="https://wa.me/542915335545" className="flex items-center space-x-2">
                  <MessageSquare className="text-white w-5 h-5" />
                  <span>¡Contactar por WhatsApp!</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
