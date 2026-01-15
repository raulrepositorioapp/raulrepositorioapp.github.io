import React, { useEffect, useState, useCallback } from "react";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  useMap,
} from "../ui/map";
import { Button } from "../ui/button";
import { Clock, Route, Loader2, Navigation } from "lucide-react";

function FitMapToBounds({ bounds }) {
  const mapCtx = useMap();

  useEffect(() => {
    if (!bounds || !mapCtx) return;

    const map =
      mapCtx.map ||
      (typeof mapCtx.getMap === "function" ? mapCtx.getMap() : null) ||
      mapCtx;

    if (!map || typeof map.fitBounds !== "function") return;

    map.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12,
        duration: 800,
      }
    );
  }, [mapCtx, bounds]);

  return null;
}

function ZoomControls() {
  const mapCtx = useMap();

  const getMap = () =>
    mapCtx?.map ||
    (typeof mapCtx?.getMap === "function" ? mapCtx.getMap() : null) ||
    mapCtx;

  const zoomIn = () => {
    const map = getMap();
    if (map?.zoomIn) map.zoomIn({ duration: 300 });
  };

  const zoomOut = () => {
    const map = getMap();
    if (map?.zoomOut) map.zoomOut({ duration: 300 });
  };

  return (
    <div className="absolute bottom-20 right-3 flex flex-col gap-2 z-10">
      <button
        onClick={zoomIn}
        className="w-9 h-9 bg-white rounded-md shadow border flex items-center justify-center text-lg hover:bg-gray-100 cursor-pointer"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="w-9 h-9 bg-white rounded-md shadow border flex items-center justify-center text-lg hover:bg-gray-100 cursor-pointer"
      >
        −
      </button>
    </div>
  );
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatDistance = (meters) => {
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(1)} km`;
};

export default function RouteMapSection({ locationCoordinates }) {
  const [routes, setRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);

  const calculateBounds = useCallback((coords) => {
    if (!coords || coords.length < 2) return null;
    const lngs = coords.map((c) => c.lng);
    const lats = coords.map((c) => c.lat);
    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    };
  }, []);

  useEffect(() => {
    if (locationCoordinates && locationCoordinates.length === 2) {
      setMapBounds(calculateBounds(locationCoordinates));
    }
  }, [locationCoordinates, calculateBounds]);

  useEffect(() => {
    async function fetchRoutes() {
      if (
        !locationCoordinates ||
        locationCoordinates.length < 2 ||
        !locationCoordinates[0]?.lng ||
        !locationCoordinates[0]?.lat ||
        !locationCoordinates[1]?.lng ||
        !locationCoordinates[1]?.lat
      ) {
        setIsLoading(false);
        setRoutes([]);
        return;
      }

      try {
        setIsLoading(true);
        const origin = locationCoordinates[0];
        const destination = locationCoordinates[1];

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`
        );

        if (!response.ok) throw new Error("Route fetch failed");

        const data = await response.json();

        if (data.code === "Ok" && data.routes?.length > 0) {
          setRoutes(
            data.routes.map((route, index) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
              index,
            }))
          );
        } else {
          setRoutes([]);
        }
      } catch {
        setRoutes([]);
      } finally {
        setIsLoading(false);
      }
    }

    const t = setTimeout(fetchRoutes, 300);
    return () => clearTimeout(t);
  }, [locationCoordinates]);

  const calculateMapView = () => {
    if (!mapBounds) return { center: [4.9, 52.3], zoom: 1 };
    const centerLng = (mapBounds.minLng + mapBounds.maxLng) / 2;
    const centerLat = (mapBounds.minLat + mapBounds.maxLat) / 2;
    return { center: [centerLng, centerLat], zoom: 7 };
  };

  const sortedRoutes = routes.slice().sort((a, b) => {
    if (a.index === selectedIndex) return -1;
    if (b.index === selectedIndex) return 1;
    return 0;
  });

  const mapView = calculateMapView();

  return (
    <div>
      <div className="bg-white p-8 rounded-2xl border">
        <h1 className="title">Route Map</h1>

        <div className="h-[500px] w-full relative mt-4 rounded-lg overflow-hidden border border-gray-200">
          <Map
            center={mapView.center}
            zoom={mapView.zoom}
            style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            {mapBounds && <FitMapToBounds bounds={mapBounds} />}
            <ZoomControls />
            {sortedRoutes.map((route) => {
              const isSelected = route.index === selectedIndex;
              return (
                <MapRoute
                  key={route.index}
                  coordinates={route.coordinates}
                  color={isSelected ? "#6366f1" : "#94a3b8"}
                  width={isSelected ? 6 : 4}
                  opacity={isSelected ? 1 : 0.5}
                  onClick={() => setSelectedIndex(route.index)}
                />
              );
            })}

            {locationCoordinates?.[0]?.lng && locationCoordinates?.[0]?.lat && (
              <MapMarker
                longitude={locationCoordinates[0].lng}
                latitude={locationCoordinates[0].lat}
              >
                <MarkerContent>
                  <div className="relative">
                    <div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                    <div className="absolute -top-2 -left-2 size-9 rounded-full bg-green-500/20 animate-ping " />
                  </div>
                  <MarkerLabel position="top">
                    {locationCoordinates[0].name || "Origin"}
                  </MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )}

            {locationCoordinates?.[1]?.lng && locationCoordinates?.[1]?.lat && (
              <MapMarker
                longitude={locationCoordinates[1].lng}
                latitude={locationCoordinates[1].lat}
              >
                <MarkerContent>
                  <div className="relative">
                    <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                    <div className="absolute -top-2 -left-2 size-9 rounded-full bg-red-500/20 animate-ping" />
                  </div>
                  <MarkerLabel position="bottom">
                    {locationCoordinates[1].name || "Destination"}
                  </MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )}
          </Map>

          {routes.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {routes.map((route, index) => {
                const isActive = index === selectedIndex;
                return (
                  <Button
                    key={index}
                    variant={isActive ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedIndex(index)}
                    className={
                      !isActive
                        ? "bg-[#0f0f0f] text-white hover:bg-[#1a1a1a] cursor-pointer"
                        : "cursor-pointer"
                    }
                  >
                    <Clock className="size-3.5 mr-2" />
                    {formatDuration(route.duration)} •{" "}
                    {formatDistance(route.distance)}
                  </Button>
                );
              })}
            </div>
          )}

          {isLoading && locationCoordinates?.length === 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          )}

          {locationCoordinates?.length === 2 && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="font-medium">
                    {locationCoordinates[0]?.name || "Origin"}
                  </span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <span className="font-medium">
                    {locationCoordinates[1]?.name || "Destination"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
