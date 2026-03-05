import React, { useState } from "react";
import { Pencil, Pin, Wrench } from "lucide-react";
import { SlArrowRight } from "react-icons/sl";
import CommonButton from "../common/CommonButton";
import CreateNewVehicleForm from "../common/CreateNewVehicleModal";
import CustomVehicleModalForm from "../common/CustomVehicleModalForm";
import useGetAllVehicles from "@/hooks/Vehicles/useGetAllVehicles";
import VehicleItemSkeleton from "../Skeleton/VehicleItemSkeleton";
import useGetConstants from "@/hooks/Constants/useGetConstants";
import ConstantsModalForm from "../common/ConstantsModalForm";

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
  const [constantsModalOpen, setConstantsModalOpen] = useState(false);

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
    <div className="relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Selecciona tu vehículo
          </h2>
          <p className="text-gray-600 mt-2">
            Elige un modelo predeterminado o crea una configuración
            personalizada para tu simulación.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Crear vehículo personalizado
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles?.data?.map((vehicle) => (
          <>
            {vehicle?.is_active && (
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
                    <SpecItem
                      label="Motor Efficiency"
                      value={vehicle?.motor_efficiency}
                      type=""
                    />
                    <SpecItem
                      label="Weight"
                      value={vehicle?.weight_kg}
                      type="Kg"
                    />
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
                    Vehículo personalizado
                  </button>
                </div>
              </div>
            )}
          </>
        ))}

        {isAllVehiclesLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <VehicleItemSkeleton key={index} />
          ))}
      </div>

      {/* Bottom section */}
      {selectedVehicle && (
        <div className="mt-8 bg-white p-6 rounded-2xl flex justify-between items-center">
          <div>
            <div className="flex items-center gap-5 mb-5">
              <h1 className="title">Constantes ambientales</h1>
              <div>
                <button
                  onClick={() => setConstantsModalOpen(true)}
                  type="button"
                  className="border text-gray-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 duration-300 cursor-pointer"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-4">
              <p className="Titel2">
                Densidad del aire:{" "}
                <span className="text-[#637381]!">
                  {constants?.air_density || 0} kg/m³
                </span>
              </p>
              <p className="Titel2">
                Gravedad:{" "}
                <span className="text-[#637381]!">
                  {constants?.gravity || 0} m/s²
                </span>
              </p>
              <p className="Titel2">
                Temperatura:{" "}
                <span className="text-[#637381]!">
                  {constants?.temperature_c || 0}°C
                </span>
              </p>
              <p className="Titel2">
                Velocidad del viento:{" "}
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
              Cancelar
            </CommonButton>

            <CommonButton
              to="/route"
              state={selectedVehicle}
              className="mt-5 flex items-center"
            >
              Continuar con la planificación de ruta <SlArrowRight />
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

      {constantsModalOpen && (
        <ConstantsModalForm
          constants={constants}
          onClose={setConstantsModalOpen}
        />
      )}

      {/* Error */}
      {isAllVehiclesError && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              No se encontraron vehículos
            </h1>
            <p className="text-gray-600 mt-2">
              Crea un vehículo personalizado o selecciona un modelo
              preestablecido.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
