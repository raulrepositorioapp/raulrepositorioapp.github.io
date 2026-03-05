import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import useUpdateExistingVehicle from "@/hooks/Vehicles/useUpdateExistingVehicle";
import useUpdateDefaultVehicles from "@/hooks/Vehicles/useUpdateDefaultVehicles";
import Loader from "./Loader";

/* ----------------------------------------
   Reusable Form Field Wrapper
----------------------------------------- */
function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

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
      vehiclePhoto: null,
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
    const payload = {
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
      ? updateDefaultVehicle(payload)
      : updateVehicle(payload);
  };

  const formValues = watch();
  const isFormFilled = Object.entries(formValues).some(
    ([key, value]) => key !== "vehiclePhoto" && value !== "" && value !== null,
  );

  const vehicleTypeOptions = [
    { value: "", label: "Seleccione el tipo de vehículo" },
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
        <h2 className="text-2xl font-semibold">
          Editar vehículo personalizado
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Editar una configuración personalizada para su simulación.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {/* Vehicle Parameters */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Parámetros del vehículo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del vehículo">
                <input
                  {...register("vehicleName")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Tipo de vehículo">
                <select
                  {...register("vehicleType")}
                  className="border rounded-lg p-3 text-sm"
                >
                  {vehicleTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Potencia de regeneración máxima (kW)">
                <input
                  {...register("maxRegenPowerKW")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="CRR">
                <input
                  {...register("crr")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="KROT">
                <input
                  {...register("krot")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Eficiencia del motor (%)">
                <input
                  {...register("motorEfficiency")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Potencia auxiliar (kW)">
                <input
                  {...register("auxiliaryPowerKW")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Peso (kg)">
                <input
                  {...register("weightKg")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Área frontal (m²)">
                <input
                  {...register("frontalArea")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Coeficiente de arrastre">
                <input
                  {...register("dragCoefficient")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Eficiencia de regeneración (%)">
                <input
                  {...register("regenerationEfficiency")}
                  inputMode="decimal"
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>
            </div>
          </div>

          {/* Battery */}
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Batería</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Capacidad nominal de la batería (kWh)">
                <input
                  type="number"
                  {...register("nominalBatteryCapacity")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Capacidadusable de la batería (kWh)">
                <input
                  type="number"
                  {...register("usableBatteryCapacity")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Voltaje nominal (V)">
                <input
                  type="number"
                  {...register("nominalVoltage")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Corriente máxima de carga / descarga (A)">
                <input
                  type="number"
                  {...register("maxChargeCurrent")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Límite superior de SOC (%)">
                <input
                  type="number"
                  {...register("upperSOC")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>

              <FormField label="Límite inferior de SOC (%)">
                <input
                  type="number"
                  {...register("lowerSOC")}
                  className="border rounded-lg p-3 text-sm"
                />
              </FormField>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2 border rounded-lg text-gray-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!isFormFilled}
              className={`px-6 py-2 rounded-lg text-white ${
                isFormFilled
                  ? "bg-emerald-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Guardar & Actualizar
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
