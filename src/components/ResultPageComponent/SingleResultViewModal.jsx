import React from "react";
import {
  X,
  MapPin,
  Car,
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  Navigation,
} from "lucide-react";
import useGetSingleHistoryDetails from "@/hooks/History/useGetSingleHistoryDetails";
import SingleHistoryDetailsSkeleton from "../Skeleton/SingleHistoryDetailsSkeleton";

export default function SingleResultViewModal({ itemData, onClose }) {
  // Single History Details Hook
  const {
    singleHistoryDetails,
    isSingleHistoryDetailsLoading,
    isSingleHistoryDetailsError,
  } = useGetSingleHistoryDetails({
    id: itemData?.id,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "running":
        return <Clock className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const formatDistance = (km) => {
    const miles = (km * 0.621371).toFixed(2);
    return `${km.toFixed(2)} km (${miles} mi)`;
  };

  return (
    <div className="w-full h-full fixed top-0 left-0 backdrop-blur-[10px] bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[800px] bg-white border border-gray-200 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trip Details</h2>
            <p className="text-gray-500 mt-1">Complete journey information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {isSingleHistoryDetailsLoading ? (
          <SingleHistoryDetailsSkeleton />
        ) : (
          <div className="p-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(
                  singleHistoryDetails?.status
                )}`}
              >
                {getStatusIcon(singleHistoryDetails?.status)}
                <span className="font-semibold capitalize">
                  {singleHistoryDetails?.status}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                <Calendar className="w-4 h-4 inline mr-2" />
                {formatDate(singleHistoryDetails?.created_at)}
              </div>
            </div>

            {/* Route Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Route
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-10 bg-gray-200 mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium">
                      {singleHistoryDetails?.origin}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-10 bg-gray-200 mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">
                      {singleHistoryDetails?.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Distance</p>
                    <p className="font-medium">
                      {formatDistance(singleHistoryDetails?.total_distance_km)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Energy Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">
                      {singleHistoryDetails?.vehicle}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium">Electric Vehicle (EV)</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  Energy Consumption
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Energy Used</p>
                    <p className="font-medium text-2xl text-blue-600">
                      {singleHistoryDetails?.energy_used_kwh.toFixed(2)} kWh
                    </p>
                  </div>
                  <div className="pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-500">Efficiency</p>
                    <p className="font-medium">
                      {(
                        singleHistoryDetails?.total_distance_km /
                        singleHistoryDetails?.energy_used_kwh
                      ).toFixed(2)}{" "}
                      km/kWh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSingleHistoryDetailsError && (
          <div className="py-20 text-center text-black text-lg font-semibold">
            Something went wrong! Please try again
          </div>
        )}
      </div>
    </div>
  );
}
