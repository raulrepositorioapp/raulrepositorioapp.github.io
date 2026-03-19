import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import useUpdateConstants from "@/hooks/Constants/useUpdateConstants";

// Reusable Form Field Wrapper
function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function ConstantsModalForm({ onClose, constants }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      airDensity: constants?.air_density || "",
      gravity: constants?.gravity || "",
      temperatureC: constants?.temperature_c || "",
      windSpeed: constants?.wind_speed || "",
      chargerEfficiency: constants?.charger_efficiency || "",
    },
  });

  const { mutate: updateConstants, isPending: isUpdatingConstantsPending } =
    useUpdateConstants({
      onSuccess: (data) => {
        toast.success(
          data?.message || "Constantes actualizadas correctamente!",
        );
        queryClient.invalidateQueries(["constants"]);
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Algo salió mal!");
      },
    });

  const onSubmit = (data) => {
    const submissionData = {
      air_density: Number(data.airDensity),
      gravity: Number(data.gravity),
      temperature_c: Number(data.temperatureC),
      wind_speed: Number(data.windSpeed),
      charger_efficiency: Number(data.chargerEfficiency),
    };

    updateConstants(submissionData);
  };

  const values = watch();
  const isFormFilled = Object.values(values).some(
    (v) => v !== "" && v !== null && v !== undefined,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 custom-scrollbar">
        <h2 className="text-2xl font-semibold">
          Editar constantes personalizadas
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Editar constantes para la simulación (aire, gravedad, temperatura,
          viento, cargador).
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Condiciones ambientales y carga
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Densidad del aire (kg/m³)">
                <input
                  type="number"
                  step="any"
                  {...register("airDensity")}
                  className="border rounded-lg p-3 text-sm"
                  placeholder="1.225 (estándar a nivel del mar)"
                />
              </FormField>

              <FormField label="Gravedad (m/s²)">
                <input
                  type="number"
                  step="any"
                  {...register("gravity")}
                  className="border rounded-lg p-3 text-sm"
                  placeholder="9.81"
                />
              </FormField>

              <FormField label="Temperatura (°C)">
                <input
                  type="number"
                  step="any"
                  {...register("temperatureC")}
                  className="border rounded-lg p-3 text-sm"
                  placeholder="25"
                />
              </FormField>

              <FormField label="Velocidad del viento (m/s)">
                <input
                  type="number"
                  step="any"
                  {...register("windSpeed")}
                  className="border rounded-lg p-3 text-sm"
                  placeholder="0"
                />
              </FormField>

              <FormField label="Eficiencia del cargador">
                <input
                  type="number"
                  step="any"
                  {...register("chargerEfficiency")}
                  className="border rounded-lg p-3 text-sm"
                  placeholder="90–95"
                />
              </FormField>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isUpdatingConstantsPending || !isFormFilled}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                isFormFilled && !isUpdatingConstantsPending
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isUpdatingConstantsPending
                ? "Guardando..."
                : "Guardar y Actualizar"}
            </button>
          </div>
        </form>
      </div>

      {isUpdatingConstantsPending && <Loader />}
    </div>
  );
}
