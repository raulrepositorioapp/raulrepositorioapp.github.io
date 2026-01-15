import React from "react";

export default function SingleHistoryDetailsSkeleton() {
  return (
    <div className="p-6">
      {/* Status Badge & Date */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
      </div>

      {/* Route Information */}
      <div className="mb-8">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        <div className="space-y-4">
          {/* Origin */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-0.5 h-10 bg-gray-100 mt-1" />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-0.5 h-10 bg-gray-100 mt-1" />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-56 animate-pulse" />
            </div>
          </div>

          {/* Total Distance */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle & Energy Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Vehicle Details Card */}
        <div className="bg-gray-50 p-5 rounded-xl">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
          <div className="space-y-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Energy Consumption Card */}
        <div className="bg-blue-50 p-5 rounded-xl">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
          <div className="space-y-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
            <div className="pt-3 border-t border-blue-200">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
