"use client"
import { useState, useEffect } from "react"
import { Calendar, Package, ShoppingCart, Users, TrendingUp, DollarSign, UserCheck, BarChart3, ChevronDown } from "lucide-react"
import { useDashboardOverview } from "@/app/hooks/Dashboard/useDashboardOverview"
import { useRevenueTrends } from "@/app/hooks/Dashboard/useRevenueTrends"
import { useOrdersAnalytics } from "@/app/hooks/Dashboard/useOrdersAnalytics"
import { useAttendanceAnalytics } from "@/app/hooks/Dashboard/useAttendanceAnalytics"
import { useCombosRanking } from "@/app/hooks/Dashboard/useCombosRanking"
import { useEventsRanking } from "@/app/hooks/Dashboard/useEventsRanking"
import { KPICard } from "@/app/components/Dashboard/KPICard"
import { LineChart } from "@/app/components/Dashboard/Charts/LineChart"
import { BarChart } from "@/app/components/Dashboard/Charts/BarChart"
import { PieChart } from "@/app/components/Dashboard/Charts/PieChart"
import { AreaChart } from "@/app/components/Dashboard/Charts/AreaChart"
import { YearSelector } from "@/app/components/Dashboard/YearSelector"
import { ChartSkeleton } from "@/app/components/Dashboard/ChartSkeleton"

export default function Dashboard() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [isYearChanging, setIsYearChanging] = useState(false)
  
  // Generate year options (current year and 4 years back)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleYearChange = (newYear: number) => {
    setIsYearChanging(true)
    setSelectedYear(newYear)
    // Reset loading state after a brief moment to allow hooks to update
    setTimeout(() => setIsYearChanging(false), 500)
  }
  
  const { data: overviewData, loading: overviewLoading } = useDashboardOverview(selectedYear)
  const { data: revenueData, loading: revenueLoading } = useRevenueTrends(12)
  const { data: ordersData, loading: ordersLoading } = useOrdersAnalytics(selectedYear)
  const { data: attendanceData, loading: attendanceLoading } = useAttendanceAnalytics(selectedYear)
  const { data: combosData, loading: combosLoading } = useCombosRanking(selectedYear, 5)
  const { data: eventsData, loading: eventsLoading } = useEventsRanking(selectedYear, 3)

  const isLoading = overviewLoading || revenueLoading || ordersLoading || isYearChanging

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Analíticas</h2>
          
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            years={yearOptions}
          />
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Ingresos Totales"
            value={overviewData?.kpis.totalRevenue || 0}
            change={{
              value: overviewData?.kpis.revenueGrowth || 0,
              isPositive: (overviewData?.kpis.revenueGrowth || 0) >= 0,
              label: "vs año anterior"
            }}
            icon={DollarSign}
            iconColor="text-green-500"
            iconBg="bg-green-100"
          />
          
          <KPICard
            title="Órdenes Pendientes"
            value={overviewData?.kpis.pendingOrders || 0}
            icon={ShoppingCart}
            iconColor="text-amber-500"
            iconBg="bg-amber-100"
          />
          
          <KPICard
            title="Eventos Activos"
            value={overviewData?.kpis.activeEvents || 0}
            icon={Calendar}
            iconColor="text-blue-500"
            iconBg="bg-blue-100"
          />
          
          <KPICard
            title="Total Invitados"
            value={overviewData?.kpis.totalAttendees || 0}
            icon={Users}
            iconColor="text-purple-500"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tendencias de Ingresos</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Últimos 12 meses</span>
            </div>
            {revenueLoading || isYearChanging ? (
              <ChartSkeleton height={300} />
            ) : revenueData ? (
              <LineChart
                data={revenueData.trends}
                xDataKey="monthName"
                lines={[
                  {
                    dataKey: "totalAmount",
                    stroke: "#10b981",
                    name: "Ingresos"
                  }
                ]}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Órdenes por Estado</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedYear}</span>
            </div>
            {ordersLoading || isYearChanging ? (
              <ChartSkeleton height={300} />
            ) : ordersData ? (
              <PieChart
                data={ordersData.byStatus.map(item => ({
                  name: item.status,
                  value: item._count.id
                }))}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Top Combos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Combos Más Populares</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedYear}</span>
            </div>
            {combosLoading || isYearChanging ? (
              <ChartSkeleton height={300} />
            ) : combosData ? (
              <BarChart
                data={combosData.ranking}
                xDataKey="comboName"
                bars={[
                  {
                    dataKey: "orderCount",
                    fill: "#3b82f6",
                    name: "Órdenes"
                  }
                ]}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Attendance Analytics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Asistencia por Evento</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedYear}</span>
            </div>
            {attendanceLoading || isYearChanging ? (
              <ChartSkeleton height={300} />
            ) : attendanceData ? (
              <AreaChart
                data={attendanceData.byEvent}
                xDataKey="eventName"
                areas={[
                  {
                    dataKey: "attendedDay1",
                    stroke: "#10b981",
                    fill: "#10b98180",
                    name: "Día 1"
                  },
                  {
                    dataKey: "attendedDay2",
                    stroke: "#3b82f6",
                    fill: "#3b82f680",
                    name: "Día 2"
                  }
                ]}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Utilización de Capacidad</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">{overviewData?.kpis.capacityUtilization.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-2">de la capacidad total</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Total Pagos</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">{overviewData?.kpis.totalPayments}</p>
            <p className="text-sm text-gray-500 mt-2">transacciones completadas</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Usuarios Registrados</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">{overviewData?.kpis.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">usuarios en el sistema</p>
          </div>
        </div>
      </div>
    </div>
  )
}