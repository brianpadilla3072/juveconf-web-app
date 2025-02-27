import Image from "next/image";
import { Button } from "@/components/ui/button";
import Miheader from "@/public/header.jpg";
export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF3DC] ">
      {/* Hero Section */}
      <section className="min-h-[50vh] sm:min-h-[90vh] h-full relative overflow-hidden flex col justify-center items-center">
        {/* Contenedor de la imagen de fondo */}
        <div className="absolute inset-0 z-0">
          {/* Gradiente sobre la imagen */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent"
            style={{
              position: "absolute",
              inset: "0",
              background:
                "linear-gradient(to top, rgb(0 0 0 / 85%), transparent)",
            }}
          />
          <Image
            src={Miheader}
            alt="Logo Consagrados a Jesús"
            fill
            className="object-cover object-center w-full h-full"
            style={{
              filter: "blur(1px)", // Aplica el desenfoque
            }}
          />
        </div>

        {/* Contenido superpuesto */}
        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-200">
              Consagrados a Jesús
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Un encuentro para profundizar nuestra intimidad con el amado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg"
                className="text-lg px-8 bg-gradient-to-r from-[#FF4D00] to-[#FF8C00] hover:opacity-90 text-white border-none shadow-lg transition-all duration-300 hover:scale-105"
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="vision" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Enciende tu espíritu
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Un tiempo especial de encuentro, adoración y consagración
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src={Miheader}
                alt="Llama de Consagración"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="mision" className="py-20 bg-[#FFF3DC]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Sé parte de esta experiencia transformadora
          </h2>
          <Button
            size="lg"
            className="text-lg px-12 bg-gradient-to-r from-[#FF4D00] to-[#FF8C00] hover:opacity-90 text-white border-none shadow-lg transition-all duration-300 hover:scale-105"
          >
            Reserva tu lugar
          </Button>
        </div>
      </section>
    </div>
  );
}
