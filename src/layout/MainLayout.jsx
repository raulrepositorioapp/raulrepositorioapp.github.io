import Sidebar from "@/shared/Sidebar";
import Topbar from "@/shared/Topbar";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function MainLayout() {
  const userToken = useSelector((state) => state?.userToken?.tokens);

  if (!userToken) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <main className="w-full h-screen flex">
      <div className="w-full max-w-[300px] h-screen px-5 py-8">
        <Sidebar />
      </div>

      <div className="w-full max-w-[calc(100%-300px)] h-screen bg-[#f5f6f7]">
        <div className="w-full h-[110px]">
          <Topbar />
        </div>

        <div className="w-full h-[calc(100vh-110px)] overflow-y-scroll custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
