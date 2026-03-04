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
      toast.success("¡Registro exitoso!");

      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "¡Algo salió mal!");
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
          Crear una cuenta
        </h1>

        <p className="text-[#637381] text-lg mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to={"/auth/login"} className="text-primary">
            Inicia sesión
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
                errors?.password ? "border-red-500" : "border-[#D5DAE1]"
              }`}
              {...register("password", { required: true })}
            />
          </div>

          {/* Password Confirm Input */}
          <div className="mt-5">
            <label className="text-[#212B36] text-lg font-medium font-roboto">
              Confirmar contraseña*
            </label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
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
              Estoy de acuerdo con los{" "}
              <Link
                to="/"
                className="text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Términos y Condiciones
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
              Crear cuenta
            </button>
          </div>
        </form>
      </div>

      {isRegisterPending && <Loader />}
    </div>
  );
}
