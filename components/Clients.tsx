import React from "react";
import { Button } from "./ui/button";
import { AddClientForm } from "./add-client-form";
import { ClientCard } from "./client-card";

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
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-none">
      <div className="flex gap-2">
        {/* Aquí puedes renderizar elementos tipo animación o resumen */}
      </div>
      <div className=" dark:bg-neutral-800 rounded-lg  dark:border-neutral-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">
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
            />
          )}
          <div className="overflow-x-auto mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
              {accountsClients ? (
                accountsClients.map((client) => (
                  <ClientCard key={client.name} {...client} />
                ))
              ) : (
                <p className="text-center text-gray-200 dark:text-gray-400 py-8">
                  Cargando...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
