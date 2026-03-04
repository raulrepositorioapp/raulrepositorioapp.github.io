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

      toast.success(data?.message || "Inicio de sesión exitoso!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "¡Algo salió mal!");
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
          Inicie sesión en su cuenta.
        </h1>

        <p className="text-[#637381] text-lg mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to={"/auth/register"} className="text-primary">
            Regístrate
          </Link>
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div>
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Dirección de correo electrónico*
            </label>
            <input
              type="email"
              placeholder="Correo electrónico"
              className={`w-full px-4 py-3.5 border rounded mt-2 focus-visible:outline-primary ${
                errors.email ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("email", { required: true })}
            />
          </div>

          {/* Password Input */}
          <div className="mt-5">
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Contraseña*
            </label>
            <input
              type="password"
              placeholder="Contraseña"
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
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-5 py-3 bg-primary rounded-xl text-white text-xl font-medium font-roboto mt-6 cursor-pointer hover:bg-primary/90 transition-all"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>

      {isLoginPending && <Loader />}
    </div>
  );
}
