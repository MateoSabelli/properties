"use client";
import { useState } from "react";
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

interface PropertyUploadFormProps {
  onSubmit: (newProperty: any) => void;
  accountsClients: any[] | null;
  onCancel: () => void;
  onClientAdded: () => void;
}

export function PropertyUploadForm({
  onSubmit,
  accountsClients,
  onCancel,
  onClientAdded,
}: PropertyUploadFormProps) {
  const [data, setData] = useState<any>({
    ubicacion: "",
    direccion: "",
    precio: 0,
    moneda: "USD",
    ambientes: "",
    metros: 0,
    dormitorios: 0,
    banos: 0,
    imagen: "",
    link: "",
    cliente: "",
  });
  console.log(data);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setData({ ...data, [field]: value });
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.precio) {
      console.error("El precio es requerido");
      return;
    }
    onSubmit(data);
    onClientAdded();
  };
  console.log(data);

  return (
    <form onSubmit={handleAddProperty} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            name="ubicacion"
            placeholder="Ej: Palermo, Buenos Aires"
            value={data.ubicacion}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            name="direccion"
            placeholder="Ej: Av. Santa Fe 1234"
            value={data.direccion}
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
              placeholder="Ej: 200000"
              value={data.precio}
              onChange={handleChange}
            />
          </div>
          <div className="w-24">
            <Label htmlFor="moneda">Moneda</Label>
            <Select
              value={data.moneda}
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
          <Label htmlFor="rooms">Ambientes</Label>
          <Select
            name="rooms"
            defaultValue="1"
            onValueChange={(value) => handleSelectChange(value, "ambientes")}>
            <SelectTrigger id="rooms">
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
          <Label htmlFor="metros">Metros</Label>
          <Input
            id="metros"
            name="metros"
            type="number"
            placeholder="Ej: 100"
            value={data.metros}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="dormitorios">Dormitorios</Label>
          <Input
            id="dormitorios"
            name="dormitorios"
            type="number"
            placeholder="Ej: 2"
            value={data.dormitorios}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="banos">Baños</Label>
          <Input
            id="banos"
            name="banos"
            type="number"
            placeholder="Ej: 2"
            value={data.banos}
            onChange={handleChange}
          />
        </div>

        <div className="flex-grow">
          <Label htmlFor="imagen">Imagen de la propiedad</Label>
          <Input
            id="imagen"
            name="imagen"
            placeholder="Ej: https://www.google.com/image.jpg"
            value={data.imagen}
            onChange={handleChange}
          />
        </div>
        <div className="flex-grow">
          <Label htmlFor="link">Link de la propiedad</Label>
          <Input
            id="link"
            name="link"
            type="text"
            placeholder="Ej: https://www.google.com/image.jpg"
            value={data.link}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="client">Asociar a Cliente</Label>
          <Select
            value={data.cliente}
            onValueChange={(value) => handleSelectChange(value, "cliente")}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Selecciona un cliente" />
            </SelectTrigger>
            <SelectContent>
              {accountsClients?.map((client) => (
                <SelectItem key={client.name} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Guardar Propiedad
      </Button>
    </form>
  );
}
