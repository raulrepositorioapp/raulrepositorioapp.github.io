import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import useUpdateExistingVehicle from "@/hooks/Vehicles/useUpdateExistingVehicle";
import useUpdateDefaultVehicles from "@/hooks/Vehicles/useUpdateDefaultVehicles";
import Loader from "./Loader";

// Reusable Form Field Wrapper
function FormField({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default function CustomVehicleModalForm({ onClose, vehicle }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicleName: vehicle?.name || "",
      vehicleType: vehicle?.vehicle_type || "",
      weightKg: vehicle?.weight_kg || "",
      frontalArea: vehicle?.frontal_area_m2 || "",
      dragCoefficient: vehicle?.drag_coefficient || "",
      regenerationEfficiency: vehicle?.regeneration_efficiency || "",
      usableBatteryCapacity: vehicle?.usable_battery_capacity_kwh || "",
      upperSOC: vehicle?.upper_soc_limit || "",
      lowerSOC: vehicle?.lower_soc_limit || "",
      maxRegenPowerKW: vehicle?.max_regen_power_kw || "",
      crr: vehicle?.crr || "",
      motorEfficiency: vehicle?.motor_efficiency || "",
      auxiliaryPowerKW: vehicle?.auxiliary_power_kw || "",
      passengerMassKg: vehicle?.passenger_mass_kg || "",
      vehiclePhoto: undefined,
    },
  });

  const { mutate: updateVehicle, isPending: isUpdatingVehiclePending } =
    useUpdateExistingVehicle({
      vehicleId: vehicle?.id,
      onSuccess: (data) => {
        toast.success(data?.message || "Vehículo actualizado correctamente!");
        queryClient.invalidateQueries(["vehicles"]);
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Algo salió mal!");
      },
    });

  const {
    mutate: updateDefaultVehicle,
    isPending: isUpdatingDefaultVehiclePending,
  } = useUpdateDefaultVehicles({
    vehicleId: vehicle?.id,
    onSuccess: (data) => {
      toast.success(data?.message || "Vehículo actualizado correctamente!");
      queryClient.invalidateQueries(["vehicles"]);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Algo salió mal!");
    },
  });

  const onSubmit = (data) => {
    const file = data.vehiclePhoto?.[0] || null;

    const submittedData = new FormData();
    submittedData.append("name", data.vehicleName);
    submittedData.append("vehicle_type", data.vehicleType);
    submittedData.append("weight_kg", data.weightKg);
    submittedData.append("frontal_area_m2", data.frontalArea);
    submittedData.append("drag_coefficient", data.dragCoefficient);
    submittedData.append(
      "regeneration_efficiency",
      data.regenerationEfficiency,
    );
    submittedData.append(
      "usable_battery_capacity_kwh",
      data.usableBatteryCapacity,
    );
    submittedData.append("upper_soc_limit", data.upperSOC);
    submittedData.append("lower_soc_limit", data.lowerSOC);
    submittedData.append("max_regen_power_kw", data.maxRegenPowerKW);
    submittedData.append("crr", data.crr);
    submittedData.append("motor_efficiency", data.motorEfficiency);
    submittedData.append("auxiliary_power_kw", data.auxiliaryPowerKW);
    submittedData.append("passenger_mass_kg", data.passengerMassKg);

    if (file) {
      submittedData.append("photo", file);
    }

    vehicle?.is_default
      ? updateDefaultVehicle(submittedData)
      : updateVehicle(submittedData);
  };

  const uploadedFile = watch("vehiclePhoto");
  const hasFile = uploadedFile && uploadedFile.length > 0;
  const fileName = hasFile ? uploadedFile[0].name : "";
  const previewUrl = hasFile
    ? URL.createObjectURL(uploadedFile[0])
    : vehicle?.photo
      ? import.meta.env.VITE_MEDIA_URL + vehicle.photo
      : null;

  useEffect(() => {
    return () => {
      if (hasFile && previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, hasFile]);

  const vehicleTypeOptions = [
    { value: "", label: "Seleccionar tipo de vehículo" },
    { value: "car", label: "Car" },
    { value: "bike", label: "Bike" },
    { value: "bus", label: "Bus" },
    { value: "truck", label: "Truck" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose(false)}
      />

      <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold">Editar vehículo</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Modificar parámetros físicos para este perfil de vehículo.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {/* Vehicle Parameters */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Parámetros del vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del vehículo" error={errors.vehicleName}>
                <input
                  {...register("vehicleName", {
                    required: "Nombre del vehículo es requerido",
                  })}
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.vehicleName ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="Tipo de vehículo" error={errors.vehicleType}>
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
              </FormField>

              <FormField label="Masa del vehículo (kg)" error={errors.weightKg}>
                <input
                  {...register("weightKg", { required: "Peso es requerido" })}
                  type="number"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.weightKg ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Superficie frontal (m²)"
                error={errors.frontalArea}
              >
                <input
                  {...register("frontalArea", {
                    required: "Área frontal es requerida",
                  })}
                  type="number"
                  step="0.01"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.frontalArea ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Coeficiente de resistencia aerodinámica (C_x)"
                error={errors.dragCoefficient}
              >
                <input
                  {...register("dragCoefficient", {
                    required: "Coeficiente de arrastre es requerido",
                  })}
                  type="number"
                  step="0.001"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.dragCoefficient
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Rendimiento regeneración (%)"
                error={errors.regenerationEfficiency}
              >
                <input
                  {...register("regenerationEfficiency", {
                    required: "Eficiencia de regeneración es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.regenerationEfficiency
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Potencia máxima de regeneración (kW)"
                error={errors.maxRegenPowerKW}
              >
                <input
                  {...register("maxRegenPowerKW", {
                    required: "Potencia de regeneración máxima es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.maxRegenPowerKW
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="Coeficiente de rodadura (µ)" error={errors.crr}>
                <input
                  {...register("crr", { required: "CRR es requerida" })}
                  type="number"
                  step="0.0001"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.crr ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Eficiencia tren motriz (n_drive)"
                error={errors.motorEfficiency}
              >
                <input
                  {...register("motorEfficiency", {
                    required: "Eficiencia del motor es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.motorEfficiency
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Potencia gastada auxiliar (kW)"
                error={errors.auxiliaryPowerKW}
              >
                <input
                  {...register("auxiliaryPowerKW", {
                    required: "Potencia auxiliar es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.auxiliaryPowerKW
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>
            </div>
          </div>

          {/* Battery section */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Batería</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Capacidad utilizable bateria (kWh)"
                error={errors.usableBatteryCapacity}
              >
                <input
                  {...register("usableBatteryCapacity", {
                    required: "Capacidad útil de la batería es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.usableBatteryCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="SOC superior (%)" error={errors.upperSOC}>
                <input
                  {...register("upperSOC", {
                    required: "Límite superior de SOC es requerido",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.upperSOC ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="SOC inferior (%)" error={errors.lowerSOC}>
                <input
                  {...register("lowerSOC", {
                    required: "Límite inferior de SOC es requerido",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.lowerSOC ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField
                label="Masa pasajeros (kg)"
                error={errors.passengerMassKg}
              >
                <input
                  {...register("passengerMassKg", {
                    required: "Masa de pasajeros es requerida",
                  })}
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.passengerMassKg
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </FormField>
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

          {/* Photo Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Subir foto del vehículo
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
                {...register("vehiclePhoto")}
                className="hidden"
                id="vehiclePhoto"
              />
              <span className="cursor-pointer text-gray-600 text-sm">
                {hasFile ? "Cambiar foto" : "Haga clic para cargar la foto"}
              </span>
            </label>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-green-600 mb-2">
                  {hasFile ? `Nueva foto: ${fileName}` : "Foto actual"}
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
              disabled={
                isUpdatingVehiclePending || isUpdatingDefaultVehiclePending
              }
              className={`px-6 py-2 rounded-lg text-white ${
                isUpdatingVehiclePending || isUpdatingDefaultVehiclePending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 cursor-pointer"
              }`}
            >
              {isUpdatingVehiclePending || isUpdatingDefaultVehiclePending
                ? "Guardando..."
                : "Guardar & Actualizar"}
            </button>
          </div>
        </form>
      </div>

      {(isUpdatingVehiclePending || isUpdatingDefaultVehiclePending) && (
        <Loader />
      )}
    </div>
  );
}
