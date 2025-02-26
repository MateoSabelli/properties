//// filepath: /c:/Users/mateo/OneDrive/Escritorio/properties/components/Login.tsx
"use client";
import { signInAction } from "@/app/actions";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      setErrorMessage("Por favor complete todos los campos");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await signInAction(data.email, data.password);
      if (response.error) {
        setErrorMessage(response.error);
      } else if (response.success) {
        // Login correcto, redireccionar
        router.push(response.redirectPath || "/protected");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setErrorMessage("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen z-10">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-200 dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Bienvenido a tu sistema de Asesor
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Inicia sesión para acceder a tu panel de asesor
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? (
                  <IconEyeOff className="h-5 w-5 text-neutral-600" />
                ) : (
                  <IconEye className="h-5 w-5 text-neutral-600" />
                )}
              </button>
            </div>
          </LabelInputContainer>

          <button
            className="flex justify-center items-center bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={loading}>
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-black border-gray-300 rounded-full animate-spin" />
            ) : (
              <>
                Iniciar Sesión &rarr;
                <BottomGradient />
              </>
            )}
          </button>
          {errorMessage && (
            <div className="flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-800 p-2 rounded-md mt-4">
              <CircleAlert className="text-red-500 h-4 w-4" />
              <p className="text-red-500 text-sm ">{errorMessage}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
            ¿No tienes cuenta?{" "}
            <Link href="/sign-up" className="text-black">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
