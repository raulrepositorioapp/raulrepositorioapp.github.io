import React from "react";
import { PiChargingStationLight } from "react-icons/pi";

export default function ChargingStops({ ChargingStops }) {
  return (
    <div className="w-full bg-white p-6 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <PiChargingStationLight size={26} className="text-gray-600" />
        <h2 className="title">Paradas</h2>
      </div>

      <div className="w-full h-full space-y-4">
        {ChargingStops?.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border p-4 bg-[#F1FAF7] flex flex-col gap-2"
          >
            <p className="font-semibold text-gray-800">Nombre: {item?.name}</p>

            <div className="flex items-start justify-between text-sm text-gray-700">
              <div>
                <p>Potencia del cargador: {item?.charger_power_kw} KW</p>
                <p className="text-[#4CBF82] font-medium">
                  Batería de llegada: {item?.arrival_soc}%
                </p>
              </div>

              <div className="text-right">
                <p>
                  Distancia desde la polilínea de la ruta inicial:{" "}
                  {item?.distance_from_route_km.toFixed(2)} km
                </p>
                <p>Tiempo de carga: {item?.charge_time_min} min</p>
              </div>
            </div>
          </div>
        ))}

        {ChargingStops?.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-lg font-medium">
            No se encontraron paradas de carga.
          </div>
        )}
      </div>
    </div>
  );
}
