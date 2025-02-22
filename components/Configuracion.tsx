import React, { useState } from "react";
import { Button } from "./ui/button";
import { AddClientForm } from "./add-client-form";
import { ClientCard } from "./client-card";
import { Skeleton } from "./ui/skeleton";
import { Filter, UserRoundPlus, UserRoundX } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Configuracion() {
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      <div className=" flex sm:flex-row flex-col  justify-between items-center mb-6 w-full gap-5">
        <h2 className="text-3xl font-bold dark:text-white">Configuracion</h2>
      </div>
      <div>
        <Input type="text" placeholder="Nombre" />
        <Input type="text" placeholder="Apellido" />
        <Input type="text" placeholder="Email" />
        <Input type="text" placeholder="Password" />
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
