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
    <Card className="shadow-xl overflow-hidden border border-blue-100 bg-white m-3 lg:m-14 max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white pb-8 pt-10 px-8">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600/20 p-3 rounded-full mb-4">
            <Flame className="h-10 w-10 text-white fill-white" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center mb-2">{title}</CardTitle>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full my-3"></div>
          <CardDescription className="text-blue-100/90 text-center text-base max-w-2xl">{description}</CardDescription>
        </div>
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
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 text-center">
                <span className="font-semibold text-blue-900">¡Cada aporte enciende la llama!</span> Después de realizar tu donación,
                envíanos un mensaje a <span className="font-semibold text-blue-700 underline">{email}</span>{" "}
                para agradecerte personalmente.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
