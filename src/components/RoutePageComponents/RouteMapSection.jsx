import React, { useEffect, useState, useCallback } from "react";
import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
  useMap,
} from "../ui/map";
import {
  Clock,
  Route,
  Loader2,
  Navigation,
  Zap,
  Maximize,
  X,
} from "lucide-react";

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
      },
    );
  }, [mapCtx, bounds]);

  return null;
}

function ZoomControls({ onToggleFullscreen }) {
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
    <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
      <button
        onClick={zoomIn}
        className="w-9 h-9 bg-white rounded-md shadow border flex items-center justify-center text-lg hover:bg-gray-100 cursor-pointer"
        type="button"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="w-9 h-9 bg-white rounded-md shadow border flex items-center justify-center text-lg hover:bg-gray-100 cursor-pointer"
        type="button"
      >
        −
      </button>
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="w-9 h-9 bg-white rounded-md shadow border flex items-center justify-center hover:bg-gray-100 cursor-pointer text-gray-700"
          type="button"
          title="Ver en pantalla completa"
        >
          <Maximize size={16} />
        </button>
      )}
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

export default function RouteMapSection({
  locationCoordinates,
  chargingStops,
}) {
  const [routes, setRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

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
      const allCoords = [...locationCoordinates];
      if (chargingStops && chargingStops.length > 0) {
        chargingStops.forEach((stop) => {
          if (stop.lon && stop.lat) {
            allCoords.push({ lng: stop.lon, lat: stop.lat });
          }
        });
      }
      setMapBounds(calculateBounds(allCoords));
    }
  }, [locationCoordinates, chargingStops, calculateBounds]);

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

        // Construct coordinates string including charging stops in order
        const coordsParts = [`${origin.lng},${origin.lat}`];
        if (chargingStops && chargingStops.length > 0) {
          chargingStops.forEach((stop) => {
            if (stop.lon !== undefined && stop.lat !== undefined) {
              coordsParts.push(`${stop.lon},${stop.lat}`);
            }
          });
        }
        coordsParts.push(`${destination.lng},${destination.lat}`);
        const coordsString = coordsParts.join(";");

        // OSRM only supports alternatives for 2-point routing
        const hasStops = chargingStops && chargingStops.length > 0;
        const alternativesParam = hasStops ? "" : "&alternatives=true";

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson${alternativesParam}`,
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
            })),
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
  }, [locationCoordinates, chargingStops]);

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
        <h1 className="title">Mapa de ruta</h1>

        <div className="h-[500px] w-full relative mt-4 rounded-lg overflow-hidden border border-gray-200">
          <Map
            center={mapView.center}
            zoom={mapView.zoom}
            style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          >
            {mapBounds && <FitMapToBounds bounds={mapBounds} />}
            <ZoomControls onToggleFullscreen={() => setIsModalOpen(true)} />
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
                    {locationCoordinates[0].name || "Origen"}
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

            {chargingStops?.map((stop, index) => {
              if (!stop?.lat || !stop?.lon) return null;
              return (
                <MapMarker
                  key={`stop-${index}`}
                  longitude={stop.lon}
                  latitude={stop.lat}
                >
                  <MarkerContent>
                    <div className="relative group">
                      <div className="size-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-110 transition-all cursor-pointer">
                        <Zap size={14} className="fill-white text-white" />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    <MarkerTooltip className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl max-w-60 text-xs font-sans">
                      <div className="font-bold text-sm mb-1.5 text-emerald-400 leading-tight font-sans">
                        {stop.name}
                      </div>
                      <div className="space-y-1 text-slate-200">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-400">
                            ⚡ Potencia:
                          </span>
                          <span>{stop.charger_power_kw} kW</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-400">
                            🔋 Llegada:
                          </span>
                          <span className="text-emerald-300 font-semibold">
                            {stop.arrival_soc_display || `${stop.arrival_soc}%`}
                          </span>
                        </div>
                        {stop.charge_target_soc && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-400">
                              🎯 Objetivo:
                            </span>
                            <span>{stop.charge_target_soc}%</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-400">
                            ⏱️ Tiempo:
                          </span>
                          <span className="text-amber-300 font-semibold">
                            {stop.charge_time_min} min
                          </span>
                        </div>
                        {stop.distance_from_route_km !== undefined && (
                          <div className="flex items-center gap-1 pt-0.5 border-t border-slate-700/50 mt-1 text-[10px]">
                            <span className="text-slate-400">Desvío:</span>
                            <span>
                              {stop.distance_from_route_km.toFixed(2)} km
                            </span>
                          </div>
                        )}
                      </div>
                    </MarkerTooltip>
                  </MarkerContent>
                </MapMarker>
              );
            })}
          </Map>

          {isLoading && locationCoordinates?.length === 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          )}

          {locationCoordinates?.length === 2 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="font-medium">
                    {locationCoordinates[0]?.name || "Origen"}
                  </span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <span className="font-medium">
                    {locationCoordinates[1]?.name || "Destino"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-[95vw] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Route className="text-indigo-600 size-5" />
                  Mapa de ruta completo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualizando la ruta planificada y sus paradas de carga
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                title="Cerrar"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Map Content */}
            <div className="flex-1 relative w-full h-full bg-slate-50">
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
                      key={`modal-route-${route.index}`}
                      coordinates={route.coordinates}
                      color={isSelected ? "#6366f1" : "#94a3b8"}
                      width={isSelected ? 6 : 4}
                      opacity={isSelected ? 1 : 0.5}
                      onClick={() => setSelectedIndex(route.index)}
                    />
                  );
                })}

                {locationCoordinates?.[0]?.lng &&
                  locationCoordinates?.[0]?.lat && (
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
                          {locationCoordinates[0].name || "Origen"}
                        </MarkerLabel>
                      </MarkerContent>
                    </MapMarker>
                  )}

                {locationCoordinates?.[1]?.lng &&
                  locationCoordinates?.[1]?.lat && (
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

                {chargingStops?.map((stop, index) => {
                  if (!stop?.lat || !stop?.lon) return null;
                  return (
                    <MapMarker
                      key={`modal-stop-${index}`}
                      longitude={stop.lon}
                      latitude={stop.lat}
                    >
                      <MarkerContent>
                        <div className="relative group">
                          <div className="size-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-110 transition-all cursor-pointer">
                            <Zap size={14} className="fill-white text-white" />
                          </div>
                          <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {index + 1}
                          </div>
                        </div>
                        <MarkerTooltip className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl max-w-60 text-xs font-sans">
                          <div className="font-bold text-sm mb-1.5 text-emerald-400 leading-tight font-sans">
                            {stop.name}
                          </div>
                          <div className="space-y-1 text-slate-200">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-slate-400">
                                ⚡ Potencia:
                              </span>
                              <span>{stop.charger_power_kw} kW</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-slate-400">
                                🔋 Llegada:
                              </span>
                              <span className="text-emerald-300 font-semibold">
                                {stop.arrival_soc_display ||
                                  `${stop.arrival_soc}%`}
                              </span>
                            </div>
                            {stop.charge_target_soc && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-slate-400">
                                  🎯 Objetivo:
                                </span>
                                <span>{stop.charge_target_soc}%</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-slate-400">
                                ⏱️ Tiempo:
                              </span>
                              <span className="text-amber-300 font-semibold">
                                {stop.charge_time_min} min
                              </span>
                            </div>
                            {stop.distance_from_route_km !== undefined && (
                              <div className="flex items-center gap-1 pt-0.5 border-t border-slate-700/50 mt-1 text-[10px]">
                                <span className="text-slate-400">Desvío:</span>
                                <span>
                                  {stop.distance_from_route_km.toFixed(2)} km
                                </span>
                              </div>
                            )}
                          </div>
                        </MarkerTooltip>
                      </MarkerContent>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
