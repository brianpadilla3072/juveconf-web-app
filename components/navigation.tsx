"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart } from "lucide-react"
import CDAsvg from "@/public/CDAsvg.svg"

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname();

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Cronograma", href: "/cronograma" },
    { name: "Invitados", href: "/invitados" },
    { name: "Entradas", href: "/entradas" },
    { name: "Ofrendas", href: "/ofrenda", icon: <Heart className="h-4 w-4 text-orange-500 stroke-orange-500 fill-none" /> },
  ]

  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src={CDAsvg}
                alt="Consagrados a Jesús"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
              Consagrados a Jesús
            </span>
          </Link>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-[#FFA500]/20">
                <nav className="flex flex-col gap-4 mt-8">
                  {menuItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.name} href={item.href} passHref>
                        <Button
                          asChild
                          variant="ghost"
                          className={`w-full justify-start text-lg transition-all duration-300 flex items-center gap-2
                            ${active ? 'text-orange-700 bg-orange-50 font-bold underline' : 'text-gray-800 hover:text-[#FF4D00] hover:bg-[#FFE5B4]/20'}`}
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {item.name}
                          </span>
                        </Button>
                      </Link>
                    );
                  })}
                  <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white w-full mt-4">
                    ¡Inscribite!
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md transition-colors font-medium flex items-center gap-1 ${active ? 'text-orange-700 bg-orange-50 font-bold underline' : 'text-gray-700 hover:text-orange-600'}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
            {/*
            Botón de ingreso: lleva al usuario a la página de login. Estilizado con gradiente naranja y texto blanco.
            <Link href="/login">
              <Button className="ml-4 bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-700 text-white">
                ¡Igresar!
              </Button>
            </Link>
            */}
          </nav>
        </div>
      </div>
    </header>
  )
}

// Prompt para redacción de contenidos – “Consagrados a Jesús 2025” como bloque de código visible
export function PromptRedaccionCJ2025() {
  return (
    <pre style={{whiteSpace: 'pre-wrap', fontSize: 13, background: '#222', color: '#fff', padding: 16, borderRadius: 8, margin: 24}}>
      <code>{`
Prompt para redacción de contenidos – “Consagrados a Jesús 2025”

Objetivo general:
Crear todo el texto de la web oficial del congreso “Consagrados a Jesús 2025”, transmitiendo misión, visión, valores, datos prácticos y espíritu del evento. El tono debe ser formal y profesional, pero también inspirador y cercano, con humor rápido cuando aporte frescura. Adoptar una visión de futuro y fundamentar cada afirmación en datos y citas bíblicas, manteniendo el enfoque práctico y directo.

1. Hero Section
- Título principal: “Consagrados a Jesús”
- Subtítulo inspirador: Breve frase que invite a profundizar la intimidad con Cristo.
- Llamado a la acción (CTA): Texto motivador para “Reservar” o “Inscribirse” de inmediato.
- Estilo: Impactante, aspiracional, alineado al lema “Cultura de adoración e intimidad”.

2. Sección “Invitados 2025”
- Listado de oradores con nombre, cargo y lugar de procedencia:
  - Griselda Alba – Pastora en Ministerio Crecer (San Luis, Argentina)
  - Valentino Nicolás – Líder de jóvenes en Ministerio (…) (Tandil, Argentina)
  - Agustín Schiro – Ministerio “Toma tu lugar” (Córdoba, Argentina)
- Texto introductorio breve que destaque la diversidad de experiencias y ministerios.

3. Entradas
- Explicar claramente cómo adquirirlas y qué incluye cada tipo de entrada (si hay categorías).
- Espacio reservado para imagen del “hoja de entradas”.
- CTA secundario para “Comprar” o “Consultar precios”.

4. Nuestro origen
- Narrativa concisa de la historia:
  - Inicio en 2022 como alternativa a las fiestas de primavera en Monte Hermoso.
  - Reconocimiento de que el congreso es “del corazón de Dios”.
  - Transformación en evento interdenominacional.
  - Apoyo actual de pastores de Bahía Blanca.
- Reflexión sobre “¿Qué significa ser consagrados a Jesús?”, citando Apocalipsis 1:6.

5. Nuestra visión
- Describir la fractura del cuerpo de Cristo: divisiones, competencia.
- Explicar la misión de romper estructuras y promover la unidad (Efesios 4:3-6).
- Metáfora de “novia pura y unida por Cristo”.

6. Lema 2025
- Texto explicativo de “Cultura de adoración e intimidad”.
- Enfoque en la intimidad personal y comunitaria con Cristo.
- Invitar a adorar con todo el ser, más allá de la música.

7. ¿Cómo puedo colaborar?
- Destacar dos formas principales: oraciones y asistencia.
- Mencionar el alias bancario para ofrendas: consagradosajesus (A nombre de Estefanía Victoria Vázquez).
- Llamado emotivo, práctico y directo.

8. Testimonios breves
- Incluir 3–5 testimonios reales de asistentes anteriores.
- Cada testimonio debe tener nombre, ciudad y una frase de impacto.

9. Cronograma
- Texto introductorio corto: “Así será el desarrollo del congreso”.
- Espacio reservado para la imagen del cronograma.

10. Preguntas frecuentes (FAQ)
- ¿Qué debo llevar?
  - Almuerzo y merienda (no hay buffet).  
    *Humor*: “¡Trae tu tupper como un verdadero peregrino moderno!”
  - Equipo de mate y termo (agua disponible).
  - Biblia y cuaderno o dispositivo para notas.
  - Instrumentos musicales para los breaks (opcional).
- ¿Puedo cancelar mi entrada?
  - No hay devoluciones, pero sí cambio de titularidad.
  - Número de contacto: +54 9 291 432 6563.

11. Sección “Contacto y redes”
- Instagram: @consagradosa_jesus
- Teléfono/WhatsApp: +54 9 291 432 6563
- Correo electrónico: equipo@consagradosajesus.org (proponer uno profesional si es necesario)
- Ubicación: Bahía Blanca, Buenos Aires, Argentina

Instrucciones de estilo y formato:
- Cada sección debe llevar un título claro y breve.
- Párrafos de no más de 4 líneas, con lenguaje directo.
- Incorporar versículos bíblicos entre paréntesis para reforzar argumentos.
- Uso ocasional de humor rápido (ejemplo: “¡Trae tu tupper como un verdadero peregrino moderno!”).
- Destacar llamadas a la acción con verbos en imperativo.
- Toda la información práctica (fechas, contactos, alias) debe ser precisa y fácil de localizar.

Con este prompt, cualquier redactor o IA podrá generar un texto completo, coherente y alineado con la identidad de “Consagrados a Jesús 2025”.
`}</code>
    </pre>
  );
}

