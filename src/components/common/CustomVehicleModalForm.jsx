import useUpdateExistingVehicle from "@/hooks/Vehicles/useUpdateExistingVehicle";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateDefaultVehicles from "@/hooks/Vehicles/useUpdateDefaultVehicles";

export default function CustomVehicleModalForm({ onClose, vehicle }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      vehicleName: vehicle?.name || "",
      vehicleType: vehicle?.vehicle_type || "",
      maxRegenPowerKW: vehicle?.max_regen_power_kw || 0,
      crr: vehicle?.crr || 0,
      krot: vehicle?.krot || 0,
      motorEfficiency: vehicle?.motor_efficiency || 0,
      auxiliaryPowerKW: vehicle?.auxiliary_power_kw || 0,
      weightKg: vehicle?.weight_kg || 0,
      frontalArea: vehicle?.frontal_area_m2 || 0,
      dragCoefficient: vehicle?.drag_coefficient || 0,
      regenerationEfficiency: vehicle?.regeneration_efficiency || 0,
      nominalBatteryCapacity: vehicle?.nominal_battery_capacity_kwh || 0,
      usableBatteryCapacity: vehicle?.usable_battery_capacity_kwh || 0,
      nominalVoltage: vehicle?.nominal_voltage_v || 0,
      maxChargeCurrent: vehicle?.max_charge_discharge_current_a || 0,
      upperSOC: vehicle?.upper_soc_limit || 0,
      lowerSOC: vehicle?.lower_soc_limit || 0,
      vehiclePhoto: vehicle?.photo || null,
    },
  });

  const { mutate: updateVehicle, isPending: isUpdatingVehiclePending } =
    useUpdateExistingVehicle({
      vehicleId: vehicle?.id,
      onSuccess: (data) => {
        toast.success(data?.message || "Vehicle updated successfully!");
        queryClient.invalidateQueries(["vehicles"]);
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
        console.log(err);
      },
    });

  const {
    mutate: updateDefaultVehicle,
    isPending: isUpdatingDefaultVehiclePending,
  } = useUpdateDefaultVehicles({
    vehicleId: vehicle?.id,
    onSuccess: (data) => {
      toast.success(data?.message || "Vehicle updated successfully!");
      queryClient.invalidateQueries(["vehicles"]);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
      console.log(err);
    },
  });

  const onSubmit = (data) => {
    const submittedData = {
      name: data.vehicleName,
      vehicle_type: data.vehicleType,
      max_regen_power_kw: data.maxRegenPowerKW,
      crr: data.crr,
      krot: data.krot,
      motor_efficiency: data.motorEfficiency,
      auxiliary_power_kw: data.auxiliaryPowerKW,
      weight_kg: data.weightKg,
      frontal_area_m2: data.frontalArea,
      drag_coefficient: data.dragCoefficient,
      regeneration_efficiency: data.regenerationEfficiency,
      nominal_battery_capacity_kwh: data.nominalBatteryCapacity,
      usable_battery_capacity_kwh: data.usableBatteryCapacity,
      nominal_voltage_v: data.nominalVoltage,
      max_charge_discharge_current_a: data.maxChargeCurrent,
      upper_soc_limit: data.upperSOC,
      lower_soc_limit: data.lowerSOC,
    };

    vehicle?.is_default
      ? updateDefaultVehicle(submittedData)
      : updateVehicle(submittedData);
  };

  const formValues = watch();
  const uploadedFile = watch("vehiclePhoto");

  const hasFile = uploadedFile && uploadedFile.length > 0;
  const hasTextInput = Object.entries(formValues).some(([key, value]) => {
    if (key === "vehiclePhoto") return false;
    return value !== "" && value !== null;
  });

  const isFormFilled = hasFile || hasTextInput;

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold">Edit Custom Vehicle</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Edit a custom configuration for your simulation.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("vehicleName")}
                placeholder="Vehicle Name"
                className="border rounded-lg p-3 text-sm"
              />

              <select
                {...register("vehicleType")}
                className="border rounded-lg p-3 text-sm w-full border-gray-300"
              >
                {vehicleTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <input
                {...register("maxRegenPowerKW")}
                placeholder="Max Regen Power (kW)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("crr")}
                placeholder="CRR"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("krot")}
                placeholder="KROT"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("motorEfficiency")}
                placeholder="Motor Efficiency"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("auxiliaryPowerKW")}
                placeholder="Auxiliary Power (kW)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("weightKg")}
                placeholder="Weight (kg)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("frontalArea")}
                placeholder="Frontal Area (m²)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("dragCoefficient")}
                placeholder="Aerodynamic Drag Coefficient"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("regenerationEfficiency")}
                placeholder="Regeneration Efficiency (%)"
                className="border rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Battery</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("nominalBatteryCapacity")}
                placeholder="Nominal Battery Capacity (kWh)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("usableBatteryCapacity")}
                placeholder="Usable Battery Capacity (kWh)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("nominalVoltage")}
                placeholder="Nominal Voltage (V)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("maxChargeCurrent")}
                placeholder="Max Charge/Discharge Current (A)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("upperSOC")}
                placeholder="Upper SOC limit (%)"
                className="border rounded-lg p-3 text-sm"
              />
              <input
                {...register("lowerSOC")}
                placeholder="Lower SOC limit (%)"
                className="border rounded-lg p-3 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2 border rounded-lg text-gray-600 cursor-pointer"
            >
              Reset to Defaults
            </button>

            <button
              type="submit"
              disabled={!isFormFilled}
              className={`px-6 py-2 rounded-lg text-white cursor-pointer ${
                isFormFilled
                  ? "bg-emerald-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Save & Update
            </button>
          </div>
        </form>
      </div>

      {isUpdatingVehiclePending && <Loader />}
      {isUpdatingDefaultVehiclePending && <Loader />}
    </div>
  );
}
