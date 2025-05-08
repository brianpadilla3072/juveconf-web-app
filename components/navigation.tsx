"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Heart } from "lucide-react"
import CDAsvg from "@/public/CDAsvg.svg"

export default function Navigation() {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Programa", href: "/programa" },
    { name: "Oradores", href: "/oradores" },
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
                  {menuItems.map((item) => (
                    <Link key={item.name} href={item.href} passHref>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start text-lg text-gray-800 hover:text-[#FF4D00] hover:bg-[#FFE5B4]/20 transition-all duration-300"
                        onClick={() => setOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.name}
                        </span>
                      </Button>
                    </Link>
                  ))}
                  <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white w-full mt-4">
                    ¡Inscribite!
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-gray-700 hover:text-orange-600 rounded-md transition-colors font-medium flex items-center gap-1"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Link href="/login">
            <Button className="ml-4 bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-700 text-white">
              ¡Igresar!
            </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
