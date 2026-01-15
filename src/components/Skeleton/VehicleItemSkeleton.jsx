import React from "react";

export default function VehicleItemSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image section skeleton */}
      <div className="bg-gray-200 p-8 animate-pulse">
        <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Content section skeleton */}
      <div className="p-5">
        {/* Title and type skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 bg-gray-300 rounded w-2/3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>

        {/* Spec items skeleton - first row */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-1/2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="w-1/2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        {/* Spec items skeleton - second row */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-1/2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="w-1/2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="w-full border border-gray-200 py-2.5 rounded-lg flex items-center justify-center gap-2">
          <div className="h-4 bg-gray-300 rounded w-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}
