import React from "react";
import { Link } from "react-router-dom";
import SuccessImage from "@/assets/Images/success-frame.png";

export default function RegisterSuccessPage() {
  return (
    <div className="w-full max-w-[600px] py-6 flex flex-col gap-10">
      <div className="space-y-10 text-center">
        <div>
          <img
            src={SuccessImage}
            alt=""
            className="w-full max-w-full object-contain"
          />
        </div>

        <h1 className="text-[#212B36] text-2xl font-semibold font-roboto">
          Successfully Create an your account
        </h1>

        <Link
          to={"/auth/login"}
          className={`w-full px-5 py-3 rounded-xl text-white text-xl font-medium font-roboto bg-primary inline-block text-center cursor-pointer transition-all`}
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}
