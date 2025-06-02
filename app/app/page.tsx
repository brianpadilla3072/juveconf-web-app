"use client"
// import { useState } from "react"
// import { Calendar, Package, ShoppingCart, Users } from "lucide-react"

// export default function Dashboard() {
//   const [selectedMenu, setSelectedMenu] = useState("inicio")



//   return (
//     <>


//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumesn</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-gray-500 font-medium">Eventos Activos</h3>
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <Calendar className="h-5 w-5 text-red-500" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold">3</p>
//             <p className="text-sm text-green-500 mt-2">+1 desde el mes pasado</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-gray-500 font-medium">Órdenes Pendientes</h3>
//               <div className="p-2 bg-amber-100 rounded-lg">
//                 <ShoppingCart className="h-5 w-5 text-amber-500" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold">12</p>
//             <p className="text-sm text-red-500 mt-2">+5 desde ayer</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-gray-500 font-medium">Transferencias</h3>
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Package className="h-5 w-5 text-blue-500" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold">8</p>
//             <p className="text-sm text-gray-500 mt-2">Por validar</p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-gray-500 font-medium">Invitados</h3>
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <Users className="h-5 w-5 text-purple-500" />
//               </div>
//             </div>
//             <p className="text-3xl font-bold">125</p>
//             <p className="text-sm text-green-500 mt-2">+18 esta semana</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Financiero</h3>

//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="font-medium text-gray-600">Total Recaudado</h4>
//               <span className="text-2xl font-bold text-gray-800">$1,258,750</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2.5">
//               <div
//                 className="bg-gradient-to-r from-red-500 to-amber-500 h-2.5 rounded-full"
//                 style={{ width: "75%" }}
//               ></div>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">75% de la meta mensual</p>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="p-2 bg-green-100 rounded-lg mr-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-green-600"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                     <path
//                       fillRule="evenodd"
//                       d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Transferencias Bancarias</p>
//                   <p className="text-sm text-gray-500">32 pagos</p>
//                 </div>
//               </div>
//               <p className="font-bold">$845,200</p>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="p-2 bg-blue-100 rounded-lg mr-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-blue-600"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                     <path
//                       fillRule="evenodd"
//                       d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Tarjetas de Crédito</p>
//                   <p className="text-sm text-gray-500">18 pagos</p>
//                 </div>
//               </div>
//               <p className="font-bold">$325,550</p>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="p-2 bg-amber-100 rounded-lg mr-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-amber-600"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm7 0a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1zm-.94-6.414a1 1 0 011.414 0L15 7.414l1.586-1.586a1 1 0 111.414 1.414L16.414 9l1.586 1.586a1 1 0 11-1.414 1.414L15 10.414l-1.586 1.586a1 1 0 01-1.414-1.414L13.586 9 12 7.414a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Efectivo</p>
//                   <p className="text-sm text-gray-500">8 pagos</p>
//                 </div>
//               </div>
//               <p className="font-bold">$88,000</p>
//             </div>
//           </div>

//           <div className="mt-6 pt-4 border-t border-gray-100">
//             <div className="flex justify-between items-center">
//               <p className="font-medium text-gray-600">Pagos pendientes</p>
//               <p className="font-bold text-red-500">$125,300</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <h3 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>

//           <div className="space-y-4">
//             <div className="border-l-2 border-red-500 pl-4">
//               <p className="text-sm font-medium">Nueva orden #1234</p>
//               <p className="text-xs text-gray-500">Hace 10 minutos</p>
//             </div>

//             <div className="border-l-2 border-amber-500 pl-4">
//               <p className="text-sm font-medium">Transferencia validada</p>
//               <p className="text-xs text-gray-500">Hace 45 minutos</p>
//             </div>

//             <div className="border-l-2 border-green-500 pl-4">
//               <p className="text-sm font-medium">Nuevo usuario registrado</p>
//               <p className="text-xs text-gray-500">Hace 2 horas</p>
//             </div>

//             <div className="border-l-2 border-blue-500 pl-4">
//               <p className="text-sm font-medium">Combo actualizado</p>
//               <p className="text-xs text-gray-500">Hace 3 horas</p>
//             </div>

//             <div className="border-l-2 border-purple-500 pl-4">
//               <p className="text-sm font-medium">Evento creado</p>
//               <p className="text-xs text-gray-500">Hace 5 horas</p>
//             </div>
//           </div>

//           <button className="w-full mt-6 py-2 text-sm font-medium text-red-500 hover:text-red-600">
//             Ver todas las actividades
//           </button>
//         </div>
//       </div>




//     </>
//   )
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la ruta pública cuando el componente se monte
    router.replace('/');
  }, [router]);

  // No renderizar nada, ya que la redirección ocurrirá inmediatamente
  return null;
}
