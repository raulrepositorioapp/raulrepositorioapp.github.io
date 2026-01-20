import React from "react";
import Logo from "@/assets/Images/logo.png";
import { NavLink } from "react-router-dom";
import HomeIconSVG from "@/components/SVG/SidebarIcons/HomeIconSVG";
import CarIconSVG from "@/components/SVG/SidebarIcons/CarIconSVG";
import RoutingIconSVG from "@/components/SVG/SidebarIcons/RoutingIconSVG";
import ResultIconSVG from "@/components/SVG/SidebarIcons/ResultIconSVG";

export default function Sidebar() {
  const navStyleNormal =
    "w-full px-5 py-3 rounded-lg flex items-center gap-2 bg-white text-[#637381] text-base font-medium font-roboto inline-flex items-center gap-3 capitalize";
  const navActiveStyle =
    "w-full px-5 py-3 rounded-lg flex items-center gap-2 bg-primary text-white text-base font-medium font-roboto inline-flex items-center gap-3 capitalize";

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div className="w-full flex justify-center items-center">
        <img
          src={Logo}
          alt="Logo"
          className="w-auto max-w-[200px] object-contain"
        />
      </div>

      <div className="flex flex-col gap-5">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? navActiveStyle : navStyleNormal
          }
        >
          <div className="size-7">
            <HomeIconSVG />
          </div>
          Home
        </NavLink>

        <NavLink
          to="/vechile"
          className={({ isActive }) =>
            isActive ? navActiveStyle : navStyleNormal
          }
        >
          <div className="size-7">
            <CarIconSVG />
          </div>
          Vehicle
        </NavLink>

        {/* <NavLink
          to="/route"
          className={({ isActive }) =>
            isActive ? navActiveStyle : navStyleNormal
          }
        >
          <div className="size-7">
            <RoutingIconSVG />
          </div>
          Route
        </NavLink> */}

        <NavLink
          to="/result"
          className={({ isActive }) =>
            isActive ? navActiveStyle : navStyleNormal
          }
        >
          <div className="size-7">
            <ResultIconSVG />
          </div>
          History
        </NavLink>
      </div>
    </div>
  );
}
