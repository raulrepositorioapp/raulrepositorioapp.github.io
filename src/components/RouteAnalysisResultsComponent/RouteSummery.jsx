import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function RouteSummary({ route_summary, averageSpeed }) {
  return (
    <div className="rounded-2xl p-6 bg-white border">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Resumen de la ruta
        </h1>
        <p className="text-base text-gray-600">
          Pérdida de energía por fuente a lo largo de los segmentos de la ruta.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Route Information */}
        <div>
          <h2 className="title2 mb-4 font-bold">Información de la ruta</h2>
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
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
