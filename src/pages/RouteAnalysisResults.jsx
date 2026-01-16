import ChargingStops from "@/components/RouteAnalysisResultsComponent/ChargingStops";
import EnergyProfileElevationChart from "@/components/RouteAnalysisResultsComponent/EnergyProfileElevationChart";
import PowerConsumptionBreakdownChart from "@/components/RouteAnalysisResultsComponent/PowerConsumptionBreakdownChart";
import RouteAnalysisResultsTopSection from "@/components/RouteAnalysisResultsComponent/RouteAnalysisResultsTopSection";
import RouteSummery from "@/components/RouteAnalysisResultsComponent/RouteSummery";
import React from "react";
import { useLocation } from "react-router-dom";

export default function RouteAnalysisResults() {
  const analysisData = useLocation().state;

  return (
    <div className="p-10">
      <RouteAnalysisResultsTopSection
        locationData={analysisData?.route_summary}
        analysisData={analysisData?.summary_cards}
        tripId={analysisData?.trip_id}
      />

      <div className="grid grid-cols-2 mt-6 gap-6">
        <EnergyProfileElevationChart
          elevationData={analysisData?.soc_profile_graph}
        />

        <RouteSummery
          vehicle_summary={analysisData?.vehicle_summary}
          route_summary={analysisData?.route_summary}
        />
      </div>

      <div className="grid grid-cols-2 mt-6 gap-6">
        <ChargingStops ChargingStops={analysisData?.charging_stops} />

        <PowerConsumptionBreakdownChart
          powerBreakdown={analysisData?.power_breakdown_chart}
        />
      </div>
    </div>
  );
}
