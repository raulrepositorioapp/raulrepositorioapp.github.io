import React from "react";
import { PiChargingStationLight } from "react-icons/pi";

export default function ChargingStops({ ChargingStops }) {
  return (
    <div className="w-full bg-white p-6 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <PiChargingStationLight size={26} className="text-gray-600" />
        <h2 className="title">Charging Stops</h2>
      </div>

      <div className="w-full h-full space-y-4">
        {ChargingStops?.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border p-4 bg-[#F1FAF7] flex flex-col gap-2"
          >
            <p className="font-semibold text-gray-800">
              Station name: {item?.name}
            </p>

            <div className="flex items-start justify-between text-sm text-gray-700">
              <div>
                <p>Charger power: {item?.charger_power_kw} KW</p>
                <p className="text-[#4CBF82] font-medium">
                  Arrival Battery: {item?.arrival_soc}%
                </p>
              </div>

              <div className="text-right">
                <p>Distance: {item?.distance_from_route_km.toFixed(2)} km</p>
                <p>Charging Time: {item?.charge_time_min} min</p>
              </div>
            </div>
          </div>
        ))}

        {ChargingStops?.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-lg font-medium">
            No charging stops found.
          </div>
        )}
      </div>
    </div>
  );
}
