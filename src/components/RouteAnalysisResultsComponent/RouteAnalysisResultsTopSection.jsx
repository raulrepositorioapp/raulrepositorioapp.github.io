import React from "react";
import { Route, BatteryCharging, Clock, Gauge, TrendingUp } from "lucide-react";
import CommonButton from "../common/CommonButton";
import Loader from "../common/Loader";

export default function RouteAnalysisResultsTopSection({
  analysisData,
  locationData,
}) {
  // History Analytics Data
  const data = [
    {
      id: 1,
      title: "Distancia total",
      value: analysisData?.total_distance_km,
      unit: "km",
      extraInfo: "Ruta optimizada para eficiencia",
      icon: Route,
    },
    {
      id: 2,
      title: "Energía consumida",
      value: analysisData?.energy_kwh,
      unit: "kWh",
      extraInfo: `Avg. ${analysisData?.avg_consumption_wh_per_km + " Wh por km"}`,
      icon: BatteryCharging,
    },
    {
      id: 3,
      title: "Duración del viaje",
      value: analysisData?.trip_duration_min + " min",
      extraInfo: `Solo tiempo de conducción`,
      icon: Clock,
    },
    {
      id: 4,
      title: "SoC de llegada",
      value: analysisData?.arrival_soc + "%",
      extraInfo: "Comenzado en " + analysisData?.start_soc + "%",
      icon: Gauge,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-[#212B36] font-roboto text-[32px] font-semibold leading-[38.4px]">
            Resultados del análisis de ruta
          </h1>
          <p className="paragraph mt-2">
            {locationData?.origin} a {locationData?.destination}
          </p>
        </div>

        {/* button */}
        <div className="flex items-center gap-5">
          <CommonButton to="/result" children="Guardar y cerrar" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {data?.map((item) => (
          <div
            className="bg-white p-6 rounded-2xl border mt-8 space-y-4"
            key={item?.id}
          >
            <div className="flex items-start gap-2 justify-between ">
              <div>
                <h1 className="title text-[#4F586D]! ">{item?.title}</h1>
                <p className="paragraph mt-4 text-lg font-medium">
                  <span className="text-[32px] text-black">{item?.value}</span>{" "}
                  {item?.unit}
                </p>
              </div>
              <div className="bg-gray-200 p-2 rounded-full flex items-center justify-center">
                <item.icon size={24} />
              </div>
            </div>

            {item?.extraInfo && (
              <p className="paragraph mt-2 flex items-center gap-2">
                <span className="text-[#20A157]">
                  <TrendingUp />
                </span>{" "}
                {item?.extraInfo}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
