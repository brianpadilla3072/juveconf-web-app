"use client";
import React from "react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-700 to-orange-500 text-white py-16 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">Consagrados a Jesús</h1>
      <p className="text-xl md:text-2xl mb-6 font-medium">Un llamado a profundizar la intimidad con Cristo y vivir una cultura de adoración.</p>
      <a href="#entradas" className="inline-block bg-white text-orange-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-orange-100 transition">¡Reservá tu lugar!</a>
      <div className="mt-4 text-sm opacity-80">Cultura de adoración e intimidad · 2025</div>
    </section>
  );
}
