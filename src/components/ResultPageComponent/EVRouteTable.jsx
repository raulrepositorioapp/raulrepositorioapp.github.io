import React, { useState } from "react";
import { Search, Filter, Plus, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import useGetHistory from "@/hooks/History/useGetHistory";
import TableTrSkeleton from "../Skeleton/TableTrSkeleton";
import toast from "react-hot-toast";
import Loader from "../common/Loader";
import usePdfExport from "@/hooks/Export/usePdfExport";
import SingleResultViewModal from "./SingleResultViewModal";

export default function EVRouteTable() {
  // Common States
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingleDetailsModal, setShowSingleDetailsModal] = useState({
    show: false,
    data: null,
  });

  const { allHistory, isAllHistoryLoading, isAllHistoryError } =
    useGetHistory();

  const getStatusStyle = (status) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredRoutes = allHistory?.results?.filter(
    (route) =>
      route?.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route?.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRouteHistory = (route) => {
    setShowSingleDetailsModal({ show: true, data: route });
  };

  // PDF Download Hook
  const [currentExportableId, setCurrentExportableId] = useState(null);
  const { pdfExport, isPdfExportLoading } = usePdfExport({
    id: currentExportableId,
  });

  if (pdfExport && pdfExport.download_url) {
    window.open(pdfExport.download_url, "_blank", "noopener,noreferrer");
  }

  const handleDownloadRouteHistory = (route) => {
    setCurrentExportableId(route?.id);
  };

  return (
    <div className=" bg-white rounded-lg mt-8 border p-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Route Calculations History
            </h1>
            <p className="text-gray-500">
              View and manage EV route simulations
            </p>
          </div>
          <Link to="/vechile">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors">
              <Plus size={20} />
              New Ev Route Simulation
            </button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search the route name and vehicle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Route Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Distance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Energy Usage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoutes?.map((route, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {route?.route_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {route?.vehicle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {route?.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {route?.distance_km}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {route?.energy_kwh}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-md text-sm font-medium capitalize ${getStatusStyle(
                          route?.status
                        )}`}
                      >
                        {route?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewRouteHistory(route)}
                          type="button"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleDownloadRouteHistory(route)}
                          type="button"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRoutes?.length === 0 && !isAllHistoryLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-sm text-gray-600 text-center"
                    >
                      No History Found!
                    </td>
                  </tr>
                )}

                {isAllHistoryLoading && !isAllHistoryError && (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableTrSkeleton key={index} />
                    ))}
                  </>
                )}
              </tbody>
            </table>

            {isAllHistoryError && !isAllHistoryLoading && (
              <div className="flex items-center justify-center py-20">
                <p className="text-xl text-black/60 font-semibold">
                  Something Went Wrong! Please Try Again!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPdfExportLoading && <Loader />}

      {showSingleDetailsModal?.show && (
        <SingleResultViewModal
          itemData={showSingleDetailsModal?.data}
          onClose={() => setShowSingleDetailsModal({ show: false, data: null })}
        />
      )}
    </div>
  );
}
