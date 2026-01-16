import React from "react";
import { Route, BatteryCharging, Clock, Gauge, TrendingUp } from "lucide-react";
import useGetHistoryAnalytics from "@/hooks/History/useGetHistoryAnalytics";

export default function ResultPageTopSection() {
  // History Analytics Hook
  const { historyAnalytics } = useGetHistoryAnalytics();

  const data = [
    {
      id: 1,
      title: "Total Distance",
      value: historyAnalytics?.total_distance_mi || 0,
      unit: "mi",
      extraInfo: "Route Optimized for efficiency",
      icon: Route,
    },
    {
      id: 2,
      title: "Energy Consumed",
      value: historyAnalytics?.total_energy_kwh || 0,
      unit: "kWh",
      extraInfo: `Avg. ${
        historyAnalytics?.avg_consumption_wh_per_mi || 0
      } Wh/mi`,
      icon: BatteryCharging,
    },
    {
      id: 3,
      title: "Trip Duration",
      value: historyAnalytics?.avg_trip_duration || 0,
      icon: Clock,
    },
    {
      id: 4,
      title: "Arrival SoC",
      value: historyAnalytics?.avg_arrival_soc || 0,
      icon: Gauge,
    },
  ];

  return (
    <div>
      <div className="grid lg:grid-cols-4 gap-6">
        {data?.map((item) => (
          <div
            className="bg-white p-6 rounded-2xl border  space-y-4"
            key={item?.id}
          >
            <div className="flex items-start gap-2 justify-between ">
              <div>
                <h1 className="title text-[#4F586D]!">{item?.title}</h1>
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
