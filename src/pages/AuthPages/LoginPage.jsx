import Loader from "@/components/common/Loader";
import useLogin from "@/hooks/Auth/useLogin";
import { userToken } from "@/Redux/userTokenSlice";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  // Global States
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Login Mutation Hook
  const { mutate: userLogin, isPending: isLoginPending } = useLogin({
    onSuccess: (data) => {
      dispatch(userToken(data?.data));

      toast.success(data?.message || "Login Successful!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
      console.log(err);
    },
  });

  // Form Submit Handler
  const onSubmit = (data) => {
    userLogin(data);
  };

  return (
    <div className="w-full max-w-[600px] py-6 flex flex-col gap-10">
      <div>
        <h1 className="text-[#212B36] text-[40px] font-semibold font-roboto">
          Login to your account
        </h1>

        <p className="text-[#637381] text-lg mt-4">
          Dont’t have an account?{" "}
          <Link to={"/auth/register"} className="text-primary">
            Sign up
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
                errors.password ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("password", { required: true })}
            />
          </div>

          {/* Forget Password */}
          <div className="w-full flex justify-end mt-5">
            <Link
              to="#"
              className="text-primary text-lg font-medium font-roboto"
            >
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-5 py-3 bg-primary rounded-xl text-white text-xl font-medium font-roboto mt-6 cursor-pointer hover:bg-primary/90 transition-all"
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {isLoginPending && <Loader />}
    </div>
  );
}
