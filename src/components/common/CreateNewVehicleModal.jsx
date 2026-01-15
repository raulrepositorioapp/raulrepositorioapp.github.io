import useCreateVehicles from "@/hooks/Vehicles/useCreateVehicles";
import React from "react";
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
      powerKW: "",
      weightKg: "",
      frontalArea: "",
      dragCoefficient: "",
      estimatedRange: "",
      regenerationEfficiency: "",
      nominalBatteryCapacity: "",
      usableBatteryCapacity: "",
      nominalVoltage: "",
      maxChargeCurrent: "",
      upperSOC: "",
      lowerSOC: "",
      vehiclePhoto: undefined,
    },
  });

  // CREATE VEHICLE MUTATION
  const { mutate: createVehicle, isPending: isCreateVehiclePending } =
    useCreateVehicles({
      onSuccess: (data) => {
        toast.success(data?.message || "Vehicle created successfully!");
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
            power_kw: "powerKW",
            weight_kg: "weightKg",
            frontal_area_m2: "frontalArea",
            drag_coefficient: "dragCoefficient",
            estimated_range_km: "estimatedRange",
            regeneration_efficiency: "regenerationEfficiency",
            nominal_battery_capacity_kwh: "nominalBatteryCapacity",
            usable_battery_capacity_kwh: "usableBatteryCapacity",
            nominal_voltage_v: "nominalVoltage",
            max_charge_discharge_current_a: "maxChargeCurrent",
            upper_soc_limit: "upperSOC",
            lower_soc_limit: "lowerSOC",
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
    submittedData.append("name", data.vehicleName);
    submittedData.append("vehicle_type", data.vehicleType);
    submittedData.append("power_kw", data.powerKW);
    submittedData.append("weight_kg", data.weightKg);
    submittedData.append("frontal_area_m2", data.frontalArea);
    submittedData.append("drag_coefficient", data.dragCoefficient);
    submittedData.append("estimated_range_km", data.estimatedRange);
    submittedData.append(
      "regeneration_efficiency",
      data.regenerationEfficiency
    );
    submittedData.append(
      "nominal_battery_capacity_kwh",
      data.nominalBatteryCapacity
    );
    submittedData.append(
      "usable_battery_capacity_kwh",
      data.usableBatteryCapacity
    );
    submittedData.append("nominal_voltage_v", data.nominalVoltage);
    submittedData.append(
      "max_charge_discharge_current_a",
      data.maxChargeCurrent
    );
    submittedData.append("upper_soc_limit", data.upperSOC);
    submittedData.append("lower_soc_limit", data.lowerSOC);
    if (file) {
      submittedData.append("photo", file);
    }

    createVehicle(submittedData);
  };

  const uploadedFile = watch("vehiclePhoto");
  const hasFile = uploadedFile && uploadedFile.length > 0;
  const fileName = hasFile ? uploadedFile[0].name : "";
  const previewUrl = hasFile ? URL.createObjectURL(uploadedFile[0]) : null;

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const vehicleTypeOptions = [
    { value: "", label: "Select vehicle type" },
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
        <h2 className="text-2xl font-semibold">Create New Vehicle</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Define physics parameters for a new vehicle profile.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {/* Vehicle Parameters */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("vehicleName", {
                    required: "Vehicle name is required",
                  })}
                  placeholder="Vehicle Name"
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
                    required: "Vehicle type is required",
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

              {/* Rest of the fields remain the same */}
              <div>
                <input
                  {...register("powerKW", { required: "Power is required" })}
                  placeholder="Power (KW)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.powerKW ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.powerKW && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.powerKW.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("weightKg", { required: "Weight is required" })}
                  placeholder="Weight (kg)"
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
                    required: "Frontal area is required",
                  })}
                  placeholder="Frontal Area (m²)"
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
                    required: "Drag coefficient is required",
                  })}
                  placeholder="Aerodynamic Drag Coefficient"
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
                  {...register("estimatedRange", {
                    required: "Estimated range is required",
                  })}
                  placeholder="Estimated Range (km)"
                  type="number"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.estimatedRange ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.estimatedRange && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.estimatedRange.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("regenerationEfficiency", {
                    required: "Regeneration efficiency is required",
                  })}
                  placeholder="Regeneration Efficiency (%)"
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
            </div>
          </div>

          {/* Battery section remains unchanged */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Battery</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("nominalBatteryCapacity", {
                    required: "Nominal capacity is required",
                  })}
                  placeholder="Nominal Battery Capacity (kWh)"
                  type="number"
                  step="0.1"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.nominalBatteryCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.nominalBatteryCapacity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nominalBatteryCapacity.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("usableBatteryCapacity", {
                    required: "Usable capacity is required",
                  })}
                  placeholder="Usable Battery Capacity (kWh)"
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
                  {...register("nominalVoltage", {
                    required: "Nominal voltage is required",
                  })}
                  placeholder="Nominal Voltage (V)"
                  type="number"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.nominalVoltage ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nominalVoltage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nominalVoltage.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("maxChargeCurrent", {
                    required: "Max current is required",
                  })}
                  placeholder="Max Charge/Discharge Current (A)"
                  type="number"
                  className={`border rounded-lg p-3 text-sm w-full ${
                    errors.maxChargeCurrent
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.maxChargeCurrent && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.maxChargeCurrent.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("upperSOC", {
                    required: "Upper SOC is required",
                  })}
                  placeholder="Upper SOC limit (%)"
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
                    required: "Lower SOC is required",
                  })}
                  placeholder="Lower SOC limit (%)"
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
            </div>
          </div>

          {/* Photo Upload - unchanged */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Vehicle Photo Upload <span className="text-red-500">*</span>
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
                  required: "Vehicle photo is required",
                  onChange: () => clearErrors("vehiclePhoto"),
                })}
                className="hidden"
                id="vehiclePhoto"
              />
              <span className="cursor-pointer text-gray-600 text-sm">
                {hasFile ? "Change Photo" : "Click to upload photo"}
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
                  Uploaded: {fileName}
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
              Cancel
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
              {isCreateVehiclePending ? "Creating..." : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>

      {isCreateVehiclePending && <Loader />}
    </div>
  );
}
