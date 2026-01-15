import React, { useState } from "react";
import { Pin, Wrench } from "lucide-react";
import { SlArrowRight } from "react-icons/sl";
import CommonButton from "../common/CommonButton";
import CreateNewVehicleForm from "../common/CreateNewVehicleModal";
import CustomVehicleModalForm from "../common/CustomVehicleModalForm";
import useGetAllVehicles from "@/hooks/Vehicles/useGetAllVehicles";
import VehicleItemSkeleton from "../Skeleton/VehicleItemSkeleton";
import useGetConstants from "@/hooks/Constants/useGetConstants";

const SpecItem = ({ label, value, type }) => (
  <div>
    <p className="text-[#212B36] text-[16px] leading-6">{label}</p>
    <p className="text-[#637381] font-roboto text-[16px] leading-6 mt-1">
      {value} {type}
    </p>
  </div>
);

export default function VehicleCard() {
  // Common States
  const [modalOpen, setModalOpen] = useState(false);
  const [customVehicle, setCustomVehicle] = useState(false);
  const [customVehicleItem, setCustomVehicleItem] = useState(null);

  // Constants
  const { constants } = useGetConstants();

  // STATE FOR SELECTION
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { vehicles, isAllVehiclesLoading, isAllVehiclesError } =
    useGetAllVehicles();

  const handleCustomizeVehicle = (item) => {
    setCustomVehicle(true);
    setCustomVehicleItem(item);
  };

  // SELECT VEHICLE
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Select Your Vehicle
          </h2>
          <p className="text-gray-600 mt-2">
            Choose a preset model or create a custom configuration for your
            simulation.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Create Custom Vehicle
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles?.data?.map((vehicle) => (
          <div
            key={vehicle?.id}
            onClick={() => handleSelectVehicle(vehicle)}
            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer
              ${
                selectedVehicle?.id === vehicle?.id
                  ? "border-emerald-500"
                  : "border-gray-200"
              }
            `}
          >
            <div className="bg-black p-5 relative">
              <img
                src={import.meta.env.VITE_MEDIA_URL + vehicle?.photo}
                alt={vehicle?.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              {vehicle?.is_default && (
                <Pin className="text-white absolute top-2 right-2 rotate-45 z-2" />
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#212B36] text-[24px] leading-9">
                  {vehicle?.name}
                </h3>
                <span className="text-[#1CA9A6] text-[20px] leading-[30px] font-medium capitalize">
                  {vehicle?.vehicle_type}
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <SpecItem label="Power" value={vehicle?.power_kw} type="KW" />
                <SpecItem label="Weight" value={vehicle?.weight_kg} type="Kg" />
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <SpecItem
                  label="Battery"
                  value={vehicle?.usable_battery_capacity_kwh}
                  type="KWh"
                />
                <SpecItem
                  label="Frontal Area"
                  value={vehicle?.frontal_area_m2}
                  type="m2"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomizeVehicle(vehicle);
                }}
                className="w-full border text-gray-500 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 duration-300 cursor-pointer"
              >
                <Wrench size={18} />
                Custom Vehicle
              </button>
            </div>
          </div>
        ))}

        {isAllVehiclesLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <VehicleItemSkeleton key={index} />
          ))}
      </div>

      {isAllVehiclesError && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              No Vehicles Found
            </h1>
            <p className="text-gray-600 mt-2">
              Create a custom vehicle or select a preset model.
            </p>
          </div>
        </div>
      )}

      {/* Bottom section */}
      {selectedVehicle && (
        <div className="mt-8 bg-white p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="title">Environmental Constants</h1>
            <div className="mt-1 flex items-center gap-4">
              <p className="Titel2">
                Air Density:{" "}
                <span className="text-[#637381]!">
                  {constants?.air_density || 0} kg/m³
                </span>
              </p>
              <p className="Titel2">
                Gravity:{" "}
                <span className="text-[#637381]!">
                  {constants?.gravity || 0} m/s²
                </span>
              </p>
              <p className="Titel2">
                Temp:{" "}
                <span className="text-[#637381]!">
                  {constants?.temperature_c || 0}°C
                </span>
              </p>
              <p className="Titel2">
                Wind speed:{" "}
                <span className="text-[#637381]!">
                  {constants?.wind_speed || 0} m/s
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <CommonButton
              to="/"
              variant="fill"
              className="mt-5 flex items-center border bg-transparent text-gray-500!"
            >
              Cancel
            </CommonButton>

            <CommonButton
              to="/route"
              state={selectedVehicle}
              className="mt-5 flex items-center"
            >
              Continue to Route Planning <SlArrowRight />
            </CommonButton>
          </div>
        </div>
      )}

      {/* Modals */}
      {modalOpen && <CreateNewVehicleForm onClose={setModalOpen} />}

      {customVehicle && (
        <CustomVehicleModalForm
          vehicle={customVehicleItem}
          onClose={setCustomVehicle}
        />
      )}
    </div>
  );
}
