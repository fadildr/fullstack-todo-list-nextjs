"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/services";
import jwt from "jsonwebtoken";
import { useUserContext } from "@/context/userContext";
import { EyeIcon, EyeOffIcon, ResponseModal } from "../components";
import Cookies from "js-cookie";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUserContext();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const forms = [
    {
      label: "Email",
      id: "email",
      type: "email",
      validation: {
        required: "Email harus diisi",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Alamat email tidak valid",
        },
      },
    },
    {
      label: "Password",
      id: "password",
      type: showPassword ? "text" : "password",
      validation: { required: "Password harus diisi" },
    },
  ];

  const handleLogin = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await login(data.email, data.password);
      if (res.status === 200 && res.data.token) {
        const user = jwt.decode(res.data.token) as any;
        setUser(user.user);
        Cookies.set("token", res.data.token, { path: "/", expires: 7 });
        showModal(
          "Login Berhasil",
          "Anda akan diarahkan ke halaman utama.",
          "success"
        );
        setTimeout(() => router.push("/"), 2000);
      } else {
        //@ts-ignore
        throw new Error(res.error || "Error logging in");
      }
    } catch (error) {
      showModal(
        "Login Gagal",
        error instanceof Error ? error.message : "Terjadi kesalahan saat login",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setModalState({ isOpen: true, title, message, type });
  };

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          {forms.map(({ label, id, type, validation }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <div className="relative">
                <input
                  id={id}
                  type={type}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors[id as keyof FormData]
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register(id as keyof FormData, validation)}
                />
                {id === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              {errors[id as keyof FormData] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[id as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ResponseModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
