import Image from "next/image";
import { Button } from "@/components/ui/button";
import Miheader from "@/public/header.jpg";
import {
  HeroSection,
  Invitados2025,
  NuestroOrigen,
  NuestraVision,
  Lema2025,
  // TestimoniosBreves,
  Cronograma,
  PreguntasFrecuentes,
} from "@/components/ConsagradosAJ2025Sections";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <HeroSection />
      <Lema2025 />
      <Invitados2025 />
      <NuestroOrigen />
      <NuestraVision />
      {/* <TestimoniosBreves /> */}

    </div>
  );
}
