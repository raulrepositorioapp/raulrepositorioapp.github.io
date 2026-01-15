import React from "react";

export default function TableTrSkeleton() {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Route name */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      </td>

      {/* Vehicle */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </td>

      {/* Distance */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </td>

      {/* Energy */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-md w-24 animate-pulse" />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
      </td>
    </tr>
  );
}
