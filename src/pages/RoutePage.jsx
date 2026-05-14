import RouteMapSection from "@/components/RoutePageComponents/RouteMapSection";
import RoutePlanningSection from "@/components/RoutePageComponents/RoutePlanningSection";
import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

export default function RoutePage() {
  // Common States
  const vehicleData = useLocation().state?.data;
  const [locationCoordinates, setLocationCoordinates] = useState();

  if (!vehicleData) {
    return <Navigate to="/vechile" replace />;
  }

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: libraries,
  });

  return (
    <div className="grid grid-cols-8 p-10 gap-8">
      <div className="col-span-3 ">
        {isLoaded ? (
          <RoutePlanningSection
            vehicleData={vehicleData}
            setLocationCoordinates={setLocationCoordinates}
            locationCoordinates={locationCoordinates}
          />
        ) : (
          <div className="bg-white p-8 rounded-2xl border flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 animate-pulse">Cargando mapa...</p>
          </div>
        )}
      </div>
      <div className="col-span-5">
        <RouteMapSection locationCoordinates={locationCoordinates} />
      </div>
    </div>
  );
}
