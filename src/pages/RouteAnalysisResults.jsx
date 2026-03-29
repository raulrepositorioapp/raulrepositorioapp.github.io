import ChargingStops from "@/components/RouteAnalysisResultsComponent/ChargingStops";
import EnergyProfileElevationChart from "@/components/RouteAnalysisResultsComponent/EnergyProfileElevationChart";
import RouteAnalysisResultsTopSection from "@/components/RouteAnalysisResultsComponent/RouteAnalysisResultsTopSection";
import RouteSummery from "@/components/RouteAnalysisResultsComponent/RouteSummery";
import RouteMapSection from "@/components/RoutePageComponents/RouteMapSection";
import React from "react";
import { useLocation } from "react-router-dom";

export default function RouteAnalysisResults() {
  const analysisData = useLocation().state?.data;
  const locationCoordinates = useLocation().state?.locationCoordinates;

  return (
    <div className="p-10">
      <RouteAnalysisResultsTopSection
        locationData={analysisData?.route_summary}
        analysisData={analysisData?.summary_cards}
      />

      <div className="grid grid-cols-2 mt-6 gap-6">
        <EnergyProfileElevationChart
          elevationData={analysisData?.soc_profile_graph}
        />

        <RouteSummery
          route_summary={analysisData?.route_summary}
          averageSpeed={analysisData?.summary_cards?.avg_speed_kmh}
        />
      </div>

      <div className="grid grid-cols-2 mt-6 gap-6">
        <ChargingStops ChargingStops={analysisData?.charging_stops} />

        <div>
          <RouteMapSection locationCoordinates={locationCoordinates} />
        </div>
      </div>
    </div>
  );
}
