import useCreateVehicles from "@/hooks/Vehicles/useCreateVehicles";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateNewVehicleModal({ onClose }) {
  // COMMON STATES
  const queryClient = useQueryClient();

  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicleName: "",
      vehicleType: "",
      weightKg: "",
      frontalArea: "",
      dragCoefficient: "",
      regenerationEfficiency: "",
      usableBatteryCapacity: "",
      upperSOC: "",
      lowerSOC: "",
      maxRegenPowerKW: "",
      crr: "",
      motorEfficiency: "",
      auxiliaryPowerKW: "",
      passengerMassKg: "",
      vehiclePhoto: undefined,
    },
  });

  // CREATE VEHICLE MUTATION
  const { mutate: createVehicle, isPending: isCreateVehiclePending } =
    useCreateVehicles({
      onSuccess: (data) => {
        toast.success(data?.message || "Vehículo creado correctamente!");
        queryClient.invalidateQueries(["vehicles"]);
        onClose();
      },
      onError: (err) => {
        const errorData = err?.response?.data;

        clearErrors();

        if (errorData && typeof errorData === "object") {
          const fieldMap = {
            name: "vehicleName",
            vehicle_type: "vehicleType",
            weight_kg: "weightKg",
            frontal_area_m2: "frontalArea",
            drag_coefficient: "dragCoefficient",
            regeneration_efficiency: "regenerationEfficiency",
            usable_battery_capacity_kwh: "usableBatteryCapacity",
            upper_soc_limit: "upperSOC",
            lower_soc_limit: "lowerSOC",

            max_regen_power_kw: "maxRegenPowerKW",
            crr: "crr",
            motor_efficiency: "motorEfficiency",
            auxiliary_power_kw: "auxiliaryPowerKW",
            passenger_mass_kg: "passengerMassKg",

            photo: "vehiclePhoto",
          };

          Object.entries(errorData).forEach(([key, messages]) => {
            const fieldName = fieldMap[key] || key;

            let message = "";
            if (Array.isArray(messages)) {
              message = messages[0];
            } else if (typeof messages === "string") {
              message = messages;
            }

            if (message) {
              setError(fieldName, {
                type: "server",
                message,
              });
            }
          });
        }
      },
    });

  const onSubmit = (data) => {
    const file = data.vehiclePhoto?.[0] || null;

    const submittedData = new FormData();
    submittedData.append("name", data.vehicleName); //
    submittedData.append("vehicle_type", data.vehicleType); //
    submittedData.append("weight_kg", data.weightKg); //
    submittedData.append("frontal_area_m2", data.frontalArea); //
    submittedData.append("drag_coefficient", data.dragCoefficient); //
    submittedData.append(
      "regeneration_efficiency",
      data.regenerationEfficiency,
    ); //
    submittedData.append(
      "usable_battery_capacity_kwh",
      data.usableBatteryCapacity,
    ); //
    submittedData.append("upper_soc_limit", data.upperSOC); //
    submittedData.append("lower_soc_limit", data.lowerSOC); //

    submittedData.append("max_regen_power_kw", data.maxRegenPowerKW); //
    submittedData.append("crr", data.crr); //
    submittedData.append("motor_efficiency", data.motorEfficiency); //
    submittedData.append("auxiliary_power_kw", data.auxiliaryPowerKW); //
    submittedData.append("passenger_mass_kg", data.passengerMassKg); //

    if (file) {
      submittedData.append("photo", file); //
    }

    createVehicle(submittedData);
  };

  const uploadedFile = watch("vehiclePhoto");
  const hasFile = uploadedFile && uploadedFile.length > 0;
  const fileName = hasFile ? uploadedFile[0].name : "";
  const previewUrl = hasFile ? URL.createObjectURL(uploadedFile[0]) : null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const vehicleTypeOptions = [
    { value: "", label: "Seleccionar tipo de vehículo" },
    { value: "car", label: "Coche" },
    { value: "bike", label: "Bicicleta" },
    { value: "bus", label: "Autobús" },
    { value: "truck", label: "Camión" },
    { value: "other", label: "Otro" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose(false)}
      />

      <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold">Crear nuevo vehículo</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Definir parámetros físicos para un nuevo perfil de vehículo.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {/* Vehicle Parameters */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Parámetros del vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("vehicleName", {
                    required: "Nombre del vehículo es requerido",
                  })}
                  placeholder="Nombre del vehículo"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.vehicleName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.vehicleName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicleName.message}
                  </p>
                )}
              </div>

              {/* Vehicle Type Select */}
              <div>
                <select
                  {...register("vehicleType", {
                    required: "Tipo de vehículo es requerido",
                  })}
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.vehicleType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {vehicleTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vehicleType.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("weightKg", { required: "Peso es requerido" })}
                  placeholder="Masa del vehículo (kg)"
                  type="number"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.weightKg ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.weightKg && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.weightKg.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("frontalArea", {
                    required: "Área frontal es requerida",
                  })}
                  placeholder="Superficie frontal (m²)"
                  type="number"
                  step="0.01"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.frontalArea ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.frontalArea && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.frontalArea.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("dragCoefficient", {
                    required: "Coeficiente de arrastre es requerido",
                  })}
                  placeholder="Coeficiente de resistencia aerodinámica (C_x)"
                  type="number"
                  step="0.001"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.dragCoefficient
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.dragCoefficient && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dragCoefficient.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("regenerationEfficiency", {
                    required: "Eficiencia de regeneración es requerida",
                  })}
                  placeholder="Rendimiento regeneración (%)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.regenerationEfficiency
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.regenerationEfficiency && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regenerationEfficiency.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("maxRegenPowerKW", {
                    required: "Potencia de regeneración máxima es requerida",
                  })}
                  placeholder="Potencia máxima de regeneración (kW)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.maxRegenPowerKW
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.maxRegenPowerKW && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.maxRegenPowerKW.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("crr", { required: "CRR es requerida" })}
                  placeholder="Coeficiente de rodadura (µ)"
                  type="number"
                  step="0.0001"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.crr ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <input
                  {...register("motorEfficiency", {
                    required: "Eficiencia del motor es requerida",
                  })}
                  placeholder="Eficiencia tren motriz (n_drive)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.motorEfficiency
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <input
                  {...register("auxiliaryPowerKW", {
                    required: "Potencia auxiliar es requerida",
                  })}
                  placeholder="Potencia gastada auxiliar (incluye aire acondicionado/calefacción…) (kW)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.auxiliaryPowerKW
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Battery section remains unchanged */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Batería</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("usableBatteryCapacity", {
                    required: "Capacidad útil de la batería es requerida",
                  })}
                  placeholder="Capacidad utilizable bateria (kWh)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.usableBatteryCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.usableBatteryCapacity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.usableBatteryCapacity.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("upperSOC", {
                    required: "Límite superior de SOC es requerido",
                  })}
                  placeholder="State of Charge (Estado de Carga) (%)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.upperSOC ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.upperSOC && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.upperSOC.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("lowerSOC", {
                    required: "Límite inferior de SOC es requerido",
                  })}
                  placeholder="SOC inferior (%)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.lowerSOC ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lowerSOC && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lowerSOC.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("passengerMassKg", {
                    required: "Masa de pasajeros es requerida",
                  })}
                  placeholder="Masa pasajeros (kg)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.passengerMassKg
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.passengerMassKg && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passengerMassKg.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <ul className="pl-5 list-disc space-y-1">
              <li className="text-sm text-gray-600">
                <span className="font-semibold">n_drive: </span> incluye
                inversor; Motor eléctrico; Reductor / transmisión; Pérdidas
                eléctricas y mecánicas
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-semibold">
                  Potencia gastada auxiliar:{" "}
                </span>
                incluye aire acondicionado/calefacción…
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-semibold">SOC: </span> State of Charge
                (Estado de Carga)
              </li>
            </ul>
          </div>

          {/* Photo Upload - unchanged */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Subir foto del vehículo <span className="text-red-500">*</span>
            </label>

            <label
              htmlFor="vehiclePhoto"
              className={`border border-dashed rounded-xl p-6 text-center w-full block cursor-pointer ${
                errors.vehiclePhoto ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                {...register("vehiclePhoto", {
                  required: "Subir foto del vehículo es requerido",
                  onChange: () => clearErrors("vehiclePhoto"),
                })}
                className="hidden"
                id="vehiclePhoto"
              />
              <span className="cursor-pointer text-gray-600 text-sm">
                {hasFile ? "Cambiar foto" : "Haga clic para cargar la foto"}
              </span>
            </label>

            {errors.vehiclePhoto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.vehiclePhoto.message}
              </p>
            )}

            {hasFile && (
              <div className="mt-4">
                <p className="text-sm text-green-600 mb-2">
                  Cargada: {fileName}
                </p>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Vehicle preview"
                    className="max-h-64 rounded-lg shadow-md object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2 border rounded-lg text-gray-600 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreateVehiclePending}
              className={`px-6 py-2 rounded-lg text-white ${
                isCreateVehiclePending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 cursor-pointer"
              }`}
            >
              {isCreateVehiclePending ? "Creando..." : "Crear vehículo"}
            </button>
          </div>
        </form>
      </div>

      {isCreateVehiclePending && <Loader />}
    </div>
  );
}
