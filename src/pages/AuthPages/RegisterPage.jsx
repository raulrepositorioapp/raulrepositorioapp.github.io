import Loader from "@/components/common/Loader";
import useRegister from "@/hooks/Auth/useRegister";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  // Global States
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const termsAccepted = watch("terms");

  const { mutate: registerUser, isPending: isRegisterPending } = useRegister({
    onSuccess: (data) => {
      toast.success("Registration successful!");

      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!!!");
      console.log(err);
    },
  });

  // Form Submit Handler
  const onSubmit = (data) => {
    const submissionData = {
      email: data?.email,
      password: data?.password,
      confirm_password: data?.passwordConfirm,
    };

    registerUser(submissionData);
  };

  return (
    <div className="w-full max-w-[600px] py-6 flex flex-col gap-10">
      <div>
        <h1 className="text-[#212B36] text-[40px] font-semibold font-roboto">
          Create an account
        </h1>

        <p className="text-[#637381] text-lg mt-4">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-primary">
            Log in
          </Link>
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div>
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Email Address*
            </label>
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3.5 border rounded mt-2 focus-visible:outline-primary ${
                errors.email ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("email", { required: true })}
            />
          </div>

          {/* Password Input */}
          <div className="mt-5">
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Password*
            </label>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3.5 border rounded mt-2 focus-visible:outline-none focus-visible:border-primary ${
                errors?.password ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("password", { required: true })}
            />
          </div>

          {/* Password Confirm Input */}
          <div className="mt-5">
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Confirm Password*
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className={`w-full px-4 py-3.5 border rounded mt-2 focus-visible:outline-none focus-visible:border-primary ${
                errors?.passwordConfirm ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("passwordConfirm", { required: true })}
            />
          </div>

          {/* Terms and Conditions */}
          <label className="w-full mt-5 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("terms", { required: true })}
            />
            <span className="text-[#637381] text-lg font-roboto">
              I agree to the{" "}
              <Link
                to="/"
                className="text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Terms & Conditions
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!termsAccepted}
              className={`w-full px-5 py-3 bg-primary rounded-xl text-white text-xl font-medium font-roboto mt-6 cursor-pointer transition-all ${
                !termsAccepted
                  ? "opacity-50 cursor-pointer"
                  : "hover:bg-primary/90"
              }`}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>

      {isRegisterPending && <Loader />}
    </div>
  );
}
