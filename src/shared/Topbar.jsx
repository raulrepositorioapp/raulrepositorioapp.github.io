import CommonButton from "@/components/common/CommonButton";
import Loader from "@/components/common/Loader";
import useLogout from "@/hooks/Auth/useLogout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  // Global States
  const userTokens = useSelector((state) => state?.userToken?.tokens);

  // Common States
  const currentPath = useLocation().pathname;

  const [dynamicHeadingText, setDynamicHeadingText] = useState("");
  const [dynamicSubheading, setDynamicSubheading] = useState("");

  useEffect(() => {
    if (currentPath === "/") {
      setDynamicHeadingText("Cálculo de EV");
      setDynamicSubheading("Bienvenido de nuevo");
    } else if (currentPath === "/vechile") {
      setDynamicHeadingText("Herramientas de cálculo de rutas EV");
      setDynamicSubheading("Vehículo");
    } else if (currentPath === "/route") {
      setDynamicHeadingText("Planificador de rutas para vehículos eléctricos");
      setDynamicSubheading(
        "Calcular rutas óptimas con paradas de carga según las especificaciones del vehículo",
      );
    } else if (currentPath === "/result") {
      setDynamicHeadingText("Simulación de resultados EV");
      setDynamicSubheading(
        "Planifica tu viaje y calcula el consumo de batería",
      );
    } else if (currentPath === "/route-analysis-results") {
      setDynamicHeadingText("Simulación de resultados EV");
      setDynamicSubheading(
        "Planifica tu viaje y calcula el consumo de batería",
      );
    }
  }, [currentPath]);

  const { mutate: userLogout, isPending: isLogoutPending } = useLogout();

  const handleLogout = () => {
    const submissionData = {
      refresh: userTokens?.refresh,
    };

    userLogout(submissionData);
  };

  return (
    <div className="w-full h-full flex items-center justify-between gap-10 px-10 relative">
      <div>
        <h2 className="text-secondary-black text-2xl font-bold font-roboto">
          {dynamicHeadingText}
        </h2>
        <h6 className="text-[#637381] text-base font-roboto mt-2">
          {dynamicSubheading}
        </h6>
      </div>

      <div className="flex items-center gap-5">
        <CommonButton children="Cerrar sesión" onClick={handleLogout} />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-95/100 border-b border-[#637381]/20"></div>

      {isLogoutPending && <Loader />}
    </div>
  );
}
