import React, { useState } from "react";
import { Route, BatteryCharging, Clock, Gauge, TrendingUp } from "lucide-react";
import CommonButton from "../common/CommonButton";
import { IoIosArrowDown } from "react-icons/io";

export default function RouteAnalysisResultsTopSection({ analysisData }) {
  const data = [
    {
      id: 1,
      title: "Total Distance",
      value: analysisData?.total_distance_mi,
      unit: "mi",
      extraInfo: "Route Optimized for efficiency",
      icon: Route,
    },
    {
      id: 2,
      title: "Energy Consumed",
      value: analysisData?.energy_kwh,
      unit: "kWh",
      extraInfo: `Avg. ${analysisData?.avg_consumption_wh_per_km + " per km"}`,
      icon: BatteryCharging,
    },
    {
      id: 3,
      title: "Trip Duration",
      value: analysisData?.trip_duration_min + " min",
      extraInfo: `Includes ${analysisData?.charging_stop_count} charging stops`,
      icon: Clock,
    },
    {
      id: 4,
      title: "Arrival SoC",
      value: analysisData?.arrival_soc + "%",
      extraInfo: "Started at " + analysisData?.start_soc + "%",
      icon: Gauge,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Export File");

  const countries = ["Export PDF ", "Export CSV"];

  const handleSelect = (country) => {
    setSelected(country);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-[#212B36] font-roboto text-[32px] font-semibold leading-[38.4px]">
            Route Analysis Results
          </h1>
          <p className="paragraph mt-2">Valladolid, Spain To Madrid, Spain</p>
        </div>

        {/* button */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col w-44 text-sm relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-4 pr-2 py-2.5 rounded-lg border border-[#2FA75F] text-[#2FA75F] text-lg flex items-center justify-between cursor-pointer"
            >
              <span>{selected}</span>
              <IoIosArrowDown
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {isOpen && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2 z-50">
                {countries.map((country) => (
                  <li
                    key={country}
                    className="px-4 py-2 hover:bg-[#2FA75F] hover:text-white cursor-pointer"
                    onClick={() => handleSelect(country)}
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CommonButton to="/result" children="Save & Close" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            className="bg-white p-6 rounded-2xl border mt-8 space-y-4"
            key={item.id}
          >
            <div className="flex items-start gap-2 justify-between ">
              <div>
                <h1 className="title text-[#4F586D]! ">{item.title}</h1>
                <p className="paragraph mt-4 text-lg font-medium">
                  <span className="text-[32px] text-black">{item.value}</span>{" "}
                  {item.unit}
                </p>
              </div>
              <div className="bg-gray-200 p-2 rounded-full flex items-center justify-center">
                <item.icon size={24} />
              </div>
            </div>

            <p className="paragraph mt-2 flex items-center gap-2">
              <span className="text-[#20A157]">
                <TrendingUp />
              </span>{" "}
              {item.extraInfo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
