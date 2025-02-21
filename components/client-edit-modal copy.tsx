"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditClients } from "@/app/actions";
import { toast } from "@/hooks/use-toast";

interface ClientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onUpdate: (client: any) => void;
  onClientAdded: () => void;
}

export function ClientEditModal({
  isOpen,
  onClose,
  client,
}: ClientEditModalProps) {
  const [clientEdit, setClientEdit] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    barrio: client.barrio,
    presupuesto: client.presupuesto,
    tipologia: client.tipologia,
    ambientes: client.ambientes,
    operacion: client.operacion,
    id: client.id,
  });

  useEffect(() => {
    setClientEdit({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      barrio: client.barrio || "",
      presupuesto: client.presupuesto || 0,
      tipologia: client.tipologia || "",
      ambientes: client.ambientes || "",
      operacion: client.operacion || "",
      id: client.id || "",
    });
  }, [client]);

  console.log(clientEdit);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClientEdit({ ...clientEdit, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setClientEdit({ ...clientEdit, [field]: value });
  };

  const HandleEditClient = async () => {
    try {
      const newClientData = {
        id: clientEdit.id,
        name: clientEdit.name,
        email: clientEdit.email,
        phone: clientEdit.phone,
        barrio: clientEdit.barrio,
        presupuesto: clientEdit.presupuesto,
        tipologia: clientEdit.tipologia,
        ambientes: clientEdit.ambientes,
        operacion: clientEdit.operacion,
      };

      // Actualiza el estado si lo necesitas para el renderizado
      setClientEdit(newClientData);

      // Llama a EditClients pasando directamente el objeto actualizado
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

  console.log("data");
  console.log(clientEdit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Propiedad</DialogTitle>
        </DialogHeader>
        <form onSubmit={HandleEditClient} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={clientEdit.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={clientEdit.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="number"
                value={clientEdit.phone}
                onChange={handleChange}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="barrio">Barrio</Label>
              <Select
                value={clientEdit.barrio}
                onValueChange={(value) =>
                  handleSelectChange(value, "tipologia")
                }>
                <SelectTrigger id="barrio">
                  <SelectValue placeholder="Barrio" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="ambientes">Ambientes</Label>
            <Select
              value={clientEdit.ambientes}
              onValueChange={(value) => handleSelectChange(value, "ambientes")}>
              <SelectTrigger id="ambientes">
                <SelectValue placeholder="Selecciona los ambientes" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="0">Monoambiente</SelectItem>
                <SelectItem value="2">2 ambientes</SelectItem>
                <SelectItem value="3">3 ambientes</SelectItem>
                <SelectItem value="4">4 ambientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="operacion">Operación</Label>
            <Textarea
              id="operacion"
              name="operacion"
              value={clientEdit.operacion}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="presupuesto">Presupuesto</Label>
            <Textarea
              id="presupuesto"
              name="presupuesto"
              value={clientEdit.presupuesto}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
