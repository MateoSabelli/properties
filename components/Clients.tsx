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
import { Label } from "./ui/label";

export default function Clients({
  showAddClientForm,
  setShowAddClientForm,
  accountsClients,
  fetchClients,
}: {
  showAddClientForm: boolean;
  setShowAddClientForm: (show: boolean) => void;
  accountsClients: any[] | null;
  fetchClients: () => void;
}) {
  const [estado, setEstado] = useState("Todos");
  const handleSelectChange = (value: string, field: string) => {
    setEstado(value);
  };
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      <div className=" flex sm:flex-row flex-col  justify-between items-center mb-6 w-full gap-5">
        <h2 className="text-3xl font-bold dark:text-white">
          Dashboard de clientes
        </h2>
        <Button
          className="bg-black w-full sm:w-auto"
          onClick={() => setShowAddClientForm(!showAddClientForm)}>
          {showAddClientForm ? (
            <>
              <UserRoundX className="h-4 w-4" />
              Cerrar
            </>
          ) : (
            <>
              <UserRoundPlus className="h-4 w-4" />
              Agregar cliente
            </>
          )}
        </Button>
      </div>
      <div className="">
        {showAddClientForm && (
          <AddClientForm
            onCancel={() => setShowAddClientForm(false)}
            onClientAdded={() => {
              setShowAddClientForm(false);
              fetchClients();
            }}
            onClientEdited={() => {
              setShowAddClientForm(false);
              fetchClients();
            }}
          />
        )}
        <div className="overflow-x-auto  h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none ">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Estado</h3>
              <Select
                onValueChange={(value) => handleSelectChange(value, "estado")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Busqueda">Busqueda</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 ">
            {accountsClients ? (
              accountsClients.length > 0 ? (
                accountsClients
                  .filter(
                    (client) => estado === "Todos" || client.estado === estado
                  )
                  .map((client) => (
                    <ClientCard
                      key={client.id}
                      {...client}
                      setShowAddClientForm={setShowAddClientForm}
                      fetchClients={fetchClients}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron clientes
                  </p>
                </div>
              )
            ) : (
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 dark:border-neutral-700">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 rounded-2xl w-20 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                    <Skeleton className="h-6 rounded-2xl w-10 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/4" />
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
                    <Skeleton className="h-4 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
