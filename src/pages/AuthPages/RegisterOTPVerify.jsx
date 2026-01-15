import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterOTPVerify() {
  // Global States
  const navigate = useNavigate();

  // Common States
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Auto-focus next input when typing
  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if current is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Check if all OTP fields are filled
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpComplete) {
      const otpValue = otp.join("");
      console.log("OTP:", otpValue);
      toast.success("OTP Verification Successful!");

      setTimeout(() => {
        navigate("/auth/register-success");
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-[600px] py-6 flex flex-col gap-10">
      <div>
        <h1 className="text-[#212B36] text-[40px] font-semibold font-roboto">
          OTP Verification
        </h1>

        <p className="text-[#637381] text-lg mt-4">
          We sent a 6 digit verification code to your email
          ra*********t2025@gmail.com
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          {/* OTP Inputs */}
          <div>
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Enter 6 digit code
            </label>
            <div className="flex gap-3 mt-2">
              {otp?.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`w-14 h-14 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    digit ? "border-green-500" : "border-[#D5DAE1]"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-[#637381] text-base my-10">
            Didn't receive the code?{" "}
            <Link to={"#"} className="text-primary">
              Resend Code
            </Link>
          </p>

          {/* Submit Button */}
          <div className="w-full flex items-center gap-8 mt-6">
            <Link
              to={-1}
              className="w-full px-5 py-3 bg-white rounded-xl text-primary border border-primary text-xl font-medium font-roboto cursor-pointer inline-block text-center hover:opacity-65 transition-all"
            >
              Back
            </Link>

            <button
              type="submit"
              disabled={!isOtpComplete}
              className={`w-full px-5 py-3 rounded-xl text-white text-xl font-medium font-roboto cursor-pointer transition-all ${
                isOtpComplete
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary/50 opacity-50 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
