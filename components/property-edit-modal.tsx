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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProperty } from "@/app/actions";

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  accountsClients: any[] | null;
  onUpdate: (property: any) => void;
}

export function PropertyEditModal({
  isOpen,
  accountsClients,
  onClose,
  property,
  onUpdate,
}: PropertyEditModalProps) {
  const [propertyEdit, setPropertyEdit] = useState({
    ubicacion: property.ubicacion || "",
    direccion: property.direccion || "",
    precio: property.precio || 0,
    moneda: property.moneda || "USD",
    ambientes: property.ambientes || "",
    metros: property.metros || 0,
    dormitorios: property.dormitorios || 0,
    banos: property.banos || 0,
    imagen: property.imagen || "",
    link: property.link || "",
    cliente: property.cliente || "",
    id: property.id || "",
    favorite: property.favorite || false,
  });

  useEffect(() => {
    setPropertyEdit({
      ubicacion: property.ubicacion || "",
      direccion: property.direccion || "",
      precio: property.precio || 0,
      moneda: property.moneda || "USD",
      ambientes: property.ambientes || "",
      metros: property.metros || 0,
      dormitorios: property.dormitorios || 0,
      banos: property.banos || 0,
      imagen: property.imagen || "",
      link: property.link || "",
      cliente: property.cliente || "",
      id: property.id || "",
      favorite: property.favorite || false,
    });
  }, [property]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPropertyEdit({ ...propertyEdit, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setPropertyEdit({ ...propertyEdit, [field]: value });
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateProperty(propertyEdit);
      if (response.data) {
        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
    }
  };

  console.log("data");
  console.log(propertyEdit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Propiedad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateProperty} className=" space-y-4 ">
          <div>
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              name="ubicacion"
              value={propertyEdit.ubicacion}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="link">Link de la propiedad</Label>
            <Input
              id="link"
              name="link"
              value={propertyEdit.link}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="imagen">Link de la imagen</Label>
            <Input
              id="imagen"
              name="imagen"
              value={propertyEdit.imagen}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={propertyEdit.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                value={propertyEdit.precio}
                onChange={handleChange}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="moneda">Moneda</Label>
              <Select
                value={propertyEdit.moneda}
                onValueChange={(value) => handleSelectChange(value, "moneda")}>
                <SelectTrigger id="moneda">
                  <SelectValue placeholder="Moneda" />
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
              value={propertyEdit.ambientes}
              onValueChange={(value) => handleSelectChange(value, "ambientes")}>
              <SelectTrigger id="ambientes">
                <SelectValue placeholder="Selecciona los ambientes" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="0">Monoambiente</SelectItem>
                <SelectItem value="2">2 ambientes</SelectItem>
                <SelectItem value="3">3 ambientes</SelectItem>
                <SelectItem value="4">4 ambientes</SelectItem>
                <SelectItem value="5">5 ambientes</SelectItem>
                <SelectItem value="6">6 ambientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="metros">Metros</Label>
            <Input
              id="metros"
              name="metros"
              type="number"
              value={propertyEdit.metros}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dormitorios">Dormitorios</Label>
            <Input
              id="dormitorios"
              name="dormitorios"
              type="number"
              value={propertyEdit.dormitorios}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="banos">Baños</Label>
            <Input
              id="banos"
              name="banos"
              type="number"
              value={propertyEdit.banos}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <Select
              value={propertyEdit.cliente}
              onValueChange={(value) => handleSelectChange(value, "cliente")}>
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Selecciona el cliente" />
              </SelectTrigger>
              <SelectContent>
                {(accountsClients || []).map((client) => (
                  <SelectItem key={client.name} value={client.name}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
