"use client";

import { useState } from "react";
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
import { MultiSelect } from "./multi-select";

const clients = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María García" },
  { id: "3", name: "Carlos López" },
];

const ambientesOptions = [
  { value: "monoambiente", label: "Monoambiente" },
  { value: "2ambientes", label: "2 Ambientes" },
  { value: "3ambientes", label: "3 Ambientes" },
  { value: "4ambientes", label: "4 Ambientes" },
  { value: "5+ambientes", label: "5 o más Ambientes" },
];

interface Option {
  value: string;
  label: string;
}

interface PropertyUploadFormProps {
  onSubmit: (property: any) => void;
}

export function PropertyUploadForm({ onSubmit }: PropertyUploadFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");
  const [selectedAmbientes, setSelectedAmbientes] = useState<Option[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProperty = {
      images,
      location: formData.get("location"),
      address: formData.get("address"),
      ambientes: selectedAmbientes.map((a) => a.label),
      price: Number(formData.get("price")),
      currency,
      rating: 0,
      dates: "Disponible",
      description: formData.get("description"),
    };
    onSubmit(newProperty);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            placeholder="Ej: Palermo, Buenos Aires"
          />
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            placeholder="Ej: Av. Santa Fe 1234"
          />
        </div>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Ej: 200000"
            />
          </div>
          <div className="w-24">
            <Label htmlFor="currency">Moneda</Label>
            <Select
              value={currency}
              onValueChange={(value: "USD" | "ARS") => setCurrency(value)}>
              <SelectTrigger id="currency">
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
          <MultiSelect
            options={ambientesOptions}
            selected={selectedAmbientes}
            onChange={setSelectedAmbientes}
            placeholder="Seleccionar ambientes..."
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe la propiedad..."
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="client">Asociar a Cliente</Label>
          <Select>
            <SelectTrigger id="client">
              <SelectValue placeholder="Selecciona un cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Imágenes de la Propiedad</h2>
        {/* <ImageUpload images={images} setImages={setImages} /> */}
      </div>

      <Button type="submit" className="w-full">
        Guardar Propiedad
      </Button>
    </form>
  );
}
