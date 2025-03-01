"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AddClientForm } from "./add-client-form";
import { ClientCard } from "./client-card";
import { Skeleton } from "./ui/skeleton";
import {
  UserRoundPlus,
  UserRoundX,
  Share,
  ArrowLeft,
  House,
  Copy,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { addProperty, EditClients, FetchProperties } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import { EditClientForm } from "./edit-client-form";
import { PropertyCardSinLike } from "./PropertyCardSinLike";
import { Property, PropertyCard } from "./PropertyCard";
import { PropertyUploadForm } from "./property-upload-form";

export default function Clients({
  showAddClientForm,
  setShowAddClientForm,
  accountsClients,
  fetchClients,
  propertiesData,
}: {
  showAddClientForm: boolean;
  setShowAddClientForm: (show: boolean) => void;
  accountsClients: any[] | null;
  fetchClients: () => void;
  propertiesData: any[] | null;
}) {
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [estado, setEstado] = useState("Todos");
  const [search, setSearch] = useState("");

  const handleSelectChange = (value: string, field: string) => {
    setEstado(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedClient(null);
  };

  const HandleEditClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setShowAddClientForm(true);
      const newClientData = {
        id: selectedClient?.id,
        name: selectedClient?.name,
        email: selectedClient?.email,
        phone: selectedClient?.phone.toString(),
        barrio: selectedClient?.barrio,
        presupuesto: selectedClient?.presupuesto.toString(),
        tipologia: selectedClient?.tipologia,
        ambientes: selectedClient?.ambientes.toString(),
        operacion: selectedClient?.operacion,
        estado: selectedClient?.estado,
      };
      console.log(newClientData);
      const response = await EditClients(newClientData);
      if (response.error) {
        throw response.error;
      }

      toast({
        description: "Cliente editado",
      });
      console.log("Cliente editado");
    } catch (err) {
      console.error("Error al editar:", err);
      toast({
        variant: "destructive",
        description: "Error al editar el cliente",
      });
    }
  };

  /* Funciones para copiar el link del cliente */
  const linkHref = `/${selectedClient?.id}?cliente=${encodeURIComponent(selectedClient?.name)}&barrio=${encodeURIComponent(selectedClient?.barrio)}&tipologia=${encodeURIComponent(selectedClient?.tipologia)}&presupuesto=${selectedClient?.presupuesto}&ambientes=${selectedClient?.ambientes}&operacion=${encodeURIComponent(selectedClient?.operacion)}`;

  const handleShare = async () => {
    try {
      const shareData = {
        title: `Propiedades para ${selectedClient?.name}`,
        text: `¡Hola! Te comparto las propiedades seleccionadas para ${selectedClient?.name}`,
        url: window.location.origin + linkHref,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          description: "¡Compartido exitosamente!",
        });
      } else {
        // Fallback para navegadores que no soportan Web Share API
        await navigator.clipboard.writeText(window.location.origin + linkHref);
        toast({
          description: "Link copiado al portapapeles",
        });
      }
    } catch (err) {
      console.error("Error al compartir:", err);
      toast({
        variant: "destructive",
        description: "Error al compartir",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + linkHref);
      toast({
        description: "Link copiado al portapapeles",
      });
      console.log("Link copiado al portapapeles");
    } catch (err) {
      console.error("Error al copiar:", err);
      toast({
        variant: "destructive",
        description: "Error al copiar el link",
      });
    }
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);

  const handleAddProperty = async (newProperty: any) => {
    const response = await addProperty(newProperty);
    if (!response.error) {
      const { data } = await FetchProperties();
      if (data) {
        setProperties(data);
      }
      setShowAddPropertyForm(false);
    }
  };
  return (
    <div className="p-4 container mx-auto">
      {currentView === "list" ? (
        <>
          <div className="flex sm:flex-row flex-col justify-between items-center mb-6 w-full gap-5">
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
          <div className="mb-4">
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
            <div className="">
              <div className="flex justify-start items-center mb-4 mt-1 gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Filtros</h3>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange(value, "estado")
                    }>
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
                <div className="flex items-center gap-2">
                  <Input
                    id="search"
                    placeholder="Buscar cliente"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className=" h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 ">
                  {accountsClients ? (
                    accountsClients.length > 0 ? (
                      accountsClients
                        .filter(
                          (client) =>
                            (estado === "Todos" || client.estado === estado) &&
                            client.name
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        )
                        .map((client) => (
                          <ClientCard
                            key={client.id}
                            {...client}
                            setShowAddClientForm={setShowAddClientForm}
                            fetchClients={fetchClients}
                            propertiesData={propertiesData}
                            onClientClick={() => {
                              setSelectedClient(client);
                              setCurrentView("detail");
                            }}
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
        </>
      ) : (
        <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={handleBackToList}
                    className="text-xl font-semibold cursor-pointer">
                    Dashboard de clientes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xl font-semibold">
                    {selectedClient?.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToList}
                className="w-auto px-2">
                <ArrowLeft size={18} /> Volver
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="w-auto px-2">
                <Share size={18} /> Compartir
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="w-auto px-2">
                <Copy size={18} /> Copiar link
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <EditClientForm
              onClientUpdated={() => {
                setShowAddClientForm(false);
                fetchClients();
              }}
              clientData={selectedClient}
            />
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 my-4">
            <div className="flex flex-col sm:flex-row justify-between items-center pb-4">
              <h2 className="text-2xl font-bold dark:text-white mb-4">
                Propiedades del cliente
              </h2>
              <Button
                className="bg-black w-full sm:w-auto"
                onClick={() => setShowAddPropertyForm(!showAddPropertyForm)}>
                {showAddPropertyForm ? "Cerrar" : "Agregar Propiedad"}
              </Button>
            </div>
            {showAddPropertyForm && (
              <div className="mb-8 flex justify-center w-full">
                <div className="w-full max-w-2xl">
                  <PropertyUploadForm
                    accountsClients={accountsClients}
                    onSubmit={handleAddProperty}
                    onCancel={() => setShowAddPropertyForm(false)}
                    onClientAdded={() => {
                      setShowAddPropertyForm(false);
                    }}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {propertiesData ? (
                propertiesData.filter(
                  (property) => property.cliente === selectedClient?.name
                ).length > 0 ? (
                  propertiesData
                    .filter(
                      (property) => property.cliente === selectedClient?.name
                    )
                    .map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={property.favorite}
                      />
                    ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
                    <House size={100} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2 text-center">
                      No hay propiedades registradas
                    </h3>
                    <p className="text-gray-500 text-center">
                      Este cliente aún no ha registrado propiedades.
                    </p>
                  </div>
                )
              ) : (
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3 dark:border-neutral-700">
                    <Skeleton className="h-48 rounded-2xl w-full bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 rounded-2xl w-42 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                      <Skeleton className="h-4 rounded-2xl w-32 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                      <Skeleton className="h-4 rounded-2xl w-24 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                      <Skeleton className="h-4 rounded-2xl w-10 bg-gray-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
