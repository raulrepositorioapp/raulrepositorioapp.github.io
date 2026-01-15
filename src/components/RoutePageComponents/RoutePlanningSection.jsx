import { BatteryFull, Car, MapPin, MoveRightIcon, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CurvedArrowSVG from "../SVG/CurvedArrowSVG";
import { Slider } from "../ui/slider";
import { useForm } from "react-hook-form";
import CommonButton from "../common/CommonButton";
import useCalculateRoute from "@/hooks/Calculate/useCalculateRoute";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";

// Default coordinates
const DEFAULT_ORIGIN = {
  name: "Amsterdam",
  lng: 4.9041,
  lat: 52.3676,
  address: "Amsterdam, Netherlands",
};

const DEFAULT_DESTINATION = {
  name: "Rotterdam",
  lng: 4.4777,
  lat: 51.9244,
  address: "Rotterdam, Netherlands",
};

export default function RoutePlanningSection({
  vehicleData,
  setLocationCoordinates,
}) {
  // Global States
  const navigate = useNavigate();

  // Slider values
  const [sliderValues, setSliderValues] = useState({
    startingCharge: 80,
    minArrivalCharge: 50,
  });

  // React Hook Form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      origin: null,
      destination: null,
      originCoordinates: null,
      destinationCoordinates: null,
    },
  });

  const { mutate: calculateRoute, isPending: isCalculatePending } =
    useCalculateRoute({
      onSuccess: (data) => {
        navigate("/route-analysis-results", { state: data });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // ---------------- GOOGLE AUTOCOMPLETE REFS ----------------
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  // Watch form values to update coordinates
  const originValue = watch("origin");
  const destinationValue = watch("destination");
  const originCoordinates = watch("originCoordinates");
  const destinationCoordinates = watch("destinationCoordinates");

  // Function to get coordinates from Google Places
  const getPlaceCoordinates = (place) => {
    if (!place || !place.geometry) return null;

    return {
      name: place.name || place.formatted_address,
      address: place.formatted_address,
      lng: place.geometry.location.lng(),
      lat: place.geometry.location.lat(),
    };
  };

  // Function to get coordinates from a place name using Google Geocoding
  const getCoordinatesFromAddress = async (address) => {
    if (!window.google || !address) return null;

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            name: address,
            address: address,
            lng: location.lng(),
            lat: location.lat(),
          });
        } else {
          console.warn(
            "Geocode was not successful for the following reason:",
            status
          );
          resolve(null);
        }
      });
    });
  };

  // Update location coordinates in parent component when coordinates change
  useEffect(() => {
    if (originCoordinates && destinationCoordinates) {
      setLocationCoordinates([originCoordinates, destinationCoordinates]);
    }
  }, [originCoordinates, destinationCoordinates, setLocationCoordinates]);

  // Debounced function to update coordinates when address changes
  useEffect(() => {
    const updateCoordinates = async () => {
      if (originValue && originValue.trim() !== "") {
        // Don't geocode if it's the default value
        if (originValue === DEFAULT_ORIGIN.address) {
          setValue("originCoordinates", DEFAULT_ORIGIN);
          return;
        }

        const coords = await getCoordinatesFromAddress(originValue);
        if (coords) {
          setValue("originCoordinates", coords);
        }
      }
    };

    const timer = setTimeout(updateCoordinates, 1000); // Debounce for 1 second
    return () => clearTimeout(timer);
  }, [originValue, setValue]);

  useEffect(() => {
    const updateCoordinates = async () => {
      if (destinationValue && destinationValue.trim() !== "") {
        // Don't geocode if it's the default value
        if (destinationValue === DEFAULT_DESTINATION.address) {
          setValue("destinationCoordinates", DEFAULT_DESTINATION);
          return;
        }

        const coords = await getCoordinatesFromAddress(destinationValue);
        if (coords) {
          setValue("destinationCoordinates", coords);
        }
      }
    };

    const timer = setTimeout(updateCoordinates, 1000); // Debounce for 1 second
    return () => clearTimeout(timer);
  }, [destinationValue, setValue]);

  // ---------------- GOOGLE AUTOCOMPLETE INIT ----------------
  useEffect(() => {
    if (!window.google) return;

    // Origin
    if (originRef.current) {
      const auto = new window.google.maps.places.Autocomplete(
        originRef.current,
        { types: ["(cities)"] }
      );

      auto.addListener("place_changed", () => {
        const place = auto.getPlace();
        if (place?.formatted_address) {
          setValue("origin", place.formatted_address);
          const coords = getPlaceCoordinates(place);
          if (coords) {
            setValue("originCoordinates", coords);
          }
        }
      });
    }

    // Destination
    if (destinationRef.current) {
      const auto = new window.google.maps.places.Autocomplete(
        destinationRef.current,
        { types: ["(cities)"] }
      );

      auto.addListener("place_changed", () => {
        const place = auto.getPlace();
        if (place?.formatted_address) {
          setValue("destination", place.formatted_address);
          const coords = getPlaceCoordinates(place);
          if (coords) {
            setValue("destinationCoordinates", coords);
          }
        }
      });
    }
  }, [setValue]);

  // Form submit handler
  const onSubmit = async (data) => {
    // Get current coordinates
    let originCoords = data.originCoordinates;
    let destinationCoords = data.destinationCoordinates;

    // Update parent component with coordinates on submit as well
    setLocationCoordinates([originCoords, destinationCoords]);

    // Fallback if coordinates are not available
    if (!originCoords || originCoords.address !== data.origin) {
      originCoords =
        (await getCoordinatesFromAddress(data.origin)) || DEFAULT_ORIGIN;
    }

    if (!destinationCoords || destinationCoords.address !== data.destination) {
      destinationCoords =
        (await getCoordinatesFromAddress(data.destination)) ||
        DEFAULT_DESTINATION;
    }

    const submissionData = {
      vehicle_id: vehicleData?.id,
      origin: data.origin,
      destination: data.destination,
      start_soc: sliderValues.startingCharge,
      min_arrival_soc: sliderValues.minArrivalCharge,
    };

    calculateRoute(submissionData);
  };

  // Handle slider change
  const handleSliderChange = (value, type) => {
    setSliderValues((prev) => ({
      ...prev,
      [type]: value[0],
    }));
  };

  return (
    <div className="bg-white p-8 rounded-2xl border">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1 className="title">Route Planning</h1>
          <p className="paragraph mt-2">
            Enter your journey details and we'll calculate optimal charging stop
          </p>
        </div>

        {/* Trip Details */}
        <div className="mt-6 border rounded-2xl p-4">
          <h1 className="title">Trip Details</h1>

          {/* Origin */}
          <div className="mt-4">
            <h1 className="paragraph text-[#212B36]!">Origin</h1>
            <div className="flex items-center text-base bg-white border border-gray-500/30 rounded-lg p-3 mt-2">
              <MapPin strokeWidth={1.5} className="text-[#637381] mr-3" />
              <input
                {...register("origin", { required: true })}
                ref={originRef}
                className="outline-none text-gray-500 bg-transparent w-full"
                type="text"
                placeholder="Enter your origin"
              />
            </div>
            {/* {errors.origin && (
              <p className="text-red-500 text-sm mt-1">Origin is required</p>
            )} */}
            {/* Show coordinates in real-time */}
            {/* {originCoordinates && (
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {originCoordinates.lat?.toFixed(4) || "..."},{" "}
                {originCoordinates.lng?.toFixed(4) || "..."}
              </p>
            )} */}
          </div>

          {/* Destination */}
          <div className="mt-4">
            <div className="relative flex items-center">
              <h1 className="paragraph text-[#212B36]!">Destination</h1>
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2">
                <CurvedArrowSVG />
              </div>
            </div>

            <div className="flex items-center text-base bg-white border border-gray-500/30 rounded-lg p-3 mt-2">
              <Send strokeWidth={1.5} className="text-[#637381] mr-3" />
              <input
                {...register("destination", { required: true })}
                ref={destinationRef}
                className="outline-none text-gray-500 bg-transparent w-full"
                type="text"
                placeholder="Enter your destination"
              />
            </div>
            {/* {errors.destination && (
              <p className="text-red-500 text-sm mt-1">
                Destination is required
              </p>
            )} */}
            {/* Show coordinates in real-time */}
            {/* {destinationCoordinates && (
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {destinationCoordinates.lat?.toFixed(4) || "..."},{" "}
                {destinationCoordinates.lng?.toFixed(4) || "..."}
              </p>
            )} */}
          </div>
        </div>

        {/* Battery Constraints */}
        <div className="my-6 border p-3 rounded-lg">
          <h1 className="title flex items-center gap-2">
            <BatteryFull strokeWidth={1.5} /> Battery Constraints
          </h1>

          <div className="mt-6">
            <h1 className="title2 font-medium">Starting Charge</h1>
            <div className="mt-4 flex items-center gap-2">
              <Slider
                value={[sliderValues.startingCharge]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleSliderChange(value, "startingCharge")
                }
              />
              <span className="w-[5ch]">{sliderValues.startingCharge}%</span>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="title2 font-medium">Min. Arrival Charge</h1>
            <div className="mt-4 flex items-center gap-2">
              <Slider
                value={[sliderValues.minArrivalCharge]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  handleSliderChange(value, "minArrivalCharge")
                }
              />
              <span className="w-[5ch]">{sliderValues.minArrivalCharge}%</span>
            </div>
          </div>
        </div>

        {/* Selected Vehicle */}
        <div className="bg-[#e5ecfa] p-3 rounded-lg">
          <h1 className="title text-black! flex items-center gap-2">
            <Car size={30} strokeWidth={1} /> Selected Vehicle
          </h1>

          <div className="mt-3 flex justify-between">
            <div className="space-y-2">
              <h1 className="title2">
                Model:{" "}
                <span className="text-[#637381]">{vehicleData?.name}</span>
              </h1>
              <h1 className="title2">
                Power:{" "}
                <span className="text-[#637381]">
                  {vehicleData?.power_kw} KWh
                </span>
              </h1>
              <h1 className="title2">
                Battery:{" "}
                <span className="text-[#637381]">
                  {vehicleData?.nominal_battery_capacity_kwh} kWh
                </span>
              </h1>
            </div>

            <div className="space-y-2 text-end">
              <h1 className="title2">
                Type:{" "}
                <span className="text-[#637381] capitalize">
                  {vehicleData?.vehicle_type}
                </span>
              </h1>
              <h1 className="title2">
                Weight:{" "}
                <span className="text-[#637381]">
                  {vehicleData?.weight_kg} kg
                </span>
              </h1>
              <h1 className="title2">
                Frontal Area:{" "}
                <span className="text-[#637381]">
                  {vehicleData?.frontal_area_m2} m²
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <CommonButton
          type="submit"
          className="w-full bg-[#212B36] text-white py-3 rounded-lg mt-4 flex justify-center items-center"
          disabled={isCalculatePending}
        >
          {isCalculatePending ? (
            "Calculating..."
          ) : (
            <>
              Calculate Route <MoveRightIcon />
            </>
          )}
        </CommonButton>
      </form>

      {isCalculatePending && <Loader />}
    </div>
  );
}
