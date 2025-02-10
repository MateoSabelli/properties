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
import { updateProperty } from "@/app/actions";

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onUpdate: (property: any) => void;
}

export function PropertyEditModal({
  isOpen,
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
    imagen: property.imagen || "",
    link: property.link || "",
    descripcion: property.descripcion || "",
    cliente: property.cliente || "",
    id: property.id || "",
  });

  useEffect(() => {
    setPropertyEdit({
      ubicacion: property.ubicacion || "",
      direccion: property.direccion || "",
      precio: property.precio || 0,
      moneda: property.moneda || "USD",
      ambientes: property.ambientes || "",
      imagen: property.imagen || "",
      link: property.link || "",
      descripcion: property.descripcion || "",
      cliente: property.cliente || "",
      id: property.id || "",
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
        <form onSubmit={handleUpdateProperty} className="space-y-4">
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
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={propertyEdit.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Imágenes</Label>
            {/* <ImageUpload images={editedProperty.images} setImages={handleImageChange} /> */}
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
