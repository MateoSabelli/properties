import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Save, Edit2, Share, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { PropertyCard } from "./PropertyCard";
import { PropertyCardSinLike } from "./PropertyCardSinLike";
import { EditClients } from "@/app/actions";
import { ClientModalProps, Client } from "@/types";

export function ClientModal({
  selectedClient,
  setClientToEdit,
  onClose,
  copyToClipboard,
  copyToClipboardFavorite,
  propertiesData,
}: ClientModalProps) {
  const [editedClient, setEditedClient] = useState(selectedClient);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditedClient(selectedClient);
  }, [selectedClient]);

  const handleClose = () => {
    setEditedClient(null as any);
    onClose();
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleChange = (field: keyof Client, value: any) => {
    if (editedClient) {
      setEditedClient({ ...editedClient, [field]: value });
    }
  };

  const handleEditClick = async () => {
    try {
      if (!editedClient) return;

      const newClientData = {
        name: editedClient.name,
        email: editedClient.email,
        phone: editedClient.phone,
        barrio: editedClient.barrio,
        presupuesto: editedClient.presupuesto,
        tipologia: editedClient.tipologia,
        ambientes: editedClient.ambientes,
        operacion: editedClient.operacion,
        estado: editedClient.estado,
      };

      const response = await EditClients(newClientData);
      if (response.error) {
        throw response.error;
      }

      toast({
        description: "Cliente editado exitosamente",
      });
      onClose();
    } catch (err) {
      console.error("Error al editar:", err);
      toast({
        variant: "destructive",
        description: "Error al editar el cliente",
      });
    }
  };

  console.log(editedClient);
  return (
    <Dialog
      open={!!selectedClient}
      onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl h-screen overflow-y-auto sm:h-auto sm:max-h-[90vh] p-5 sm:p-6 w-screen sm:w-auto mx-0">
        <DialogHeader className="flex-row justify-between items-start">
          <div>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {editedClient?.name}
              <Badge>{editedClient?.estado}</Badge>
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboardFavorite}>
              <Heart size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Share size={18} />
            </Button>
            {!isEditing ? (
              <Button variant="outline" size="icon" onClick={handleEdit}>
                <Edit2 size={18} />
              </Button>
            ) : (
              <Button variant="outline" size="icon" onClick={handleSave}>
                <Save size={18} />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="properties">Propiedades</TabsTrigger>
              <TabsTrigger value="likes">Favoritos</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedClient?.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        value={editedClient?.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.email || "No tiene todavía"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedClient?.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.phone || "No disponible"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barrio">Ubicación</Label>
                    {isEditing ? (
                      <Input
                        id="barrio"
                        value={editedClient?.barrio}
                        onChange={(e) => handleChange("barrio", e.target.value)}
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.barrio}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Tipo de propiedad</Label>
                    {isEditing ? (
                      <Select value={editedClient?.tipologia}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Departamento">
                            Departamento
                          </SelectItem>
                          <SelectItem value="PH">PH</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.tipologia}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    {isEditing ? (
                      <Input
                        id="price"
                        type="number"
                        value={editedClient?.presupuesto}
                        onChange={(e) =>
                          handleChange("presupuesto", Number(e.target.value))
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        ${editedClient?.presupuesto.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rooms">Ambientes</Label>
                    {isEditing ? (
                      <Input
                        id="rooms"
                        value={editedClient?.ambientes.toString()}
                        onChange={(e) =>
                          handleChange("ambientes", e.target.value)
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {typeof editedClient?.ambientes === "number"
                          ? `${editedClient?.ambientes} ambientes`
                          : editedClient?.ambientes}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionType">Tipo de transacción</Label>
                    {isEditing ? (
                      <Select value={editedClient?.operacion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Venta">Venta</SelectItem>
                          <SelectItem value="Alquiler">Alquiler</SelectItem>
                          <SelectItem value="Compra">Compra</SelectItem>
                          <SelectItem value="No hay información">
                            No hay información
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        {editedClient?.operacion}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    {isEditing ? (
                      <Select value={editedClient?.estado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En proceso">En proceso</SelectItem>
                          <SelectItem value="Busqueda">Busqueda</SelectItem>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <Badge>{editedClient?.estado}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="properties"
              className="flex flex-col items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {propertiesData ? (
                  propertiesData.length > 0 ? (
                    propertiesData
                      .filter(
                        (property) => property.cliente === editedClient?.name
                      )
                      .map((property) => (
                        <PropertyCardSinLike
                          key={property.id}
                          property={property}
                          isFavorite={property.favorite}
                        />
                      ))
                  ) : (
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">
                        No hay propiedades favoritas
                      </h3>
                      <p className="text-gray-500">
                        Este cliente aún no ha marcado propiedades como
                        favoritas.
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
            <TabsContent
              value="likes"
              className="flex flex-col items-center justify-center ">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                {propertiesData ? (
                  propertiesData.length > 0 ? (
                    propertiesData
                      .filter(
                        (property) =>
                          property.cliente === editedClient?.name &&
                          property.favorite === true
                      )
                      .map((property) => (
                        <PropertyCardSinLike
                          key={property.id}
                          property={property}
                        />
                      ))
                  ) : (
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">
                        No hay propiedades favoritas
                      </h3>
                      <p className="text-gray-500">
                        Este cliente aún no ha marcado propiedades como
                        favoritas.
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

        <DialogFooter className="mt-6">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditClick}>Guardar cambios</Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
