import CommonButton from "@/components/common/CommonButton";
import Loader from "@/components/common/Loader";
import NotificationIconSVG from "@/components/SVG/NotificationIconSVG";
import useLogout from "@/hooks/Auth/useLogout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Topbar() {
  // Global States
  const userTokens = useSelector((state) => state?.userToken?.tokens);

  // Common States
  const currentPath = useLocation().pathname;

  const [dynamicHeadingText, setDynamicHeadingText] = useState("");
  const [dynamicSubheading, setDynamicSubheading] = useState("");

  useEffect(() => {
    if (currentPath === "/") {
      setDynamicHeadingText("EV Calculation");
      setDynamicSubheading("Welcome back");
    } else if (currentPath === "/vechile") {
      setDynamicHeadingText("EV Route Calculate Tools");
      setDynamicSubheading("Vehicle");
    } else if (currentPath === "/route") {
      setDynamicHeadingText("EV Route Planner");
      setDynamicSubheading(
        "Calculate optimal routes with charging stops based on vehicle specifications"
      );
    } else if (currentPath === "/result") {
      setDynamicHeadingText("EV Result Simulation");
      setDynamicSubheading(
        "Plan your journey and calculate battery consumption"
      );
    } else if (currentPath === "/route-analysis-results") {
      setDynamicHeadingText("EV Result Simulation");
      setDynamicSubheading(
        "Plan your journey and calculate battery consumption"
      );
    } else if (currentPath === "/notification") {
      setDynamicHeadingText("Notification");
      setDynamicSubheading("Show the Notification");
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
        <CommonButton children="Logout" onClick={handleLogout} />

        {/* <CommonButton to="/auth/login" children="Login" />
        <CommonButton to="/auth/register" children="Register" /> */}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-95/100 border-b border-[#637381]/20"></div>

      {isLogoutPending && <Loader />}
    </div>
  );
}
