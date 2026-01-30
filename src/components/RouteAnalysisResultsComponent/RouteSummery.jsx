import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function RouteSummary({
  vehicle_summary,
  route_summary,
  averageSpeed,
}) {
  return (
    <div className="rounded-2xl  p-6 bg-white border">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Route Summary
        </h1>
        <p className="text-base text-gray-600">
          Energy loss by source across route segments.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Route Information */}
        <div>
          <h2 className="title2 mb-4 font-bold">Route Information</h2>
          <div className="border rounded-md">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Origin
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.origin}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Destination
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.destination}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Total Distance
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.total_distance_km} km
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Avg. Speed
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {averageSpeed} km/h
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Avg. Consumption
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.avg_consumption_kwh_100km} kWh/100km
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Charging Stops
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {route_summary?.charging_stop_count}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h2 className="title2 mb-4 font-bold">Vehicle Information</h2>

          <div className="border rounded-lg">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Model
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {vehicle_summary?.model}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Type
                  </TableCell>
                  <TableCell className="text-right paragraph capitalize">
                    {vehicle_summary?.type}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Battery Capacity
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {vehicle_summary?.battery_kwh} kWh
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Power
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {vehicle_summary?.power_kw} kW
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Weight
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {vehicle_summary?.weight_kg} kg
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium paragraph text-black!">
                    Efficiency
                  </TableCell>
                  <TableCell className="text-right paragraph">
                    {vehicle_summary?.efficiency_percent}%
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
