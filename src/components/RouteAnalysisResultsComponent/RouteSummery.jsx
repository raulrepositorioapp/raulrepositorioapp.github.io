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

        <p className="text-gray-600 mt-3">
          Gracias al frenado regenerative, el vehículo puede recuperador
          approximately between 1 and 3 kWh/100 km, depending on the type of
          driving.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Route Information */}
        <div>
          <div className="border rounded-md">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black w-1/3 min-w-[150px] whitespace-normal">
                    Origen
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.origin}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Destino
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.destination}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Distancia total
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.total_distance_km} km
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Velocidad promedio
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {averageSpeed} km/h
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Consumo promedio
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.avg_consumption_kwh_100km} kWh/100km
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Paradas
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.charging_stop_count}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Duración del viaje con paradas
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {minToHour(route_summary?.trip_duration_min_with_stops)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Duración del viaje sin paradas
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {minToHour(route_summary?.trip_duration_min_no_stops)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Energía total demandada por tracción
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.E_traccion_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Energía total demandada por sistemas auxiliares
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.E_aux_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Energía recuperada mediate frenado regenerativo por cada
                    100km
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.E_regen_total} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Energía neta consumida por el vehiculo electrico
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    {route_summary?.E_consumida} kWh
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium paragraph text-black whitespace-normal">
                    Consumo Real
                  </TableCell>
                  <TableCell className="text-right paragraph whitespace-normal">
                    El consumo real estimado se obtaine restando entre 1 y 3
                    kWh/100 km al consumo calculado.
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
