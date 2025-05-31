"use client";
import React from "react";

export function NuestroOrigen() {
  return (
    <section className="py-16 px-4 bg-blue-50 relative overflow-hidden" id="origen">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgxMDIsMTI2LDIzNCwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Nuestro Origen</h2>
          <div className="h-1 w-16 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-blue-900/90">
              <p className="text-lg leading-relaxed mb-6">
                <span className="text-orange-500 font-semibold">CAJ</span> se inició en el año 2022 como una alternativa a las fiestas de primavera en Monte Hermoso, pero Dios tenía otros planes. Ese mismo año, nos convenció de que esto era de su corazón, transformó nuestra visión y nos llevó a ser un congreso interdenominacional para fomentar la comunión de la iglesia de Cristo en nuestra ciudad.
              </p>
              <p className="text-lg leading-relaxed">
                Actualmente, contamos con el apoyo de pastores de Bahía Blanca y un equipo comprometido a obedecer lo que Dios desea. ¿Qué significa ser consagrados a Jesús? Hemos sido nombrados <span className="font-semibold text-blue-800">reyes y sacerdotes</span> (<span className="text-orange-600 font-medium">Apocalipsis 1:6</span>), apartados para Él. Queremos que esto arda en nuestra ciudad: vidas que eligen vivir para su amado y anhelan agradar a Dios.
              </p>
              
              <div className="mt-10 pt-6 border-t border-blue-100">
                <blockquote className="relative pl-6 border-l-4 border-orange-500 italic text-blue-900/80">
                  <p className="mb-2">"Y nos ha hecho reyes y sacerdotes para Dios, su Padre; a él sea gloria e imperio por los siglos de los siglos. Amén."</p>
                  <footer className="text-right font-medium text-blue-900">
                    — <cite>Apocalipsis 1:6 (RVR1960)</cite>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-100 rounded-full opacity-30"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
        </div>
      </div>
    </section>
  );
}
