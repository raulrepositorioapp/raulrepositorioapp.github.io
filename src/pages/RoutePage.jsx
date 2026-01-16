import RouteMapSection from "@/components/RoutePageComponents/RouteMapSection";
import RoutePlanningSection from "@/components/RoutePageComponents/RoutePlanningSection";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

export default function RoutePage() {
  // Common States
  const vehicleData = useLocation().state?.data;
  const [locationCoordinates, setLocationCoordinates] = useState();

  if (!vehicleData) {
    window.location.href = "/vechile";
  }

  // Google Maps
  const libraries = ["places"];

  return (
    <div className="grid grid-cols-8 p-10 gap-8">
      <div className="col-span-3 ">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          libraries={libraries}
        >
          <RoutePlanningSection
            vehicleData={vehicleData}
            setLocationCoordinates={setLocationCoordinates}
          />
        </LoadScript>
      </div>
      <div className="col-span-5">
        <RouteMapSection locationCoordinates={locationCoordinates} />
      </div>
    </div>
  );
}
