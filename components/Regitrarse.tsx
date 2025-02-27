"use client";
import { signUpAction } from "@/app/actions";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Link from "next/link";

export function SignupFormDemo() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    repetirpassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    await signUpAction(data.email, data.password, data.repetirpassword);
  };
  return (
    <div className="flex justify-center items-center h-screen z-10 ">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-100 dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Bienvenido a aceternity
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Crea tu cuenta para acceder a aceternity y disfrutar de todos los
          beneficios que te ofrecemos en nuestra plataforma de Asesores.
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
          <LabelInputContainer className="mb-8">
            <Label htmlFor="repetirpassword">Repeti tu contraseña</Label>
            <div className="relative">
              <Input
                id="repetirpassword"
                placeholder="••••••••"
                type={showRepeatPassword ? "text" : "password"}
                className="pr-10"
                value={data.repetirpassword}
                onChange={(e) =>
                  setData({ ...data, repetirpassword: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showRepeatPassword ? (
                  <IconEyeOff className="h-5 w-5 text-neutral-600" />
                ) : (
                  <IconEye className="h-5 w-5 text-neutral-600" />
                )}
              </button>
            </div>
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit">
            Registrarse &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
            Ya tienes cuenta?{" "}
            <Link href="/sign-in" className="text-black">
              Inicia Sesion
            </Link>
          </p>

          {/* <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div> */}
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
