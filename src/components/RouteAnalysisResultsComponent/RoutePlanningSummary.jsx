import React from "react";
import { Milestone, Zap, MapPin, RefreshCw, Battery, Locate, Sliders } from "lucide-react";

export default function RoutePlanningSummary({ planning }) {
  if (!planning) return null;

  const items = [
    {
      label: "Autonomía total",
      value: planning.total_range_km ? `${planning.total_range_km} km` : "N/A",
      icon: Milestone,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Consumo promedio",
      value: planning.average_consumption_kwh_per_100km ? `${planning.average_consumption_kwh_per_100km} kWh/100km` : "N/A",
      icon: Zap,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Primera parada a los",
      value: planning.first_stop_at_km ? `${planning.first_stop_at_km} km` : "N/A",
      icon: MapPin,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      label: "Siguientes paradas cada",
      value: planning.subsequent_stop_every_km ? `${planning.subsequent_stop_every_km} km` : "N/A",
      icon: RefreshCw,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "SOC objetivo de carga",
      value: planning.charge_target_soc ? `${planning.charge_target_soc}%` : "N/A",
      icon: Battery,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Radio de búsqueda",
      value: planning.charger_search_radius_km ? `${planning.charger_search_radius_km} km` : "N/A",
      icon: Locate,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      label: "Criterio de selección",
      value: planning.charger_selection === "highest_power_kw_in_radius" 
        ? "Potencia más alta en el radio"
        : (planning.charger_selection || "N/A"),
      icon: Sliders,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <div className="rounded-2xl p-6 bg-white border mt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Planificación del viaje
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Parámetros clave de autonomía y paradas para la optimización de la ruta de su vehículo eléctrico.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-sm transition-shadow duration-200 bg-white">
            <div className={`p-3 rounded-lg border ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
