import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function RouteSummary({ route_summary, averageSpeed }) {
  // Min to hour converter function
  const minToHour = (min) => {
    const hours = Math.floor(min / 60);
    const minutes = Math.round(min % 60);
    return `${hours}h ${minutes}m`;
  };

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
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Origen
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.origin}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Destino
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.destination}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Distancia total
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.total_distance_km} km
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Velocidad promedio
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {averageSpeed} km/h
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Consumo promedio
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.avg_consumption_kwh_100km} kWh/100km
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Paradas
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.charging_stop_count}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Duración del viaje con paradas
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {minToHour(route_summary?.trip_duration_min_with_stops)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Duración del viaje sin paradas
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {minToHour(route_summary?.trip_duration_min_no_stops)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Energía total demandada por tracción
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.E_traccion_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Energía total demandada por sistemas auxiliares
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.E_aux_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Energía total recuperada mediante frenado regenerativo
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.E_regen_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Energía neta consumida por el vehiculo electrico
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.E_consumida} kWh
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