/*

Objetivo general:
Crear todo el texto de la web oficial del congreso “Consagrados a Jesús 2025”, transmitiendo misión, visión, valores, datos prácticos y espíritu del evento. El tono debe ser formal y profesional, pero también inspirador y cercano, con humor rápido cuando aporte frescura. Adoptar una visión de futuro y fundamentar cada afirmación en datos y citas bíblicas, manteniendo el enfoque práctico y directo.

1. Hero Section
- Título principal: “Consagrados a Jesús”
- Subtítulo inspirador: Breve frase que invite a profundizar la intimidad con Cristo.
- Llamado a la acción (CTA): Texto motivador para “Reservar” o “Inscribirse” de inmediato.
- Estilo: Impactante, aspiracional, alineado al lema “Cultura de adoración e intimidad”.

2. Sección “Invitados 2025”
- Listado de oradores con nombre, cargo y lugar de procedencia:
  - Griselda Alba – Pastora en Ministerio Crecer (San Luis, Argentina)
  - Valentino Nicolás – Líder de jóvenes en Ministerio (…) (Tandil, Argentina)
  - Agustín Schiro – Ministerio “Toma tu lugar” (Córdoba, Argentina)
- Texto introductorio breve que destaque la diversidad de experiencias y ministerios.

3. Entradas
- Explicar claramente cómo adquirirlas y qué incluye cada tipo de entrada (si hay categorías).
- Espacio reservado para imagen del “hoja de entradas”.
- CTA secundario para “Comprar” o “Consultar precios”.

4. Nuestro origen
- Narrativa concisa de la historia:
  - Inicio en 2022 como alternativa a las fiestas de primavera en Monte Hermoso.
  - Reconocimiento de que el congreso es “del corazón de Dios”.
  - Transformación en evento interdenominacional.
  - Apoyo actual de pastores de Bahía Blanca.
- Reflexión sobre “¿Qué significa ser consagrados a Jesús?”, citando Apocalipsis 1:6.

5. Nuestra visión
- Describir la fractura del cuerpo de Cristo: divisiones, competencia.
- Explicar la misión de romper estructuras y promover la unidad (Efesios 4:3-6).
- Metáfora de “novia pura y unida por Cristo”.

6. Lema 2025
- Texto explicativo de “Cultura de adoración e intimidad”.
- Enfoque en la intimidad personal y comunitaria con Cristo.
- Invitar a adorar con todo el ser, más allá de la música.

7. ¿Cómo puedo colaborar?
- Destacar dos formas principales: oraciones y asistencia.
- Mencionar el alias bancario para ofrendas: consagradosajesus (A nombre de Estefanía Victoria Vázquez).
- Llamado emotivo, práctico y directo.

8. Testimonios breves
- Incluir 3–5 testimonios reales de asistentes anteriores.
- Cada testimonio debe tener nombre, ciudad y una frase de impacto.

9. Cronograma
- Texto introductorio corto: “Así será el desarrollo del congreso”.
- Espacio reservado para la imagen del cronograma.

10. Preguntas frecuentes (FAQ)
- ¿Qué debo llevar?
  - Almuerzo y merienda (no hay buffet).  
    *Humor*: “¡Trae tu tupper como un verdadero peregrino moderno!”
  - Equipo de mate y termo (agua disponible).
  - Biblia y cuaderno o dispositivo para notas.
  - Instrumentos musicales para los breaks (opcional).
- ¿Puedo cancelar mi entrada?
  - No hay devoluciones, pero sí cambio de titularidad.
  - Número de contacto: +54 9 291 432 6563.

11. Sección “Contacto y redes”
- Instagram: @consagradosa_jesus
- Teléfono/WhatsApp: +54 9 291 432 6563
- Correo electrónico: equipo@consagradosajesus.org (proponer uno profesional si es necesario)
- Ubicación: Bahía Blanca, Buenos Aires, Argentina

Instrucciones de estilo y formato:
- Cada sección debe llevar un título claro y breve.
- Párrafos de no más de 4 líneas, con lenguaje directo.
- Incorporar versículos bíblicos entre paréntesis para reforzar argumentos.
- Uso ocasional de humor rápido (ejemplo: “¡Trae tu tupper como un verdadero peregrino moderno!”).
- Destacar llamadas a la acción con verbos en imperativo.
- Toda la información práctica (fechas, contactos, alias) debe ser precisa y fácil de localizar.

Con este prompt, cualquier redactor o IA podrá generar un texto completo, coherente y alineado con la identidad de “Consagrados a Jesús 2025”.
*/
