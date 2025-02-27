"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import CDAsvg from "@/public/CDAsvg.svg";
export default function Navigation() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Vision", href: "/#vision" },
    { name: "Mision", href: "/#mision" },
    { name: "Entradas", href: "/payment" },
  ];

  return (
    <>
      <header
        className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm"
        style={{ backgroundColor: "#ffffffdb" }}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Image
            src={CDAsvg}
            alt="Logo Consagrados a Jesús"
            width={60}
            height={60}
            className="w-15 h-15"
          />
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <Button
                  asChild
                  variant="ghost"
                  className="text-gray-800 hover:text-[#FF4D00] hover:bg-[#FFE5B4]/20 transition-all duration-300"
                >
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6 text-gray-700" />
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
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          {/* Header */}
        </div>
      </header>
    </>
  );
}
