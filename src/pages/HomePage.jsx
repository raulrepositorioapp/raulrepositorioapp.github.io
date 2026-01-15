import React from "react";
import HeroBannerImage from "@/assets/Images/home-car.png";
import CommonButton from "@/components/common/CommonButton";

export default function HomePage() {
  return (
    <div className=" w-full  relative p-10">
      {/* Gradient Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px),
            radial-gradient(circle 800px at 50% 100%, #bbe5c8, transparent)
          `,
          backgroundSize: "96px 64px, 96px 64px, 100% 100%",
        }}
      />

      {/* Content */}
      <div className="relative z-0 w-full max-w-[750px] mx-auto text-center">
        <div className="inline-flex items-center gap-5 px-5 py-2 rounded-full bg-[#1CA9A6]/12 mb-5">
          <span className="text-[#1CA9A6] text-sm font-medium">
            Advanced EV Calculation Tool
          </span>
        </div>

        <h1 className="text-primary text-5xl font-semibold leading-[120%]">
          Calculate route plans for using electric vehicles
        </h1>

        <p className="text-secondary-black text-lg leading-[150%] mt-6">
          Plan your electric vehicle journey with precision. Calculate battery
          consumption, optimize routes, and find charging stations along the
          way.
        </p>

        <CommonButton className="mt-6" to={`/vechile`}>
          Start New Calculation
        </CommonButton>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center">
        <img
          src={HeroBannerImage}
          alt=""
          className="w-auto max-w-[1200px] object-contain"
        />
      </div>
    </div>
  );
}
