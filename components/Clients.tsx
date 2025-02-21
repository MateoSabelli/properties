import React from "react";
import { Button } from "./ui/button";
import { AddClientForm } from "./add-client-form";
import { ClientCard } from "./client-card";
import { Skeleton } from "./ui/skeleton";

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
  return (
    <div className=" px-4 h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none">
      <div className=" dark:bg-neutral-800 rounded-lg  dark:border-neutral-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold dark:text-white">
            Dashboard de clientes
          </h2>
          <Button
            className={showAddClientForm ? "hidden" : "block"}
            onClick={() => setShowAddClientForm(!showAddClientForm)}>
            Agregar Cliente
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
          <div className="overflow-x-auto mt-4 h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none pt-10 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 ">
              {accountsClients ? (
                accountsClients.length > 0 ? (
                  accountsClients.map((client) => (
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
    </div>
  );
}
