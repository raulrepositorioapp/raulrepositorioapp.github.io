import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function RouteSummary({ route_summary, averageSpeed }) {
  // Min to hour converter function
  const minToHour = (min) => {
    const hours = Math.floor(min / 60);
    const minutes = Math.round(min % 60);
    return `${hours}h ${minutes}m`;
  };

  const summaryItems = [
    {
      label: "Origen",
      value: route_summary?.origin,
    },
    {
      label: "Destino",
      value: route_summary?.destination,
    },
    {
      label: "Distancia total",
      value: route_summary?.total_distance_km !== undefined ? `${route_summary.total_distance_km} km` : null,
    },
    {
      label: "Velocidad promedio",
      value: averageSpeed !== undefined ? `${averageSpeed} km/h` : null,
    },
    {
      label: "Consumo promedio",
      value: route_summary?.avg_consumption_kwh_100km !== undefined ? `${route_summary.avg_consumption_kwh_100km} kWh/100km` : null,
    },
    {
      label: "Paradas",
      value: route_summary?.charging_stop_count,
    },
    {
      label: "Duración del viaje con paradas",
      value: route_summary?.trip_duration_min_with_stops !== undefined ? minToHour(route_summary.trip_duration_min_with_stops) : null,
    },
    {
      label: "Duración del viaje sin paradas",
      value: route_summary?.trip_duration_min_no_stops !== undefined ? minToHour(route_summary.trip_duration_min_no_stops) : null,
    },
    {
      label: "Energía total demandada por tracción",
      value: route_summary?.E_traccion_total !== undefined ? `${route_summary.E_traccion_total} kWh` : null,
    },
    {
      label: "Energía total demandada por sistemas auxiliares",
      value: route_summary?.E_aux_total !== undefined ? `${route_summary.E_aux_total} kWh` : null,
    },
    {
      label: "Energía total recuperada mediate frenado regenerativeo",
      value: route_summary?.E_regen_total !== undefined ? `${route_summary.E_regen_total} kWh` : null,
    },
    {
      label: "Energía neta consumida por el vehiculo electrico",
      value: route_summary?.E_consumida !== undefined ? `${route_summary.E_consumida} kWh` : null,
    },
  ];

  return (
    <div className="rounded-2xl p-6 bg-white border">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Resumen de la ruta
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Route Information */}
        <div>
          <div className="border rounded-md">
            <Table>
              <TableBody>
                {summaryItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium paragraph text-black w-1/3 min-w-[150px] whitespace-normal">
                      {item.label}
                    </TableCell>
                    <TableCell className="text-right paragraph whitespace-normal">
                      {item.value ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
