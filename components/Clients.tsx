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
  ListFilter,
  Search,
  Edit,
  Save,
  X,
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
import { Tabs, TabsContent, TabsTrigger } from "./ui/tabs";
import { TabsList } from "./ui/tabs";

function replaceSpaces(text: string) {
  return text ? text.replace(/\s+/g, "%20") : "";
}

// Función para formatear la fecha (día, mes, año)
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "No disponible";

  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Función para capitalizar texto (primera letra de cada palabra en mayúscula)
const capitalizeText = (text: string | undefined) => {
  if (!text) return "No especificado";

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

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
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [isEditingResumen, setIsEditingResumen] = useState(false);
  const [editedClient, setEditedClient] = useState<any>(null);

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
        notas: selectedClient?.notas,
        created_at: selectedClient?.created_at,
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

  const nombreCliente = replaceSpaces(selectedClient?.name);
  const linkHref = `/${selectedClient?.id}?cliente=${nombreCliente}&barrio=${encodeURIComponent(selectedClient?.barrio)}&tipologia=${encodeURIComponent(selectedClient?.tipologia)}&presupuesto=${selectedClient?.presupuesto}&ambientes=${selectedClient?.ambientes}&operacion=${encodeURIComponent(selectedClient?.operacion)}`;

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

  const handleEditNotes = () => {
    setEditedNotes(selectedClient?.notas || "");
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedClient) return;

    try {
      const updatedClient = {
        ...selectedClient,
        notas: editedNotes,
      };

      await EditClients(updatedClient);

      // Actualizar el cliente seleccionado localmente
      setSelectedClient(updatedClient);
      setIsEditingNotes(false);

      // Actualizar la lista de clientes
      fetchClients();

      toast({
        description: "Notas actualizadas correctamente",
      });
    } catch (error) {
      console.error("Error al guardar las notas:", error);
      toast({
        variant: "destructive",
        description: "Error al guardar las notas",
      });
    }
  };

  const handleCancelEditNotes = () => {
    setIsEditingNotes(false);
  };

  const handleEditResumen = () => {
    setEditedClient({ ...selectedClient });
    setIsEditingResumen(true);
  };
  console.log(editedClient);

  const handleSaveResumen = async () => {
    if (!editedClient) return;

    try {
      await EditClients(editedClient);

      // Actualizar el cliente seleccionado localmente
      setSelectedClient(editedClient);
      setIsEditingResumen(false);

      // Actualizar la lista de clientes
      fetchClients();

      toast({
        description: "Información del cliente actualizada correctamente",
      });
    } catch (error) {
      console.error("Error al guardar la información del cliente:", error);
      toast({
        variant: "destructive",
        description: "Error al guardar la información del cliente",
      });
    }
  };

  const handleCancelEditResumen = () => {
    setIsEditingResumen(false);
  };

  const handleClientFieldChange = (field: string, value: any) => {
    setEditedClient((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
      {currentView === "list" ? (
        <>
          <div className="flex sm:flex-row flex-col justify-between items-center mb-6 w-full gap-5">
            <h2 className="text-3xl font-bold dark:text-white">Clientes</h2>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 mt-1 gap-3">
                <div className="relative w-full ">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Buscar cliente"
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2 relative w-full sm:w-auto">
                  <div className="relative w-full">
                    <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none " />
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange(value, "estado")
                      }>
                      <SelectTrigger className="w-full pl-10 rounded-xl">
                        <SelectValue placeholder="Filtrar por estado" />
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
              </div>
              <div className=" pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 ">
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
        <div className=" ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={handleBackToList}
                    className="text-2xl font-bold cursor-pointer">
                    Clientes
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
          <Tabs defaultValue="client">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="client">Información</TabsTrigger>
              <TabsTrigger value="properties">Propiedades</TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <div className="mb-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
                <div className="flex flex-row justify-between sm:justify-between items-start sm:items-center mb-6 border-b pb-3">
                  <h2 className="text-2xl font-bold">Información </h2>
                  {isEditingResumen ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditResumen}
                        className="flex items-center gap-1">
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveResumen}
                        className="flex items-center gap-1">
                        <Save className="h-4 w-4" />
                        Guardar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditResumen}
                      className="flex items-center gap-1">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>

                {isEditingResumen ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nombre
                        </label>
                        <Input
                          value={editedClient?.name || ""}
                          onChange={(e) =>
                            handleClientFieldChange("name", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </label>
                        <Input
                          value={editedClient?.email || ""}
                          onChange={(e) =>
                            handleClientFieldChange("email", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Teléfono
                        </label>
                        <Input
                          value={editedClient?.phone || ""}
                          onChange={(e) =>
                            handleClientFieldChange("phone", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Estado
                        </label>
                        <Select
                          value={editedClient?.estado || "Busqueda"}
                          onValueChange={(value) =>
                            handleClientFieldChange("estado", value)
                          }>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Busqueda">Búsqueda</SelectItem>
                            <SelectItem value="En proceso">
                              En proceso
                            </SelectItem>
                            <SelectItem value="Finalizado">
                              Finalizado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Operación
                        </label>
                        <Select
                          value={editedClient?.operacion || "Compra"}
                          onValueChange={(value) =>
                            handleClientFieldChange("operacion", value)
                          }>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar operación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Compra">Compra</SelectItem>
                            <SelectItem value="Alquiler">Alquiler</SelectItem>
                            <SelectItem value="Venta">Venta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Tipología
                        </label>
                        <Select
                          value={editedClient?.tipologia || "Departamento"}
                          onValueChange={(value) =>
                            handleClientFieldChange("tipologia", value)
                          }>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar tipología" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Departamento">
                              Departamento
                            </SelectItem>
                            <SelectItem value="Casa">Casa</SelectItem>
                            <SelectItem value="PH">PH</SelectItem>
                            <SelectItem value="Terreno">Terreno</SelectItem>
                            <SelectItem value="Local">Local</SelectItem>
                            <SelectItem value="Oficina">Oficina</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Ambientes
                        </label>
                        <Select
                          value={editedClient?.ambientes || "2"}
                          onValueChange={(value) =>
                            handleClientFieldChange("ambientes", value)
                          }>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar ambientes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Monoambiente</SelectItem>
                            <SelectItem value="1">1 ambiente</SelectItem>
                            <SelectItem value="2">2 ambientes</SelectItem>
                            <SelectItem value="3">3 ambientes</SelectItem>
                            <SelectItem value="4">4 ambientes</SelectItem>
                            <SelectItem value="5">5+ ambientes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Barrio
                        </label>
                        <Input
                          value={editedClient?.barrio || ""}
                          onChange={(e) =>
                            handleClientFieldChange("barrio", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Presupuesto
                        </label>
                        <Input
                          type="number"
                          value={editedClient?.presupuesto || ""}
                          onChange={(e) =>
                            handleClientFieldChange(
                              "presupuesto",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Nombre
                          </h3>
                          <p className="text-lg font-semibold">
                            {capitalizeText(selectedClient?.name)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </h3>
                          <p className="text-lg">
                            {selectedClient?.email || "No especificado"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Teléfono
                          </h3>
                          <p className="text-lg">
                            {selectedClient?.phone || "No especificado"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Estado
                          </h3>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                selectedClient?.estado === "Busqueda"
                                  ? "bg-blue-100 text-blue-800"
                                  : selectedClient?.estado === "En proceso"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : selectedClient?.estado === "Finalizado"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}>
                              {selectedClient?.estado || "No especificado"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Operación
                          </h3>
                          <p className="text-lg">
                            {capitalizeText(selectedClient?.operacion)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Tipología
                          </h3>
                          <p className="text-lg">
                            {capitalizeText(selectedClient?.tipologia)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Ambientes
                          </h3>
                          <p className="text-lg">
                            {selectedClient?.ambientes === "0"
                              ? "Monoambiente"
                              : `${selectedClient?.ambientes} ambientes` ||
                                "No especificado"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Barrio
                          </h3>
                          <p className="text-lg">
                            {capitalizeText(selectedClient?.barrio)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Presupuesto
                          </h3>
                          <p className="text-lg font-semibold">
                            $
                            {selectedClient?.presupuesto?.toLocaleString() ||
                              "No especificado"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Fecha de registro
                          </h3>
                          <p className="text-lg">
                            {formatDate(selectedClient?.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                  <h2 className="text-2xl font-bold">Notas</h2>
                  {isEditingNotes ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditNotes}
                        className="flex items-center gap-1">
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveNotes}
                        className="flex items-center gap-1">
                        <Save className="h-4 w-4" />
                        Guardar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditNotes}
                      className="flex items-center gap-1">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>

                {isEditingNotes ? (
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe notas sobre este cliente..."
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedClient?.notas || "No hay notas"}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="properties">
              <div className="flex flex-col sm:flex-row justify-between items-center pb-4">
                <h2 className="text-2xl font-bold dark:text-white mb-4">
                  {selectedClient?.operacion === "Venta"
                    ? "Propiedades a vender"
                    : selectedClient?.operacion === "Compra"
                      ? "Propiedades para comprar"
                      : "Propiedades a alquilar"}
                </h2>
                <Button
                  className="bg-black w-full sm:w-auto"
                  onClick={() => setShowAddPropertyForm(!showAddPropertyForm)}>
                  {showAddPropertyForm ? "Cerrar" : "Agregar Propiedad"}
                </Button>
              </div>
              {showAddPropertyForm && (
                <div className="mb-8 flex  w-full">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {propertiesData ? (
                  propertiesData.filter(
                    (property) => property.cliente === selectedClient?.name
                  ).length > 0 ? (
                    propertiesData
                      .filter(
                        (property) => property.cliente === selectedClient?.name
                      )
                      .map((property) => (
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
