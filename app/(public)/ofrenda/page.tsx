"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, Flame } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"



export default function DonationCard() {
  const [copiedCVU, setCopiedCVU] = useState(false)
  const [copiedAlias, setCopiedAlias] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
    const cvu = process.env.NEXT_PUBLIC_DONATION_CVU!
  const alias = process.env.NEXT_PUBLIC_DONATION_ALIAS!
  const email = process.env.NEXT_PUBLIC_DONATION_EMAIL!
  const title = "Apoyá nuestra misión"
  const description = "Tu ayuda nos permite seguir avanzando con este fuego que no se apaga."


  const copyToClipboard = async (text: string, type: "cvu" | "alias") => {
    try {
      await navigator.clipboard.writeText(text)

      if (type === "cvu") {
        setCopiedCVU(true)
        setTimeout(() => setCopiedCVU(false), 2000)
      } else {
        setCopiedAlias(true)
        setTimeout(() => setCopiedAlias(false), 2000)
      }

      toast({
        title: "¡Copiado!",
        description: `${type === "cvu" ? "CVU" : "Alias"} copiado al portapapeles 👍`,
      })

      if (!showThanks) {
        setTimeout(() => {
          setShowThanks(true)
          setTimeout(() => setShowThanks(false), 5000)
        }, 1000)
      }
    } catch (err) {
      toast({
        title: "Ups, algo falló",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="shadow-xl overflow-hidden border-0 bg-white m-3 lg:m-14">
      <CardHeader className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white pb-6">
        <div className="flex items-center justify-center mb-2">
          <Flame className="h-8 w-8 text-white fill-white mr-2" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        <CardDescription className="text-white/90 text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-6 relative">
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 flex flex-col items-center justify-center text-white p-6 z-10"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            >
              <Flame className="h-16 w-16 text-white fill-white mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">¡Gracias por tu apoyo!</h3>
            <p className="text-center">Tu contribución ayuda a mantener viva la llama</p>
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                  CVU
                </span>
                Transferencia bancaria
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                onClick={() => copyToClipboard(cvu, "cvu")}
              >
                {copiedCVU ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copiedCVU ? "¡Copiado!" : "Copiar"}
              </Button>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-50 p-3 rounded-lg text-gray-800 font-mono w-full break-all border-2 border-dashed border-red-200">
                {cvu}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                  ALIAS
                </span>
                Más fácil de recordar
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                onClick={() => copyToClipboard(alias, "alias")}
              >
                {copiedAlias ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copiedAlias ? "¡Copiado!" : "Copiar"}
              </Button>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-50 p-3 rounded-lg text-gray-800 font-mono w-full break-all border-2 border-dashed border-orange-200">
                {alias}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold">¡Cada aporte enciende la llama!</span> Después de realizar tu donación,
                envíanos un mensaje a <span className="font-semibold text-red-700">{email}</span>{" "}
                para agradecerte personalmente.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
