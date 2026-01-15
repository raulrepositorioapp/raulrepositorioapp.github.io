import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthBg from "@/assets/Images/auth-bg.png";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const userToken = useSelector((state) => state?.userToken?.tokens);

  if (userToken) {
    return <Navigate to="/" />;
  }

  return (
    <main className="w-full h-screen flex items-center gap-5 p-[0.5%]">
      <div className="w-5/12 h-full">
        <img
          src={AuthBg}
          alt="Authentication Background Image"
          className="w-full max-w-full h-full object-cover"
        />
      </div>

      <div className="w-7/12 flex items-center pl-[8%]">
        <Outlet />
      </div>
    </main>
  );
}
